import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validToken } from "../../key-check";
import { headers } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const player = await prisma.player.findUnique({
    where: {
      id,
    },
    include: {
      stats: true,
    },
  });

  const mineStats = await prisma.mineStats.groupBy({
    by: ['player_id'],
    _sum: {
      kills: true,
      minerals: true,
      minutes: true,
    }
  })

  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  } else {
    return NextResponse.json({...player, mine_stats: mineStats});
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const headersList = await headers();
  const token = headersList.get("authorization");

  if (!token || !validToken(token?.split(" ")[1])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const exists = await prisma.player.findUnique({
    where: {
      id,
    },
  });

  if (!exists) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  } else {
    await prisma.player.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({});
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const headersList = await headers();
  const token = headersList.get("authorization");

  if (!token || !validToken(token?.split(" ")[1])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: newId, name, level, icon, score, stats } = await req.json();
  const exists = await prisma.player.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!exists) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  } else {
    try {
      const validKeys = Object.keys(prisma.playerStats.fields).filter(key => !['created_dt', 'updated_dt', 'id', 'player_id'].includes(key));
      const filteredStats = Object.fromEntries(
        Object.entries(stats)
          .filter(([key]) => validKeys.includes(key))
      );

      const playerStats = await prisma.player.update({
        where: {
          id: params.id,
        },
        data: {
          id: newId ?? params.id,
          name,
          level,
          icon,
          score,
          stats: {
            update: filteredStats,
          },
        },
        include: {
          stats: true,
        },
      });
      return NextResponse.json(playerStats);
    } catch (error) {
      if(error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }
  }
}
