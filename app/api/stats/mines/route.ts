import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
) {

  const mineStats = await prisma.mineStats.groupBy({
    by: ['mine_name'],
    _sum: {
      kills: true,
      minutes: true,
      minerals: true,
    }
  });

  if (!mineStats?.length) {
    return NextResponse.json({ error: "Mine stats not found" }, { status: 404 });
  } else {
    return NextResponse.json(mineStats);
  }
}
