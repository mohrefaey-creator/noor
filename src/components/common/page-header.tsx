import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  arabicTitle?: string;
  description?: string;
  className?: string;
  right?: React.ReactNode;
}

export function PageHeader({ title, arabicTitle, description, className, right }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 mb-7 sm:mb-8 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium text-ink-50 tracking-tight">
          {title}
          {arabicTitle && (
            <span
              dir="rtl"
              lang="ar"
              className="ml-3 font-arabic text-xl sm:text-2xl gold-text align-middle"
              style={{ lineHeight: 1.5 }}
            >
              {arabicTitle}
            </span>
          )}
        </h1>
        {description && (
          <p className="text-ink-300 mt-1.5 text-sm md:text-base text-balance">{description}</p>
        )}
      </div>
      {right && <div className="self-start sm:self-end">{right}</div>}
    </header>
  );
}
