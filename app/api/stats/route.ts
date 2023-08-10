import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const stats = await prisma.playerStats.findMany({
    include: {
      player: true
    }
  });

  if (!stats) {
    return NextResponse.json({ error: "Stats not found" }, { status: 404 });
  } else {
    return NextResponse.json(stats);
  }
}