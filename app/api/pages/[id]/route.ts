import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const page = await prisma.landingPage.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json({ error: "Página não encontrada." }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Erro ao buscar a página:", error);
    return NextResponse.json({ error: "Não foi possível buscar a página." }, { status: 500 });
  }
}