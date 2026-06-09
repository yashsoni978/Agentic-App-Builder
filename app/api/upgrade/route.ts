import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await req.json();

  const user = await db.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  let credits = 10;

  if (plan === "starter") credits = 50;
  if (plan === "pro") credits = 999;

  await db.user.update({
    where: { id: user.id },
    data: {
      plan,
      credits,
    },
  });

  return Response.json({
    success: true,
  });
}