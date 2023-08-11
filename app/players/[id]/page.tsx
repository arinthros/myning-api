import prisma from "@/lib/prisma";

export default async function Page({ params }: { params: { id: string } }) {
  const player = await prisma.player.findUnique({
    where: { id: params.id },
    include: { stats: true },
  });

  if (!player) {
    return <>404 not found</>;
  }

  return (
    <div>
      <h1>{player.name}</h1>
      {player.stats ? (
        <ul>
          {Object.entries(player.stats).reduce(
            (stats: Array<React.ReactElement>, playerStat) => {
              if (["id", "player_id"].includes(playerStat[0])) {
                return stats;
              } else {
                stats.push(
                  <li>
                    <strong>{playerStat[0]}:</strong> {playerStat[1]}
                  </li>
                );
              }
              return stats;
            },
            []
          )}
        </ul>
      ) : null}
    </div>
  );
}
