import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validToken } from "../../key-check";
import { headers } from "next/headers";

export async function GET(req: Request) {
  const { id } = await req.json();
  const player = await prisma.player.findUnique({
    where: {
      id,
    },
    include: {
      playerStats: true
    }
  });

  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  } else {
    return NextResponse.json(player);
  }
}

export async function DELETE(req: Request) {
  const headersList = headers()
  const token = headersList.get('authorization')

  if (!token || !validToken(token?.split(' ')[1])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
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