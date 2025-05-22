"use client";

import { getContract } from "thirdweb";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";
import { useReadContract, useActiveAccount } from "thirdweb/react";
import ProjectCard from "./ProjectCard";
import { useState } from "react";
import { Button } from "@mantine/core";
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
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl uppercase font-bold text-gray-600">
          All Charity Projects
        </h1>
        <Button
          onClick={handleOpenCreateModal}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create Project
        </Button>
      </div>

      {isProjectsLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p className="text-gray-600 mb-6">
            Total Projects: {projects?.length || 0}
          </p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-6">
            {projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      <CreateProjectModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </div>
  );
}
