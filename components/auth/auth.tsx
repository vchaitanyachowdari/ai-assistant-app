
import { getSession } from '@/hooks/use-user';
import { AuthScreen } from '@/components/auth/auth-screen';

export default async function Auth({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    return <AuthScreen />;
  }

  return <>{children}</>;
}
