import Link from 'next/link';
import Image from 'next/image';

import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface PermissionCardProps {
  title: string;
  iconUrl?: string;
}

const Alert = ({ title, iconUrl }: PermissionCardProps) => {
  return (
    <section className="flex-center h-screen w-full bg-bg-primary">
      <Card className="w-full max-w-[480px] border border-border-subtle bg-bg-elevated p-8 text-fg-primary rounded-swift-xl">
        <CardContent className="p-0">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-4">
              {iconUrl && (
                <div className="flex-center size-16 rounded-swift-lg bg-accent-muted border border-border-subtle">
                  <Image src={iconUrl} width={32} height={32} alt="" className="opacity-70" />
                </div>
              )}
              <p className="text-center text-lg font-medium text-fg-primary">{title}</p>
            </div>

            <Button asChild className="w-full rounded-swift bg-fg-primary py-3 text-sm font-medium text-bg-primary hover:opacity-90 transition-opacity">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Alert;
