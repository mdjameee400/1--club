import { site } from "@/lib/site";

const base = { viewBox: "0 0 24 24", width: 18, height: 18, "aria-hidden": true } as const;

export function InstagramIcon() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MessengerIcon() {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 3C7 3 3 6.7 3 11.3c0 2.6 1.3 4.9 3.3 6.4V21l3-1.7c.8.2 1.7.4 2.7.4 5 0 9-3.7 9-8.4S17 3 12 3Z" />
      <path d="m7.5 13.6 3.2-3.4 2.3 2.1 3.5-2.2-3.4 3.5-2.3-2.1-3.3 2.1Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Round icon links. Only configured channels are rendered (no dead "#" links). */
export function SocialLinks({ className = "" }: { className?: string }) {
  const item =
    "grid h-11 w-11 place-items-center rounded-full border transition-colors duration-300";
  return (
    <div className={`flex gap-3 ${className}`}>
      <a
        href={site.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className={item}
      >
        <InstagramIcon />
      </a>
      {site.facebook && (
        <a
          href={site.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className={item}
        >
          <FacebookIcon />
        </a>
      )}
      {site.chatUrl && (
        <a
          href={site.chatUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message us on Messenger"
          className={item}
        >
          <MessengerIcon />
        </a>
      )}
    </div>
  );
}
