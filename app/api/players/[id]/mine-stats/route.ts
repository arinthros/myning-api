import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validToken } from "../../../key-check";
import { headers } from "next/headers";
import { MineStats } from "@prisma/client";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const mineStats = await prisma.mineStats.findMany({
    where: {
      player_id: id,
    },
  });

  if (!mineStats?.length) {
    return NextResponse.json({ error: "Player's mine stats not found" }, { status: 404 });
  } else {
    return NextResponse.json(mineStats);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const headersList = await headers();
  const token = headersList.get("authorization");

  if (!token || !validToken(token?.split(" ")[1])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mine_stats: mineStats }: { mine_stats: Array<Omit<MineStats, 'id' | 'created_dt' | 'updated_dt' | 'player_id'>>} = await req.json();
  const exists = await prisma.player.findUnique({
    where: {
      id,
    },
  });

  if (!exists) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  } else {
    const updatedStats = await Promise.all(mineStats.map(mine => {
      const { mine_name, minutes, kills, minerals } = mine;
      return prisma.mineStats.upsert({
        where: { mine_name_player_id: { mine_name, player_id: id } },
        create: {
          kills,
          minerals,
          minutes,
          mine_name,
          player_id: id
        },
        update: {
          kills,
          minerals,
          minutes,
        }
      })
    }))
    
    return NextResponse.json(updatedStats);
  }
}

export async function POST(req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const headersList = await headers();
  const token = headersList.get("authorization");

  if (!token || !validToken(token?.split(" ")[1])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mine_name, kills, minerals, minutes } = await req.json();
  const exists = await prisma.mineStats.findFirst({
    where: {
      mine_name,
      player_id: id
    },
  });
  if (exists) {
    return NextResponse.json(
      { error: "Mine stat already exists" },
      { status: 400 }
    );
  } else {
    const mineStat = await prisma.mineStats.create({
      data: {
        mine_name,
        player_id: id,
        kills,
        minutes,
        minerals,
      },
      include: {
        player: true
      }
    });
    return NextResponse.json(mineStat);
  }
}
