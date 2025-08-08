import CreateGroupButton from "@/components/dashboard/groups/createGroupButton";

export default function GruposPage() {
  return (
    <div className="flex flex-col gap-4 max-w-7xl w-full p-4 md:p-8">
      <h1 className="text-2xl font-bold">Grupos</h1>
      <CreateGroupButton />
    </div>
  );
}
