export function EmptyContent({ label }: { label: string }) {
  return (
    <div className="flex h-64 w-full items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/20 p-6 text-center">
      <p className="text-lg font-semibold text-muted-foreground italic">
        KONTEN {label.toUpperCase()} KOSONG
      </p>
    </div>
  )
}
