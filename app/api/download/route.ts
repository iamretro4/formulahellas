import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');
  const filename = searchParams.get('filename') || 'document.pdf';

  if (!url) {
    return NextResponse.json(
      { error: 'Missing URL parameter' },
      { status: 400 }
    );
  }

  try {
    // Validate that the URL is from Sanity CDN
    const sanityUrl = new URL(url);
    if (!sanityUrl.hostname.includes('sanity.io') && !sanityUrl.hostname.includes('cdn.sanity.io')) {
      return NextResponse.json(
        { error: 'Invalid URL source' },
        { status: 400 }
      );
    }

    // Fetch the file from Sanity
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch file' },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || 'application/pdf';
    const contentLength = response.headers.get('content-length');
    const fileSize = contentLength ? parseInt(contentLength, 10) : 0;

    // For large files (>10MB), stream directly from Sanity CDN to client
    // This prevents memory issues and improves performance
    const LARGE_FILE_THRESHOLD = 10 * 1024 * 1024; // 10MB

    if (fileSize > LARGE_FILE_THRESHOLD) {
      // Stream large files directly from Sanity CDN to client
      // This avoids loading the entire file into memory
      return new NextResponse(response.body, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': contentLength || '',
          'Cache-Control': 'public, max-age=3600, immutable',
          'Accept-Ranges': 'bytes',
        },
      });
    }

    // For smaller files, load into memory (faster for small files)
    const fileBuffer = await response.arrayBuffer();

    // Return the file with proper headers for download
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600, immutable',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}

