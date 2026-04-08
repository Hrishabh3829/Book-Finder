import { Button } from "./ui/button";

const Pagination = ({
  page,
  pageSize = 12,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20],
}) => {
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));

  if (totalPages <= 1) return null;

  const current = Math.min(Math.max(1, page), totalPages);

  const goTo = (nextPage) => {
    const value = Math.min(Math.max(1, nextPage), totalPages);
    if (value !== current) onPageChange?.(value);
  };

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, current - 2);
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i += 1) pages.push(i);

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t pt-4 text-xs text-muted-foreground sm:flex-row">
      <div>
        <span className="font-medium text-foreground">{total}</span>{" "}
        results • Page {current} of {totalPages}
      </div>
      <div className="inline-flex items-center gap-2">
        <label className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs text-foreground">
          <select
            className="bg-transparent text-xs font-medium outline-none"
            value={pageSize}
            onChange={(event) => onPageSizeChange?.(Number(event.target.value))}
            aria-label="Results per page"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </label>
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-full"
          onClick={() => goTo(current - 1)}
          disabled={current === 1}
        >
          ←
        </Button>
        {start > 1 && (
          <>
            <Button
              variant={current === 1 ? "secondary" : "ghost"}
              size="icon-sm"
              className="rounded-full px-3 text-xs"
              onClick={() => goTo(1)}
            >
              1
            </Button>
            {start > 2 && <span className="px-1">…</span>}
          </>
        )}
        {pages.map((p) => (
          <Button
            key={p}
            variant={p === current ? "secondary" : "ghost"}
            size="icon-sm"
            className="rounded-full px-3 text-xs"
            onClick={() => goTo(p)}
          >
            {p}
          </Button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1">…</span>}
            <Button
              variant={current === totalPages ? "secondary" : "ghost"}
              size="icon-sm"
              className="rounded-full px-3 text-xs"
              onClick={() => goTo(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-full"
          onClick={() => goTo(current + 1)}
          disabled={current === totalPages}
        >
          →
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
