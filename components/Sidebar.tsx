'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between border-r border-border-subtle bg-bg-primary p-6 pt-28 text-fg-primary max-sm:hidden lg:w-[264px]">
      <div className="flex flex-1 flex-col gap-2">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          
          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                'flex gap-4 items-center p-4 rounded-swift transition-all duration-200',
                'hover:bg-accent-muted',
                {
                  'bg-fg-primary text-bg-primary hover:bg-fg-primary': isActive,
                }
              )}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={22}
                height={22}
                className={cn(
                  'transition-all',
                  isActive ? 'brightness-0' : 'opacity-70'
                )}
              />
              <p className={cn(
                'text-[15px] font-medium max-lg:hidden transition-colors',
                isActive ? 'text-bg-primary' : 'text-fg-secondary'
              )}>
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
