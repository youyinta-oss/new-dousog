import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const where: any = {};

    if (userId) {
      where.members = {
        some: {
          userId: userId,
        },
      };
    }

    const spaces = await prisma.space.findMany({
      where,
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            documents: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(spaces);
  } catch (error) {
    console.error("Error fetching spaces:", error);
    return NextResponse.json(
      { error: "获取空间列表失败" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, icon, color, ownerId } = body;

    if (!name || !ownerId) {
      return NextResponse.json(
        { error: "缺少必填字段" },
        { status: 400 }
      );
    }

    const space = await prisma.space.create({
      data: {
        name,
        description,
        icon,
        color,
        members: {
          create: {
            userId: ownerId,
            role: "OWNER",
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(space);
  } catch (error) {
    console.error("Error creating space:", error);
    return NextResponse.json(
      { error: "创建空间失败" },
      { status: 500 }
    );
  }
}
