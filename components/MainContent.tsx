export default function MainContent() {
  return (
    <main className="flex-1 flex items-center justify-center relative min-h-[80vh]">
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <img src="/logo.svg" alt="Large Logo" className="w-2/3 max-w-3xl" />
      </div>
    </main>
  );
} 