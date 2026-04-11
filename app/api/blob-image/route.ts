import { NextResponse } from "next/server";

// Proxy for private Vercel Blob images.
// The browser cannot load private blob URLs directly (they require a token).
// This route fetches the blob server-side with BLOB_READ_WRITE_TOKEN and
// returns the raw image data so <img> tags can display it.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const blobUrl = searchParams.get("url");

  if (!blobUrl) {
    return new NextResponse("Missing url param", { status: 400 });
  }

  // Only allow Vercel Blob URLs to prevent open-redirect abuse
  if (!blobUrl.includes(".blob.vercel-storage.com")) {
    return new NextResponse("Not a valid blob URL", { status: 403 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return new NextResponse("Blob token not configured", { status: 500 });
  }

  const res = await fetch(blobUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return new NextResponse("Blob not found", { status: 404 });
  }

  const contentType = res.headers.get("Content-Type") ?? "image/jpeg";

  return new NextResponse(res.body, {
    headers: {
      "Content-Type": contentType,
      // Images are immutable once uploaded — cache aggressively
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
