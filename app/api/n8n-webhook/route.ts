import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: "N8N_WEBHOOK_URL não está definida." },
        { status: 500 }
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("Falha ao enviar dados para o webhook do N8N.");
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Ocorreu um erro interno." },
      { status: 500 }
    );
  }
}