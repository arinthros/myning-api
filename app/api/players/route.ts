import prisma from "@/lib/prisma";
import { headers } from 'next/headers'
import { NextResponse } from "next/server";
import { validToken } from "../key-check";
import { PlayerStats } from "@prisma/client";

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const defaultStats: Omit<PlayerStats, 'id' | 'playerId'> = {
  level: 0,
  experience: BigInt(0),
  enemiesDefeated: 0,
  deaths: 0,
  timePlayed: BigInt(0),
  tripsFinished: 0,
  battlesWon: 0,
  mineralsMined: 0,
}

export async function POST(req: Request) {
  const headersList = headers()
  const token = headersList.get('authorization')

  if (!token || !validToken(token?.split(' ')[1])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, name } = await req.json();
  const exists = await prisma.player.findUnique({
    where: {
      name,
    },
  });
  if (exists) {
    return NextResponse.json({ error: "Player already exists" }, { status: 400 });
  } else {
    const player = await prisma.player.create({
      data: {
        id,
        name,
        playerStats: {
          create: {
            ...defaultStats
          }
        }
      },
    });
    return NextResponse.json(player);
  }
}

export async function GET(_req: Request) {
  const players = await prisma.player.findMany();
  if (!players) {
    return NextResponse.json({ error: "No players found" }, { status: 404 });
  } else {
    return NextResponse.json({ data: players });
  }
}