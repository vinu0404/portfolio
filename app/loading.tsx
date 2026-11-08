export default function Loading() {
  return (
    <div className="grid min-h-[100svh] place-items-center" role="status" aria-label="Loading">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan" />
      </span>
    </div>
  );
}
