export default function PlayersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center">
      <div className="max-w-[800] p-4">
        {children}
      </div>
    </div>
  )
}