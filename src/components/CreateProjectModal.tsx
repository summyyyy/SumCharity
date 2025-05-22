"use client";

import { useState } from "react";
import { Button, Modal, TextInput, NumberInput, Textarea } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { client } from "../app/client";
import { sepolia } from "thirdweb/chains";

interface CreateProjectModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({
  opened,
  onClose,
}: CreateProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState<number | "">(0);
  const [deadline, setDeadline] = useState<Date | null>(null);

  const contract = getContract({
    client: client,
    chain: sepolia,
    address: "0xE2DBd6a6f549A500320EB1F6CEce2C12d9b9c71f",
  });

  const { mutate: sendTransaction } = useSendTransaction();

  const handleCreateProject = () => {
    if (
      !title ||
      targetAmount === "" ||
      !deadline ||
      title.length > 50 ||
      description.length > 800
    )
      return;

    // Convert deadline to unix timestamp
    if (!(deadline instanceof Date) || isNaN(deadline.getTime())) {
      alert("Invalid deadline date");
      return;
    }

    const unixTimestamp = Math.floor(deadline.getTime() / 1000);

    const transaction = prepareContractCall({
      contract,
      method:
        "function createProject(string _title, string _description, uint256 _targetAmount, uint256 _ddl)",
      params: [title, description, BigInt(targetAmount), BigInt(unixTimestamp)],
    });

    sendTransaction(transaction, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        alert(error);
      },
    });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTargetAmount(0);
    setDeadline(null);
  };

  const handleDateChange = (value: Date | string | null) => {
    if (value instanceof Date) {
      setDeadline(value);
    } else if (typeof value === "string") {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        setDeadline(parsedDate);
      }
    } else {
      setDeadline(null);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        onClose();
        resetForm();
      }}
      title="Create New Charity Project"
      centered
      size="lg"
    >
      <div className="space-y-2 p-2">
        <div className="mb-2">
          <TextInput
            label="Project Title"
            placeholder="Enter project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            error={
              title.length > 50
                ? "Title must be at most 50 characters long"
                : null
            }
          />
          <div className="text-xs text-right text-gray-500 mt-1">
            {title.length}/50 characters
          </div>
        </div>

        <div className="mb-2">
          <Textarea
            label="Project Description"
            placeholder="Enter project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            autosize
            minRows={4}
            error={
              description.length > 800
                ? "Description must be at most 800 characters long"
                : null
            }
          />
          <div className="text-xs text-right text-gray-500 mt-1">
            {description.length}/800 characters
          </div>
        </div>

        <div className="mb-2">
          <div className="flex items-center gap-2">
            <label className="font-medium text-sm">Target Amount (Wei)</label>
          </div>
          <NumberInput
            placeholder="Enter target amount"
            value={targetAmount}
            min={0}
            step={1}
            decimalScale={0}
            onChange={(value) => setTargetAmount(value as number | "")}
            required
          />
        </div>

        <div className="mb-2">
          <label className="font-medium text-sm mb-2 block">
            Project Deadline
          </label>
          <DateTimePicker
            placeholder="Select deadline date and time"
            value={deadline}
            onChange={handleDateChange}
            minDate={new Date()}
            required
            clearable={false}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="border-gray-300 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={title.length > 50 || description.length > 800}
          >
            Create Project
          </Button>
        </div>
      </div>
    </Modal>
  );
}
