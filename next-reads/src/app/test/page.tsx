export default function Test() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      {/* MOBILE */}
      <div className="block md:hidden bg-red-400 text-white p-6 rounded">
        MOBILE (do 767px)
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block bg-green-500 text-white p-6 rounded">
        DESKTOP (od 768px+)
      </div>
    </div>
  );
}
