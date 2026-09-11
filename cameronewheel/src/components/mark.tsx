export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
      focusable="false"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <rect x="2" y="13" width="9" height="6" rx="1" fill="var(--color-bg)" />
      <rect x="21" y="13" width="9" height="6" rx="1" fill="var(--color-bg)" />
      <circle cx="16" cy="16" r="10" fill="var(--color-bg)" />
      <circle cx="16" cy="16" r="6" fill="currentColor" />
      <circle cx="16" cy="16" r="2" fill="var(--color-bg)" />
    </svg>
  );
}
