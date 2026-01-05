'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/icons/hamburger.svg"
            width={32}
            height={32}
            alt="Menu"
            className="cursor-pointer sm:hidden opacity-80 hover:opacity-100 transition-opacity"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-r border-border-subtle bg-bg-primary p-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icons/logo.svg"
              width={28}
              height={28}
              alt="Ro0m logo"
            />
            <p className="text-xl font-semibold tracking-tight text-fg-primary">Ro0m</p>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-2 pt-12 text-fg-primary">
                {sidebarLinks.map((item) => {
                  const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);

                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={item.route}
                        key={item.label}
                        className={cn(
                          'flex gap-4 items-center p-4 rounded-swift w-full max-w-60 transition-all duration-200',
                          'hover:bg-accent-muted',
                          {
                            'bg-fg-primary text-bg-primary hover:bg-fg-primary': isActive,
                          }
                        )}
                      >
                        <Image
                          src={item.imgURL}
                          alt={item.label}
                          width={20}
                          height={20}
                          className={cn(
                            'transition-all',
                            isActive ? 'brightness-0' : 'opacity-70'
                          )}
                        />
                        <p className={cn(
                          'text-[15px] font-medium transition-colors',
                          isActive ? 'text-bg-primary' : 'text-fg-secondary'
                        )}>
                          {item.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
