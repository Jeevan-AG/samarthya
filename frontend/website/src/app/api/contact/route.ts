import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const contact = {
      id: `msg-${Date.now()}`,
      name,
      email,
      message,
      sentAt: new Date().toISOString(),
    };

    const dataDir = path.join(process.cwd(), "src", "data");
    const filePath = path.join(dataDir, "contacts.json");

    let contacts = [];
    try {
      const existing = await fs.readFile(filePath, "utf-8");
      contacts = JSON.parse(existing);
    } catch {
      // File doesn't exist yet
    }

    contacts.push(contact);
    await fs.writeFile(filePath, JSON.stringify(contacts, null, 2));

    return NextResponse.json(
      { message: "Message sent successfully", contact },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
