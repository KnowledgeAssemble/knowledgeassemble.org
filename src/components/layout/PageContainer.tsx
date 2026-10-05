import type { ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Max-width 1280px, centred, with 1rem mobile / 1.5rem+ gutters
 * (DESIGN.md §Layout Philosophy; plan §4.6).
 */
export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[1280px] px-4 sm:px-6 ${className}`}>{children}</div>
  );
}
