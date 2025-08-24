import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: "O prompt é obrigatório." }, { status: 400 });
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ error: "N8N_WEBHOOK_URL não está definida." }, { status: 500 });
    }

    // Chama o N8N para gerar o HTML
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!n8nResponse.ok) {
      throw new Error("O agente de IA não conseguiu processar a solicitação.");
    }
    const { htmlContent } = await n8nResponse.json();

    // Salva a página gerada no banco de dados
    const newPage = await prisma.landingPage.create({
      data: {
        prompt,
        html: htmlContent,
      },
    });

    // Retorna a página recém-criada para o frontend
    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro interno.";
    console.error("Erro ao criar a página:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}