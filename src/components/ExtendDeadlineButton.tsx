"use client";

import { useState } from "react";
import { Button } from "@mantine/core";
import ExtendDeadlineModal from "./ExtendDeadlineModal";

interface ExtendDeadlineButtonProps {
  projectId: number;
  isOwner: boolean;
  deadline: Date;
  raisedAmount: number;
  targetAmount: number;
}

export default function ExtendDeadlineButton({
  projectId,
  isOwner,
  deadline,
  raisedAmount,
  targetAmount,
}: ExtendDeadlineButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentTime = new Date();
  const deadlinePassed = currentTime > deadline;
  const targetNotReached = raisedAmount !== targetAmount;

  // Only show the button if all conditions are met
  const shouldShowButton = isOwner && deadlinePassed && targetNotReached;

  if (!shouldShowButton) {
    return null;
  }

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} color="yellow" size="md">
        Extend Deadline
      </Button>

      <ExtendDeadlineModal
        projectId={projectId}
        currentDeadline={deadline}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
