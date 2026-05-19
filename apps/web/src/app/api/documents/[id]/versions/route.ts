import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const versions = await prisma.documentVersion.findMany({
      where: { documentId: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json(versions);
  } catch (error) {
    console.error("Error fetching document versions:", error);
    return NextResponse.json(
      { error: "获取文档历史失败" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { authorId } = body;

    const document = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!document) {
      return NextResponse.json(
        { error: "文档不存在" },
        { status: 404 }
      );
    }

    const version = await prisma.documentVersion.create({
      data: {
        title: document.title,
        content: document.content,
        documentId: params.id,
        authorId: authorId || document.authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(version);
  } catch (error) {
    console.error("Error creating document version:", error);
    return NextResponse.json(
      { error: "创建文档版本失败" },
      { status: 500 }
    );
  }
}
