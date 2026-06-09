import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await req.json();

  let credits = 10;

  if (plan === "starter") credits = 100;
  if (plan === "pro") credits = 999;

  await db.user.update({
    where: {
      clerkId: userId,
    },
    data: {
      plan,
      credits,
    },
  });

  return Response.json({
    success: true,
  });
}