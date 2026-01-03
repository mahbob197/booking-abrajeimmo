import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  const { status } = await req.json();

  const reservation = await prisma.reservation.update({
    where: { id },
    data: { status }
  });

  return NextResponse.json(reservation);
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  await prisma.reservation.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
