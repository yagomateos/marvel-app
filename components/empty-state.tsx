export function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-12 w-12 text-gray-500 mb-4"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md">{description}</p>

      {title.includes("Error") && (
        <div className="mt-6 text-sm text-gray-500 max-w-md">
          <p>This could be due to:</p>
          <ul className="list-disc list-inside mt-2 text-left">
            <li>Missing API credentials</li>
            <li>Network connectivity issues</li>
            <li>API service being temporarily unavailable</li>
          </ul>
        </div>
      )}
    </div>
  )
}

