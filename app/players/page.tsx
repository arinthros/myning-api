import prisma from "@/lib/prisma";

export default async function PlayersPage() {
  const players = await prisma.player.findMany()
  return (
    <>
      <h1>Myners</h1>
      {players ? (
        <ul>{players.map(player => <li key={player.id}><a href={`/players/${player.id}`}>{player.name}</a></li>)}</ul>
      )
      : null}
    </>
  );
}
