"use client";

import { useState } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
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
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-amber-600 rounded-lg text-white hover:bg-amber-700 transition-all duration-300 font-bold shadow-md hover:shadow-amber-200 flex items-center gap-2"
      >
        <CalendarIcon className="h-5 w-5" />
        Extend Deadline
      </button>

      <ExtendDeadlineModal
        projectId={projectId}
        currentDeadline={deadline}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
