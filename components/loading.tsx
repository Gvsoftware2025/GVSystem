export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="relative w-16 h-16">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin-slow" />
        
        {/* Middle pulsing ring */}
        <div className="absolute inset-2 rounded-full border-2 border-primary/30 animate-pulse" />
        
        {/* Inner dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
      
      <div className="ml-6 flex flex-col gap-2">
        <p className="text-foreground font-semibold">Carregando...</p>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 rounded-lg space-y-4">
      <div className="skeleton h-6 w-3/4 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-5/6 rounded" />
      <div className="skeleton h-10 w-1/3 rounded" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <LoadingSpinner />
    </div>
  );
}
