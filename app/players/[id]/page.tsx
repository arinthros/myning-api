import prisma from "@/lib/prisma";

export default async function Page({ params }: { params: { id: string } }) {
  const player = await prisma.player.findUnique({where: { id: parseInt(params.id, 10)}, include: { playerStats: true }})

  if (!player) {
    return <>404 not found</>
  }

  return (
    <div>
      <h1>{player.name}</h1>
      {player.playerStats ? 
        <ul>
          {Object.entries(player.playerStats).reduce((stats: Array<React.ReactElement>, playerStat) => {
            if (['id', 'playerId'].includes(playerStat[0])) {
              return stats
            } else {
              stats.push(<li><strong>{playerStat[0]}:</strong> {playerStat[1]}</li>)
            }
            return stats
          }, [])}
        </ul>
      : null}
    </div>
  )
}