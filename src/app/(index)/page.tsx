import NavBar from "@/components/NavBar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="p-4 h-screen flex flex-col gap-6 items-center justify-center container max-w-screen-lg mx-auto ">
        <div className="w-full mb-10">
          <h1 className="text-8xl">SumCharity</h1>
          <h2 className="text-2xl ml-12 mt-4 text-gray-600">
            A fair, transparent, and secure platform for charity.
          </h2>
          <Link href="/projects">
            <button className="px-4 py-3 bg-amber-500 rounded-lg mt-4 ml-4 text-white hover:bg-amber-700 cursor-pointer">
              View All Projects
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
