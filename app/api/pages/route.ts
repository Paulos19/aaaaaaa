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

    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!n8nResponse.ok) {
      const errorBody = await n8nResponse.text();
      console.error("Erro retornado pelo N8N:", errorBody);
      throw new Error("O agente de IA não conseguiu processar a solicitação.");
    }

    const responseData = await n8nResponse.json();
    
    // **MUDANÇA FINAL AQUI**
    // O agente agora retorna o HTML na chave 'output'
    const htmlContent = responseData.output;

    if (!htmlContent || typeof htmlContent !== 'string') {
        console.error("A resposta do N8N não continha 'output' no formato esperado:", responseData);
        throw new Error("A resposta da IA não veio no formato esperado.");
    }

    // Salva a página gerada no banco de dados
    const newPage = await prisma.landingPage.create({
      data: {
        prompt,
        html: htmlContent,
      },
    });

    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro interno.";
    console.error("Erro ao criar a página:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}