import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="mx-auto flex max-w-7xl justify-center p-4 sm:p-6 lg:p-8">
      <SignIn />
    </main>
  );
}
