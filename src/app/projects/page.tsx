"use client";

import { getContract } from "thirdweb";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";
import { useReadContract, useActiveAccount } from "thirdweb/react";
import ProjectCard from "./ProjectCard";
import { useState } from "react";
import NavBar from "@/components/NavBar";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import CreateProjectModal from "@/components/CreateProjectModal";

export default function Projects() {
  const [modalOpened, setModalOpened] = useState(false);
  const account = useActiveAccount();

  const contract = getContract({
    client: client,
    chain: sepolia,
    address: "0xE2DBd6a6f549A500320EB1F6CEce2C12d9b9c71f",
  });

  const { data: projects, isPending: isProjectsLoading } = useReadContract({
    contract,
    method:
      "function getAllProjects() view returns ((uint256 id, address creator, string title, string description, uint256 targetAmount, uint256 raisedAmount, uint256 deadline, bool extendORNot, bool withdrawORNot)[])",
    params: [],
  });

  const handleOpenCreateModal = () => {
    if (!account) {
      alert("Please connect your wallet to create a project");
      return;
    }
    setModalOpened(true);
  };

  return (
    <>
      <NavBar />
      <div className="relative min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
        <div className="container mx-auto px-4 pt-20 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent mb-2">
                Charity Projects
              </h1>
              <p className="text-gray-600">
                Browse and support transparent charity initiatives on the
                blockchain
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 md:mt-0 px-6 py-3 bg-amber-500 rounded-lg text-white hover:bg-amber-600 transition-all duration-300 font-bold shadow-lg hover:shadow-amber-200 flex items-center gap-2"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Create Project
            </button>
          </div>

          {isProjectsLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : projects?.length ? (
            <>
              <p className="text-gray-600 mb-8 font-medium">
                Total Projects:{" "}
                <span className="text-amber-700">{projects.length}</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id.toString()} project={project} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 mb-6">No projects found.</p>
              <button
                onClick={handleOpenCreateModal}
                className="px-6 py-3 bg-amber-500 rounded-lg text-white hover:bg-amber-600 transition-all duration-300 font-bold"
              >
                Create the first project
              </button>
            </div>
          )}
        </div>

        <CreateProjectModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
        />
      </div>
    </>
  );
}
