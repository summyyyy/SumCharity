"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getContract, prepareEvent, prepareContractCall } from "thirdweb";
import { client } from "../../client";
import { sepolia } from "thirdweb/chains";
import ExtendDeadlineButton from "@/components/ExtendDeadlineButton";
import {
  useReadContract,
  useContractEvents,
  useActiveAccount,
  useSendTransaction,
} from "thirdweb/react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import {
  ArrowLeftIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ArrowPathIcon,
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
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
          <div className="h-8 bg-amber-100 rounded-full w-1/3"></div>
          <div className="h-10 bg-amber-100 rounded-lg w-2/3"></div>
          <div className="h-4 bg-amber-100 rounded-full w-1/2"></div>
          <div className="h-40 bg-amber-100 rounded-lg w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-amber-100 rounded-lg w-full"></div>
            <div className="h-32 bg-amber-100 rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-8 border border-amber-100">
              <h2 className="text-2xl font-bold text-amber-800 mb-4">
                Project Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                The project you are looking for does not exist or may have been
                removed.
              </p>
              <Link
                href="/projects"
                className="px-6 py-3 bg-amber-500 rounded-lg text-white hover:bg-amber-600 transition-all duration-300 font-bold shadow-md hover:shadow-amber-200 flex items-center justify-center gap-2"
              >
                <ArrowLeftIcon className="h-5 w-5" /> Back to all projects
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const [
    id,
    creator,
    title,
    description,
    targetAmount,
    raisedAmount,
    deadline, // Skip extendORNot
    ,
    withdrawORNot,
  ] = project;

  const progress = (Number(raisedAmount) / Number(targetAmount)) * 100;
  const deadlineDate = new Date(Number(deadline) * 1000);
  const isExpired = Date.now() > Number(deadline) * 1000;

  // Determine status based on available data
  let status = 0; // Default to Active
  if (Number(raisedAmount) >= Number(targetAmount)) {
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
    <>
      <NavBar />
      <div className="relative min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
        <div className="container mx-auto px-4 pt-20 pb-12 max-w-5xl">
          <Link
            href="/projects"
            className="inline-flex items-center text-amber-600 hover:text-amber-800 transition-colors duration-200 mb-6 font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back to all projects
          </Link>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md overflow-hidden border border-amber-100">
            <div className="p-6 border-b border-amber-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                  {title}
                </h1>
                <div className="mt-2 flex items-center text-gray-600">
                  <span className="font-medium">Project ID:</span>
                  <span className="ml-2 font-mono">{id.toString()}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {status === 0 && (
                  <button
                    onClick={handleOpenDonationModal}
                    disabled={
                      Number(raisedAmount) >= Number(targetAmount) ||
                      deadlineDate < new Date()
                    }
                    className="px-6 py-3 bg-amber-500 rounded-lg text-white hover:bg-amber-600 transition-all duration-300 font-bold shadow-md hover:shadow-amber-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <CurrencyDollarIcon className="h-5 w-5" />
                    Donate Now
                  </button>
                )}
                <ExtendDeadlineButton
                  projectId={numericProjectId}
                  isOwner={(account && account.address === creator) || false}
                  deadline={deadlineDate}
                  raisedAmount={Number(raisedAmount)}
                  targetAmount={Number(targetAmount)}
                />
                {account && account.address === creator && (
                  <button
                    onClick={handleWithdraw}
                    disabled={
                      deadlineDate > new Date() ||
                      withdrawORNot === true ||
                      Number(raisedAmount) == 0
                    }
                    className="px-6 py-3 bg-gray-700 rounded-lg text-white hover:bg-gray-800 transition-all duration-300 font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    Withdraw Funds
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6 pb-12">
              <div className="bg-amber-50/70 p-6 rounded-xl border border-amber-100">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">
                    Funding Progress
                  </span>
                  <span
                    className={`font-bold ${
                      progress >= 100 ? "text-green-600" : "text-amber-600"
                    }`}
                  >
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      progress >= 100
                        ? "bg-green-500"
                        : "bg-gradient-to-r from-amber-300 to-amber-500"
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span className="font-medium">
                    {(Number(raisedAmount) / 1e18).toFixed(4)} ETH raised
                  </span>
                  <span>
                    Target: {(Number(targetAmount) / 1e18).toFixed(2)} ETH
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-amber-100">
                  <div className="flex items-center mb-4">
                    <DocumentTextIcon className="h-6 w-6 text-amber-500 mr-2" />
                    <h3 className="text-lg font-semibold text-amber-800">
                      Project Description
                    </h3>
                  </div>
                  <div className="text-gray-600 whitespace-pre-wrap">
                    {description}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-amber-100">
                    <div className="flex items-center mb-4">
                      <ClockIcon className="h-6 w-6 text-amber-500 mr-2" />
                      <h3 className="text-lg font-semibold text-amber-800">
                        Timeline
                      </h3>
                    </div>
                    <div className="text-gray-600">
                      <div className="flex justify-between items-center mb-2">
                        <span>Deadline:</span>
                        <span className="font-medium">
                          {deadlineDate.toLocaleDateString()}
                        </span>
                      </div>
                      {!isExpired ? (
                        <div className="flex justify-between items-center">
                          <span>Time Remaining:</span>
                          <span className="text-amber-700 font-medium">
                            {daysRemaining} days left
                          </span>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span>Status:</span>
                          <span className="text-red-600 font-medium">
                            Deadline has passed
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-amber-100">
                    <div className="flex items-center mb-4">
                      <ShieldCheckIcon className="h-6 w-6 text-amber-500 mr-2" />
                      <h3 className="text-lg font-semibold text-amber-800">
                        Project Details
                      </h3>
                    </div>
                    <div className="space-y-3 text-gray-600">
                      <div className="flex justify-between items-center">
                        <span>Status:</span>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status]}`}
                        >
                          {statusMap[status]}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Creator:</span>
                        <div className="flex items-center">
                          <span className="font-mono text-sm">{`${creator.slice(
                            0,
                            6
                          )}...${creator.slice(-4)}`}</span>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(creator)
                            }
                            className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                            title="Copy address"
                          >
                            <ClipboardDocumentIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History Section */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-amber-100">
                <div className="flex items-center mb-4">
                  <UserIcon className="h-6 w-6 text-amber-500 mr-2" />
                  <h3 className="text-lg font-semibold text-amber-800">
                    Donation History
                  </h3>
                </div>

                {isEventsPending ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500">
                      Loading donation history...
                    </p>
                  </div>
                ) : projectDonations && projectDonations.length > 0 ? (
                  <div className="mt-3 overflow-x-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-amber-100">
                      <thead className="bg-amber-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider"
                          >
                            Transaction
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider"
                          >
                            Donor Address
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider"
                          >
                            Amount (ETH)
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider"
                          >
                            Block
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-amber-50">
                        {projectDonations.map((event, index) => (
                          <tr
                            key={index}
                            className="hover:bg-amber-50/50 transition-colors duration-150"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                              <div className="flex items-center">
                                {event.transactionHash ? (
                                  <>
                                    <span className="text-amber-700">
                                      {event.transactionHash.slice(0, 6)}...
                                      {event.transactionHash.slice(-4)}
                                    </span>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          event.transactionHash
                                        );
                                      }}
                                      className="ml-2 text-gray-400 hover:text-amber-600 focus:outline-none transition-colors"
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
                                <span className="text-gray-600">
                                  {event.args.donor.slice(0, 6)}...
                                  {event.args.donor.slice(-4)}
                                </span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      event.args.donor
                                    );
                                  }}
                                  className="ml-2 text-gray-400 hover:text-amber-600 focus:outline-none transition-colors"
                                  title="Copy address"
                                >
                                  <ClipboardDocumentIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-700">
                              {(Number(event.args.amount) / 1e18).toFixed(4)}
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
                  <div className="text-center py-8 text-gray-500 bg-amber-50/50 rounded-lg border border-amber-100">
                    <p>No donations have been made to this project yet</p>
                    {status === 0 && !isExpired && (
                      <button
                        onClick={handleOpenDonationModal}
                        className="mt-4 px-6 py-2 bg-amber-500 rounded-lg text-white hover:bg-amber-600 transition-all duration-300 font-medium text-sm"
                      >
                        Be the first to donate
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DonationModal
        projectId={numericProjectId}
        maxDonationAmount={Number(targetAmount) - Number(raisedAmount)}
        isOpen={isDonationModalOpen}
        onClose={handleCloseDonationModal}
      />
    </>
  );
}

// Loading fallback component
function ProjectDetailFallback() {
  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
          <div className="h-8 bg-amber-100 rounded-full w-1/3"></div>
          <div className="h-10 bg-amber-100 rounded-lg w-2/3"></div>
          <div className="h-4 bg-amber-100 rounded-full w-1/2"></div>
          <div className="h-40 bg-amber-100 rounded-lg w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-amber-100 rounded-lg w-full"></div>
            <div className="h-32 bg-amber-100 rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ProjectDetail() {
  return (
    <Suspense fallback={<ProjectDetailFallback />}>
      <ProjectDetailContent />
    </Suspense>
  );
}
