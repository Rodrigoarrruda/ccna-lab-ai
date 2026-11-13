export class RequestBodyTooLargeError extends Error {
  constructor() {
    super('Request body exceeds the allowed size.');
    this.name = 'RequestBodyTooLargeError';
  }
}

export async function readRequestBody(
  request: Request,
  maxBytes: number,
): Promise<string> {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) {
    throw new RangeError('maxBytes must be a non-negative safe integer.');
  }

  const contentLength = request.headers.get('content-length');
  if (contentLength && /^\d+$/.test(contentLength) && Number(contentLength) > maxBytes) {
    throw new RequestBodyTooLargeError();
  }

  if (!request.body) return '';

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const {done, value} = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      void reader.cancel().catch((error: unknown) => {
        console.error('Failed to cancel oversized request body.', error);
      });
      throw new RequestBodyTooLargeError();
    }

    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(body);
}
