export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="relative flex flex-col items-center gap-4">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary animate-glow"
        >
          <path
            d="M12 2L2 8V16L12 22L22 16V8L12 2Z"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M22 8L12 13L2 8"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M12 22V13"
            stroke="hsl(var(--accent))"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-lg font-bold tracking-widest text-foreground">PRISM</p>
      </div>
    </div>
  );
}
