"use client";

import { useState } from "react";
import { Modal, TextInput, NumberInput, Textarea } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { client } from "../app/client";
import { sepolia } from "thirdweb/chains";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
      title={
        <h3 className="text-xl font-bold text-amber-800">Create New Charity Project</h3>
      }
      centered
      size="lg"
      styles={{
        header: {
          backgroundColor: 'rgb(254 243 199 / 0.7)',
          borderBottom: '1px solid rgb(251 191 36 / 0.3)',
          padding: '1rem 1.5rem',
        },
        body: {
          padding: '1.5rem',
        },
        content: {
          borderRadius: '0.75rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgb(251 191 36 / 0.3)',
        },
      }}
    >
      <div className="space-y-4">
        <div>
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
            styles={{
              label: {
                fontWeight: '500',
                marginBottom: '0.3rem',
                color: '#713f12',
              },
              input: {
                borderColor: 'rgb(251 191 36 / 0.3)',
                '&:focus': {
                  borderColor: 'rgb(245 158 11)',
                },
                borderRadius: '0.5rem',
              },
            }}
          />
          <div className="text-xs text-right text-amber-700 mt-1">
            {title.length}/50 characters
          </div>
        </div>

        <div>
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
            styles={{
              label: {
                fontWeight: '500',
                marginBottom: '0.3rem',
                color: '#713f12',
              },
              input: {
                borderColor: 'rgb(251 191 36 / 0.3)',
                '&:focus': {
                  borderColor: 'rgb(245 158 11)',
                },
                borderRadius: '0.5rem',
              },
            }}
          />
          <div className="text-xs text-right text-amber-700 mt-1">
            {description.length}/800 characters
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <label className="font-medium text-sm text-amber-800">Target Amount (Wei)</label>
          </div>
          <NumberInput
            placeholder="Enter target amount"
            value={targetAmount}
            min={0}
            step={1}
            decimalScale={0}
            onChange={(value) => setTargetAmount(value as number | "")}
            required
            styles={{
              input: {
                borderColor: 'rgb(251 191 36 / 0.3)',
                '&:focus': {
                  borderColor: 'rgb(245 158 11)',
                },
                borderRadius: '0.5rem',
              },
            }}
          />
        </div>

        <div>
          <label className="font-medium text-sm text-amber-800 mb-2 block">
            Project Deadline
          </label>
          <DateTimePicker
            placeholder="Select deadline date and time"
            value={deadline}
            onChange={handleDateChange}
            minDate={new Date()}
            required
            clearable={false}
            styles={{
              input: {
                borderColor: 'rgb(251 191 36 / 0.3)',
                '&:focus': {
                  borderColor: 'rgb(245 158 11)',
                },
                borderRadius: '0.5rem',
              },
              calendarHeader: {
                backgroundColor: 'rgb(251 191 36 / 0.1)',
                color: '#713f12',
              },
              day: {
                '&[data-selected]': {
                  backgroundColor: 'rgb(245 158 11)',
                  color: 'white',
                },
              },
            }}
          />
        </div>

        <div className="flex justify-between gap-3 mt-8">
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 font-medium flex items-center gap-1"
          >
            <XMarkIcon className="h-4 w-4" />
            Cancel
          </button>
          <button
            onClick={handleCreateProject}
            disabled={
              !title || 
              !description || 
              !targetAmount || 
              !deadline || 
              title.length > 50 || 
              description.length > 800
            }
            className="px-6 py-2 bg-amber-500 rounded-lg text-white hover:bg-amber-600 transition-all duration-300 font-bold shadow-md hover:shadow-amber-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <PlusCircleIcon className="h-4 w-4" />
            Create Project
          </button>
        </div>
      </div>
    </Modal>
  );
}
