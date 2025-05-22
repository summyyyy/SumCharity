"use client";

import Link from "next/link";
import {
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

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
  const isExpired = Date.now() > Number(project.deadline) * 1000;
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (Number(project.deadline) * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  // Determine status based on available data
  let status = 0; // Default to Active
  if (Number(project.raisedAmount) >= Number(project.targetAmount)) {
    status = 1; // Completed
  } else if (isExpired) {
    status = 2; // Cancelled/Expired
  }

  const statusMap = ["Active", "Completed", "Ended"];
  const statusClasses = [
    "bg-green-100 text-green-800",
    "bg-blue-100 text-blue-800",
    "bg-red-100 text-red-800",
  ];

  const truncateDescription = (description: string, maxLength = 100) => {
    if (description.length <= maxLength) return description;
    return `${description.substring(0, maxLength)}...`;
  };

  return (
    <Link href={`/projects/details?projectId=${project.id}`} className="block">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-amber-100 h-full flex flex-col">
        <div className="p-5 border-b border-amber-100 flex-1">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-xl font-bold text-amber-800 mr-4">
              {project.title}
            </h2>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClasses[status]}`}
            >
              {statusMap[status]}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 h-16 line-clamp-3">
            {truncateDescription(project.description)}
          </p>

          <div className="space-y-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <UserIcon className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="font-mono text-xs overflow-hidden text-ellipsis">
                {project.creator.slice(0, 6)}...{project.creator.slice(-4)}
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-medium text-amber-700 flex items-center">
                  <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                  {(Number(project.raisedAmount) / 1e18).toFixed(4)} ETH
                </span>
                <span className="text-gray-500">
                  of {(Number(project.targetAmount) / 1e18).toFixed(2)} ETH
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    progress >= 100
                      ? "bg-green-500"
                      : "bg-gradient-to-r from-amber-300 to-amber-500"
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>

              <div className="flex justify-end mt-1">
                <span className="text-xs font-medium text-amber-700">
                  {progress.toFixed(1)}% funded
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50/50 p-4 flex justify-between items-center">
          <div className="flex items-center text-sm">
            <ClockIcon className="w-4 h-4 mr-1 text-amber-700" />
            <span
              className={`${
                isExpired ? "text-red-600" : "text-amber-700"
              } font-medium`}
            >
              {isExpired ? "Ended" : `${daysLeft} days left`}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {deadlineDate.toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
