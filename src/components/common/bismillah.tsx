import { cn } from "@/lib/utils";

export function Bismillah({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center my-6", className)} dir="rtl" lang="ar">
      <span
        className="font-arabic text-3xl md:text-4xl gold-text"
        style={{ lineHeight: 1.7, paddingBlock: "0.15em" }}
      >
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </span>
    </div>
  );
}
