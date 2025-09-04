import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { UsersTable } from "@/db/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 },
      );
    }

    const users = await db
      .select({ accessLevel: UsersTable.accessLevel })
      .from(UsersTable)
      .where(eq(UsersTable.id, userId))
      .limit(1);

    const accessLevel = users[0]?.accessLevel ?? null;
    return NextResponse.json({ accessLevel });
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao obter access level" },
      { status: 500 },
    );
  }
}
