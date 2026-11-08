"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigate } from "./PageTransition";

/** Internal link that plays the page wipe before routing. */
export default function TransitionLink({
  href,
  children,
  className,
  onClick,
  ...rest
}: { href: string; children: React.ReactNode; className?: string } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
>) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={className}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        const [path] = href.split("#");
        if ((path || "/") === pathname) return; // same page: let anchors / Lenis handle it
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </Link>
  );
}
