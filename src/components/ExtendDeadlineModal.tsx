"use client";

import { useState } from "react";
import { Modal, Text } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { client } from "@/app/client";
import { sepolia } from "thirdweb/chains";
import { CalendarIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
      title={
        <h3 className="text-xl font-bold text-amber-800">
          Extend Project Deadline
        </h3>
      }
      centered
      styles={{
        header: {
          backgroundColor: "rgb(254 243 199 / 0.7)",
          borderBottom: "1px solid rgb(251 191 36 / 0.3)",
          padding: "1rem 1.5rem",
        },
        body: {
          padding: "1.5rem",
        },
        content: {
          borderRadius: "0.75rem",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgb(251 191 36 / 0.3)",
        },
      }}
    >
      <div className="space-y-6">
        <div className="bg-amber-50/70 p-4 rounded-lg border border-amber-100">
          <div className="flex items-center text-amber-700 mb-2">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">Current Deadline</span>
          </div>
          <Text className="text-gray-700">
            {currentDeadline.toLocaleDateString()} at{" "}
            {currentDeadline.toLocaleTimeString()}
          </Text>
        </div>

        <Text className="text-gray-600">
          Select a new deadline for your project. It must be after the current
          deadline.
        </Text>

        <div>
          <label className="font-medium text-sm text-amber-800 mb-2 block">
            New Deadline
          </label>
          <DateTimePicker
            placeholder="Select new deadline"
            value={newDeadline}
            onChange={handleDateChange}
            minDate={new Date()}
            required
            styles={{
              input: {
                borderColor: "rgb(251 191 36 / 0.3)",
                "&:focus": {
                  borderColor: "rgb(245 158 11)",
                },
                borderRadius: "0.5rem",
              },
              calendarHeader: {
                backgroundColor: "rgb(251 191 36 / 0.1)",
                color: "#713f12",
              },
              day: {
                "&[data-selected]": {
                  backgroundColor: "rgb(245 158 11)",
                  color: "white",
                },
              },
            }}
          />
        </div>

        <div className="flex justify-between gap-3 mt-8">
          <button
            onClick={onClose}
            disabled={isSubmitting || isPending}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XMarkIcon className="h-4 w-4" />
            Cancel
          </button>
          <button
            onClick={handleExtendDeadline}
            disabled={!newDeadline || isSubmitting || isPending}
            className="px-6 py-2 bg-amber-600 rounded-lg text-white hover:bg-amber-700 transition-all duration-300 font-bold shadow-md hover:shadow-amber-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {isSubmitting || isPending ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                Processing...
              </>
            ) : (
              <>
                <CalendarIcon className="h-4 w-4" />
                Extend Deadline
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
