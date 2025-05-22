"use client";

import Link from "next/link";

interface ProjectCardProps {
  project: {
    id: bigint;
    creator: string;
    title: string;
    description: string;
    targetAmount: bigint;
    raisedAmount: bigint;
    deadline: bigint;
    extendORNot: boolean;
    withdrawORNot: boolean;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const progress =
    (Number(project.raisedAmount) / Number(project.targetAmount)) * 100;
  const deadlineDate = new Date(Number(project.deadline) * 1000);

  // Determine status based on available data
  let status = 0; // Default to Active
  if (Number(project.raisedAmount) >= Number(project.targetAmount)) {
    status = 1; // Completed
  } else if (Date.now() > Number(project.deadline) * 1000) {
    status = 2; // Cancelled/Expired
  }

  const statusMap = ["Active", "Completed", "Ended"];

  return (
    <Link href={`/projects/details?projectId=${project.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow cursor-pointer">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {project.title}
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Creator:</span>
            <span className="font-mono">
              {project.creator.slice(0, 6)}...{project.creator.slice(-4)}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Target Amount:</span>
            <span>{Number(project.targetAmount) / 1e18} ETH</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Raised Amount:</span>
            <span>{Number(project.raisedAmount) / 1e18} ETH</span>
          </div>

          <div className="flex justify-between items-center gap-4 text-sm text-gray-600">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`bg-amber-300 h-3 rounded-full ${
                  progress >= 100 ? "bg-green-600" : ""
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <span>{progress.toFixed(1)}%</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Deadline:</span>
            <span>{deadlineDate.toLocaleDateString()}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Status:</span>
            <span
              className={`font-medium ${
                status === 0
                  ? "text-green-600"
                  : status === 1
                  ? "text-blue-600"
                  : "text-red-600"
              }`}
            >
              {statusMap[status]}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
