import NavBar from "@/components/NavBar";

export default function ProjectsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      <main className="p-4 pt-20 min-h-screen container mx-auto">
        {children}
      </main>
    </>
  );
}
