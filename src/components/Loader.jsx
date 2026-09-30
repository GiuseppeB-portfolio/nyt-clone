export default function Loader() {
  return (
    <div role="status" aria-label="Loading stories" className="animate-pulse">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="aspect-[3/2] w-full bg-rule" />
          <div className="mt-4 h-10 w-4/5 bg-rule" />
          <div className="mt-3 h-5 w-3/5 bg-rule" />
        </div>
        <div className="space-y-6 lg:col-span-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/4 bg-rule" />
                <div className="h-5 w-full bg-rule" />
                <div className="h-5 w-2/3 bg-rule" />
              </div>
              <div className="h-24 w-24 bg-rule" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
