import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: "N8N_WEBHOOK_URL não está definida." },
        { status: 500 }
      );
    }
    
    if (!prompt) {
      return NextResponse.json(
        { error: "O prompt é obrigatório." },
        { status: 400 }
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Erro retornado pelo N8N:", errorBody);
        throw new Error("O agente de IA não conseguiu processar a solicitação.");
    }

    // Agora podemos pegar o JSON diretamente, pois ele já vem no formato correto.
    const responseData = await response.json();

    // Repassamos a resposta diretamente para o frontend.
    return NextResponse.json(responseData);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro interno no servidor.";
    console.error(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}