"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getContract, prepareEvent, prepareContractCall } from "thirdweb";
import { client } from "../../client";
import { sepolia } from "thirdweb/chains";
import { Button } from "@mantine/core";
import ExtendDeadlineButton from "@/components/ExtendDeadlineButton";
import {
  useReadContract,
  useContractEvents,
  useActiveAccount,
  useSendTransaction,
} from "thirdweb/react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import DonationModal from "@/components/DonationModal";

function ProjectDetailContent() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const numericProjectId = projectId ? Number(projectId) : 0;
  const account = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();

  const contract = getContract({
    client: client,
    chain: sepolia,
    address: "0xE2DBd6a6f549A500320EB1F6CEce2C12d9b9c71f",
  });

  const { data: project, isPending } = useReadContract({
    contract,
    method:
      "function projects(uint256) view returns (uint256 id, address creator, string title, string description, uint256 targetAmount, uint256 raisedAmount, uint256 deadline, bool extendORNot, bool withdrawORNot)",
    params: [BigInt(numericProjectId)],
  });

  // Define DonationReceived event
  const donationEvent = prepareEvent({
    signature:
      "event DonationReceived(uint256 indexed projectId, address donor, uint256 amount)",
  });

  // Query donation events for this project
  const { data: donationEvents, isPending: isEventsPending } =
    useContractEvents({
      contract,
      events: [donationEvent],
      blockRange: 10000, // Look back a reasonable number of blocks
    });

  // Filter events for this project
  const projectDonations = donationEvents?.filter(
    (event) => event.args.projectId.toString() === numericProjectId.toString()
  );

  if (isPending) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-40 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <p>The project you are looking for does not exist.</p>
        <Link
          href="/projects"
          className="text-amber-500 hover:underline mt-4 flex items-center justify-center"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back to all projects
        </Link>
      </div>
    );
  }

  const [
    id,
    creator,
    title,
    description,
    targetAmount,
    raisedAmount,
    deadline,
    extendORNot,
    withdrawORNot,
  ] = project;

  const progress = (Number(raisedAmount) / Number(targetAmount)) * 100;
  const deadlineDate = new Date(Number(deadline) * 1000);
  console.log(extendORNot);

  // Determine status based on available data
  let status = 0; // Default to Active
  if (Number(raisedAmount) >= Number(targetAmount)) {
    status = 1; // Completed
  } else if (Date.now() > Number(deadline) * 1000) {
    status = 2; // Cancelled/Expired
  }

  const statusMap = ["Active", "Completed", "Ended"];

  const remainingTime = Number(deadline) * 1000 - Date.now();
  const daysRemaining = Math.max(
    0,
    Math.floor(remainingTime / (1000 * 60 * 60 * 24))
  );

  const handleOpenDonationModal = () => {
    if (!account) {
      alert("Please connect your wallet to donate to this project");
      return;
    }
    setIsDonationModalOpen(true);
  };

  const handleCloseDonationModal = () => {
    setIsDonationModalOpen(false);
  };

  // Handle withdraw function
  const handleWithdraw = () => {
    if (!account) {
      alert("Please connect your wallet to withdraw funds");
      return;
    }

    const transaction = prepareContractCall({
      contract,
      method: "function withdraw(uint256 _projectId)",
      params: [BigInt(numericProjectId)],
    });

    sendTransaction(transaction, {
      onSuccess: () => {
        alert("Withdrawal successful");
      },
      onError: (error) => {
        alert(error);
      },
    });
  };

  return (
    <div>
      <Link
        href="/projects"
        className="flex items-center text-amber-500 hover:text-amber-700 mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back to all projects
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            <div className="mt-2 flex items-center text-gray-500">
              <span className="font-medium text-gray-700">Project ID:</span>
              <span className="ml-2">{id.toString()}</span>
            </div>
          </div>
          <div className="flex gap-3">
            {status === 0 && (
              <div className="flex justify-center">
                <Button
                  size="md"
                  onClick={handleOpenDonationModal}
                  disabled={
                    Number(raisedAmount) >= Number(targetAmount) ||
                    deadlineDate < new Date()
                  }
                >
                  Donate to This Project
                </Button>
              </div>
            )}
            <ExtendDeadlineButton
              projectId={numericProjectId}
              isOwner={(account && account.address === creator) || false}
              deadline={deadlineDate}
              raisedAmount={Number(raisedAmount)}
              targetAmount={Number(targetAmount)}
            />
            {account && account.address === creator && (
              <div className="flex justify-center">
                <Button
                  size="md"
                  onClick={handleWithdraw}
                  disabled={
                    deadlineDate > new Date() ||
                    withdrawORNot === true ||
                    Number(raisedAmount) == 0
                  }
                >
                  Withdraw
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6 pb-12">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 font-medium">Progress</span>
              <span
                className={`text-amber-600 font-bold ${
                  progress >= 100 ? "text-green-600" : ""
                }`}
              >
                {progress.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`bg-amber-300 h-3 rounded-full ${
                  progress >= 100 ? "bg-green-600" : ""
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>{Number(raisedAmount) / 1e18} ETH raised</span>
              <span>Target: {Number(targetAmount) / 1e18} ETH</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">
                Description
              </h3>
              <div className="text-gray-700">{description}</div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">
                Timeline
              </h3>
              <div>
                <div className="text-gray-700">
                  Deadline: {deadlineDate.toLocaleString()}
                </div>
                {status === 0 && (
                  <div className="text-sm mt-1 text-gray-600">
                    {daysRemaining} days remaining
                  </div>
                )}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">
                Status
              </h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  status === 0
                    ? "bg-green-100 text-green-800"
                    : status === 1
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {statusMap[status]}
              </span>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">
                Created by
              </h3>
              <div className="font-mono text-sm break-all">{creator}</div>
            </div>
          </div>

          {/* Transaction History Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">
              Transaction History
            </h3>

            {isEventsPending ? (
              <div className="text-gray-500">
                Loading transaction history...
              </div>
            ) : projectDonations && projectDonations.length > 0 ? (
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Transaction
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Donor Address
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount (ETH)
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Block
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projectDonations.map((event, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          <div className="flex items-center">
                            {event.transactionHash ? (
                              <>
                                <span>
                                  {event.transactionHash.slice(0, 6)}...
                                  {event.transactionHash.slice(-4)}
                                </span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      event.transactionHash
                                    );
                                  }}
                                  className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                  title="Copy transaction hash"
                                >
                                  <ClipboardDocumentIcon className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              "N/A"
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          <div className="flex items-center">
                            <span>
                              {event.args.donor.slice(0, 6)}...
                              {event.args.donor.slice(-4)}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(event.args.donor);
                              }}
                              className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                              title="Copy address"
                            >
                              <ClipboardDocumentIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {Number(event.args.amount) / 1e18}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.transactionHash
                            ? `Block #${event.blockNumber?.toString()}`
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500">
                No donation transactions found
              </div>
            )}
          </div>
        </div>
      </div>

      <DonationModal
        projectId={numericProjectId}
        maxDonationAmount={Number(targetAmount) - Number(raisedAmount)}
        isOpen={isDonationModalOpen}
        onClose={handleCloseDonationModal}
      />
    </div>
  );
}

// Loading fallback component
function ProjectDetailFallback() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-40 bg-gray-200 rounded w-full"></div>
    </div>
  );
}

export default function ProjectDetail() {
  return (
    <Suspense fallback={<ProjectDetailFallback />}>
      <ProjectDetailContent />
    </Suspense>
  );
}
