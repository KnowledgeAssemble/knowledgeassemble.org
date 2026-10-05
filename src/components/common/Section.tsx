import type { ReactNode } from 'react';
import { useId } from 'react';
import PageContainer from '../layout/PageContainer';
import SectionHeading from './SectionHeading';

type SectionProps = {
  title: string;
  eyebrow?: string;
  lede?: string;
  action?: ReactNode;
  children: ReactNode;
  id?: string;
  /** Add a hairline top rule to separate this section from the previous one. */
  bordered?: boolean;
  className?: string;
  contentClassName?: string;
};

/**
 * Landmark section wrapper. Renders <section aria-labelledby> so screen
 * readers can navigate by region (plan §6.1, PRD §34).
 */
export default function Section({
  title,
  eyebrow,
  lede,
  action,
  children,
  id,
  bordered = false,
  className = '',
  contentClassName = 'mt-10',
}: SectionProps) {
  const headingId = useId();

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`py-16 sm:py-20 ${bordered ? 'border-t border-rule' : ''} ${className}`}
    >
      <PageContainer>
        <SectionHeading id={headingId} eyebrow={eyebrow} title={title} lede={lede} action={action} />
        <div className={contentClassName}>{children}</div>
      </PageContainer>
    </section>
  );
}
