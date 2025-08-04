import UsersTable from "@/components/dashboard/users/users-table";

const UsuariosPage = () => {
  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto p-4 md:p-24">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <UsersTable />
    </div>
  );
};

export default UsuariosPage;
