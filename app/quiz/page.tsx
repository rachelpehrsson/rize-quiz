import Link from 'next/link';

export default function Page() {
    return (
      <main className="flex min-h-screen flex-col p-6">
        <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
          <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
            <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            Answer the following questions. Click Next to see the next questions
            </p>
          </div>
          <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
            {/* Add questions here */}
          </div>
        </div>
      </main>
    );
  }