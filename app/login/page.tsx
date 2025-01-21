import LoginForm from '../ui/login-form';

export default async function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <LoginForm/>
      </div>
    </main>
  );
}