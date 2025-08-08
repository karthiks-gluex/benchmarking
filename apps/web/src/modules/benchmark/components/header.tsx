"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Logo } from "~/components/brand";

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 pb-5 border-b border-border-secondary"
      role="banner"
    >
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
        <Link href="/" aria-label="GlueX - Home" className="">
          <Logo
            background="transparent"
            logo="full_light"
            className=""
            imageClassName="w-[168px]"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
          <a
            href="#"
            className="text-tertiary hover:text-primary text-sm transition-colors"
          >
            Docs
          </a>
          <a
            href="#"
            className="text-tertiary hover:text-primary text-sm transition-colors"
          >
            How it works
          </a>
        </nav>
      </div>
    </motion.header>
  );
};

Header.displayName = "Header";
