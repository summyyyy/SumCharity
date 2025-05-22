"use client";

import { useState } from "react";
import { Modal, Button, Group, Text, Stack } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { client } from "@/app/client";
import { sepolia } from "thirdweb/chains";

interface ExtendDeadlineModalProps {
  projectId: number;
  currentDeadline: Date;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExtendDeadlineModal({
  projectId,
  currentDeadline,
  isOpen,
  onClose,
}: ExtendDeadlineModalProps) {
  const [newDeadline, setNewDeadline] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateChange = (value: Date | string | null) => {
    if (value instanceof Date) {
      setNewDeadline(value);
    } else if (typeof value === "string") {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        setNewDeadline(parsedDate);
      }
    } else {
      setNewDeadline(null);
    }
  };

  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const contract = getContract({
    client: client,
    chain: sepolia,
    address: "0xE2DBd6a6f549A500320EB1F6CEce2C12d9b9c71f",
  });

  const handleExtendDeadline = async () => {
    if (!newDeadline) {
      alert("Please select a new deadline");
      return;
    }

    const now = new Date();
    if (newDeadline <= now) {
      alert("New deadline must be in the future");
      return;
    }

    if (newDeadline <= currentDeadline) {
      alert("New deadline must be after the current deadline");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert deadline to unix timestamp
      const newDeadlineTimestamp = Math.floor(newDeadline.getTime() / 1000);

      const transaction = prepareContractCall({
        contract,
        method: "function extendDeadline(uint256 _projectId, uint256 _newddl)",
        params: [BigInt(projectId), BigInt(newDeadlineTimestamp)],
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          setIsSubmitting(false);
          onClose();
        },
        onError: (error) => {
          alert("Extension error: " + error);
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      alert("Extension error: " + error);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Extend Project Deadline"
      centered
    >
      <Stack>
        <Text size="sm" c="dimmed">
          Current deadline: {currentDeadline.toLocaleString()}
        </Text>
        <Text size="sm" c="dimmed">
          Select a new deadline for your project. It must be after the current
          deadline.
        </Text>

        <DateTimePicker
          label="New Deadline"
          placeholder="Select new deadline"
          value={newDeadline}
          onChange={handleDateChange}
          minDate={new Date()}
          required
        />

        <Group justify="flex-end" mt="md">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting || isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExtendDeadline}
            loading={isSubmitting || isPending}
          >
            Extend Deadline
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
