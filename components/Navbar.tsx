import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, UserButton } from '@clerk/nextjs';

import MobileNav from './MobileNav';

const Navbar = () => {
  return (
    <nav className="flex-between fixed z-50 w-full border-b border-border-subtle bg-bg-primary/80 backdrop-blur-xl px-6 py-4 lg:px-10">
      <Link href="/" className="flex items-center gap-2 group">
        <Image
          src="/icons/logo.svg"
          width={28}
          height={28}
          alt="Ro0m logo"
          className="max-sm:size-8 transition-transform group-hover:scale-105"
        />
        <p className="text-xl font-semibold tracking-tight text-fg-primary max-sm:hidden">
          Ro0m
        </p>
      </Link>
      <div className="flex-between gap-5">
        <SignedIn>
          <UserButton 
            afterSignOutUrl="/sign-in"
            appearance={{
              elements: {
                avatarBox: "size-9 ring-2 ring-border-subtle hover:ring-border transition-all",
              }
            }}
          />
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
