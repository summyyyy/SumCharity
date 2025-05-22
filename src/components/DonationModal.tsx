"use client";

import { useState } from "react";
import { Modal, NumberInput, Text } from "@mantine/core";
import { getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { client } from "@/app/client";
import { sepolia } from "thirdweb/chains";
import { CurrencyDollarIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface DonationModalProps {
  projectId: number;
  maxDonationAmount: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationModal({
  projectId,
  maxDonationAmount,
  isOpen,
  onClose,
}: DonationModalProps) {
  const [donationAmount, setDonationAmount] = useState<number | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const contract = getContract({
    client: client,
    chain: sepolia,
    address: "0xE2DBd6a6f549A500320EB1F6CEce2C12d9b9c71f",
  });

  const handleDonate = async () => {
    if (!donationAmount || donationAmount <= 0) {
      return;
    }

    if (donationAmount > maxDonationAmount) {
      alert(`Maximum donation amount is ${maxDonationAmount}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const transaction = prepareContractCall({
        contract,
        method: "function donate(uint256 _projectId, uint256 _amount) payable",
        params: [BigInt(projectId), BigInt(donationAmount)],
        value: BigInt(donationAmount),
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          setIsSubmitting(false);
          onClose();
        },
        onError: (error) => {
          alert("Donation error:" + error);
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      alert("Donation error:" + error);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <h3 className="text-xl font-bold text-amber-800">Donate to Project</h3>
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
        <Text className="text-gray-600">
          Enter the amount you would like to donate to this project
        </Text>

        <div>
          <label className="font-medium text-sm text-amber-800 mb-2 block">
            Donation Amount (Wei)
          </label>
          <NumberInput
            placeholder="Enter amount"
            value={donationAmount}
            onChange={(val) =>
              setDonationAmount(typeof val === "number" ? val : undefined)
            }
            min={1}
            max={maxDonationAmount}
            step={1}
            hideControls
            required
            styles={{
              input: {
                borderColor: "rgb(251 191 36 / 0.3)",
                "&:focus": {
                  borderColor: "rgb(245 158 11)",
                },
                borderRadius: "0.5rem",
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
            onClick={handleDonate}
            disabled={
              !donationAmount ||
              donationAmount <= 0 ||
              isSubmitting ||
              isPending
            }
            className="px-6 py-2 bg-amber-500 rounded-lg text-white hover:bg-amber-600 transition-all duration-300 font-bold shadow-md hover:shadow-amber-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {isSubmitting || isPending ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                Processing...
              </>
            ) : (
              <>
                <CurrencyDollarIcon className="h-4 w-4" />
                Donate
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
