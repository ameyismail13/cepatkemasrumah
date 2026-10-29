// ============================================================================
// FAIL: components/UserAvatar.js
// KONSEP: Standard 1-size 1-look Default Person Avatar dengan Dynamic Color Theme
// ============================================================================

export default function UserAvatar({
  name = "User",
  colorTheme = "#22c55e",
  size = 40,
  className = "",
}) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: colorTheme,
      }}
      className={`relative rounded-full flex items-center justify-center shrink-0 shadow-inner overflow-hidden border border-black/10 select-none ${className}`}
    >
      {/* Default person silhouette SVG icon */}
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-[62%] h-[62%] text-white/95 translate-y-[2px]"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 4a4 4 0 100 8 4 4 0 000-8zm-2 9a6 6 0 00-6 6v1a1 1 0 001 1h14a1 1 0 001-1v-1a6 6 0 00-6-6h-4z"
        />
      </svg>
    </div>
  );
}

