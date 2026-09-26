import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, eventId } = body;

    // Validate
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Create registration entry
    const registration = {
      id: `reg-${Date.now()}`,
      name,
      email,
      phone,
      eventId: eventId || "general",
      registeredAt: new Date().toISOString(),
    };

    // Store in a local JSON file
    const dataDir = path.join(process.cwd(), "src", "data");
    const filePath = path.join(dataDir, "registrations.json");

    let registrations = [];
    try {
      const existing = await fs.readFile(filePath, "utf-8");
      registrations = JSON.parse(existing);
    } catch {
      // File doesn't exist yet, start with empty array
    }

    registrations.push(registration);
    await fs.writeFile(filePath, JSON.stringify(registrations, null, 2));

    return NextResponse.json(
      { message: "Registration successful", registration },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
