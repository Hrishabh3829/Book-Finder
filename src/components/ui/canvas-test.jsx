import { cn } from "@/lib/utils";
import { CanvasText } from "@/components/ui/canvas-text";

export function CanvasTextDemo() {
  return (
    <div className="space-y-2">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
        Can be
      </p>
      <h2
        className={cn(
          "group relative text-left text-3xl font-semibold leading-none tracking-tight text-balance sm:text-4xl md:text-5xl"
        )}
      >
        <CanvasText
          text="INTERESTING"
          backgroundClassName="bg-blue-600 dark:bg-blue-700"
          colors={[
            "rgba(0, 153, 255, 1)",
            "rgba(0, 153, 255, 0.9)",
            "rgba(0, 153, 255, 0.8)",
            "rgba(0, 153, 255, 0.7)",
            "rgba(0, 153, 255, 0.6)",
            "rgba(0, 153, 255, 0.5)",
            "rgba(0, 153, 255, 0.4)",
            "rgba(0, 153, 255, 0.3)",
            "rgba(0, 153, 255, 0.2)",
            "rgba(0, 153, 255, 0.1)",
          ]}
          lineGap={4}
          animationDuration={20}
        />
      </h2>
      <p className="max-w-sm text-xs text-muted-foreground sm:text-sm">
        Check this list of books, picked up by the website and choose
        something new.
      </p>
    </div>
  );
}
