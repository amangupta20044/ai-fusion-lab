import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { model, msg, parentModel } = await req.json();

    const response = await axios.post(
      "https://kravixstudio.com/api/v1/chat",
      {
        message: msg, // Send the entire 'msg' array as the message
        aiModel: model,
        outputType: "text",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_KRAVIXSTUDIO_API_KEY}`,
        },
      }
    );

    console.log(response.data);

    return NextResponse.json({
      ...response.data,
      model: parentModel,
    });
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: "Something went wrong", details: err.message },
      { status: 500 }
    );
  }
}