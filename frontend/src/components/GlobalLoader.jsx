import { useLoading } from "../context/LoadingContext";

export default function GlobalLoader() {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white px-6 py-5 rounded-2xl shadow-lg flex flex-col items-center">
        <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-gray-600 text-sm">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}
