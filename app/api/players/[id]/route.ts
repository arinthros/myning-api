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

  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  } else {
    return NextResponse.json(player);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const headersList = headers();
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

export async function PATCH(req: Request) {
  const headersList = headers();
  const token = headersList.get("authorization");

  if (!token || !validToken(token?.split(" ")[1])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, name, level, icon, stats } = await req.json();
  const exists = await prisma.player.findUnique({
    where: {
      id,
    },
  });

  if (!exists) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  } else {
    const playerStats = await prisma.player.update({
      where: {
        id,
      },
      data: {
        id,
        name,
        level,
        icon,
        stats: {
          update: stats
        }
      },
    });
    return NextResponse.json(playerStats);
  }
}
