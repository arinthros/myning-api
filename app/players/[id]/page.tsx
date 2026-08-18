import prisma from "@/lib/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const player = await prisma.player.findUnique({
    where: { id },
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
              if (["id", "player_id", "created_dt", "updated_dt"].includes(playerStat[0])) {
                return stats;
              } else {
                stats.push(
                  <li>
                    <strong>{playerStat[0]}:</strong> {playerStat[1].toString()}
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
