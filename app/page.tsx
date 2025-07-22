import Auth from "@/components/auth/auth";
import { Dashboard } from "@/components/dashboard/dashboard";

export default function Home() {
  return (
    <Auth>
      <Dashboard />
    </Auth>
  );
}
