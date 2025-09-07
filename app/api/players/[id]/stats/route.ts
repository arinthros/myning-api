import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validToken } from "../../../key-check";
import { headers } from "next/headers";

export async function PATCH(req: Request) {
  const headersList = await headers();
  const token = headersList.get("authorization");

  if (!token || !validToken(token?.split(" ")[1])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, stats } = await req.json();
  const exists = await prisma.player.findUnique({
    where: {
      id,
    },
  });

  if (!exists) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  } else {
    const playerStats = await prisma.playerStats.update({
      where: {
        player_id: id,
      },
      data: {
        ...stats,
      },
    });
    return NextResponse.json(playerStats);
  }
}
