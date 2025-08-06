import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User } from "lucide-react";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;
  const payload = token ? await verifyJwt(token) : null;

  if (!payload) {
    return (
      <div className="text-center mt-10 text-red-500">
        Por favor inicia sesión para acceder al Dashboard.
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
      <Card className="w-full shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Bienvenido al Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-black">
          <div className="flex items-center space-x-2">
            {payload.rolId === 1 ? (
              <User className="w-5 h-5 text-blue-600" aria-label="Superadmin" />
            ) : payload.rolId === 2 ? (
              <User className="w-5 h-5 text-green-600" aria-label="Admin" />
            ) : (
              <User className="w-5 h-5 text-gray-600" />
            )}
            <span className="text-sm">ID de usuario: {payload.id}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-gray-600" />
            <span className="text-sm">Correo: {payload.email}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
