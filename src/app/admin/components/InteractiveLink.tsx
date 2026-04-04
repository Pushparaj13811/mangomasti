"use client";

import Link from "next/link";
import { useState, CSSProperties } from "react";

interface InteractiveLinkProps {
  href: string;
  children: React.ReactNode;
  style?: CSSProperties;
  hoverStyle?: CSSProperties;
  target?: string;
}

export default function InteractiveLink({ href, children, style, hoverStyle, target }: InteractiveLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  const combinedStyle = {
    ...style,
    ...(isHovered && hoverStyle ? hoverStyle : {}),
  };

  return (
    <Link
      href={href}
      target={target}
      style={combinedStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}
