
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Logo = ({
  className,
  spanDesign,
}: {
  className?: string;
  spanDesign?: string;
}) => {
  return (
    <Link href="/" aria-label="NovaCart home" className="inline-flex">
      <h2
        className={cn(
          "group font-sans text-2xl font-black uppercase tracking-tight text-[#292720] transition-colors duration-200 hover:text-[#B65230]",
          className
        )}
      >
        Nova
        <span
          className={cn(
            "text-[#B65230] transition-colors duration-200 group-hover:text-[#292720]",
            spanDesign
          )}
        >
          Cart
        </span>
        <span className="ml-1 align-top text-xs font-semibold text-[#B65230]">
          ®
        </span>
      </h2>
    </Link>
  );
};

export default Logo;

