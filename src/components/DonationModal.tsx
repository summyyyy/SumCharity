"use client";

import { useState } from "react";
import { Modal, Button, NumberInput, Group, Text, Stack } from "@mantine/core";
import { getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { client } from "@/app/client";
import { sepolia } from "thirdweb/chains";

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
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
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
    <Modal opened={isOpen} onClose={onClose} title="Donate to Project" centered>
      <Stack>
        <Text size="sm" c="dimmed">
          Enter the amount you would like to donate to this project
        </Text>

        <NumberInput
          label="Donation Amount (Wei)"
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
        />

        <Group justify="flex-end" mt="md">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting || isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleDonate} loading={isSubmitting || isPending}>
            Donate
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
