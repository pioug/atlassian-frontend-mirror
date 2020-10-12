export interface ShortenRequest {
  cloudId?: string;
  product: string;
  type: string;
  params: Record<string, string>;
  query?: string;
}

export interface ShortenResponse {
  shortUrl: string;
}

export interface UrlShortenerClient {
  shorten(data: ShortenRequest): Promise<ShortenResponse>;
}

export class AtlassianUrlShortenerClient implements UrlShortenerClient {
  public async shorten(data: ShortenRequest): Promise<ShortenResponse> {
    try {
      const response = await fetch('/gateway/api/atl-link/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`status="${response.status}"`);
      }

      const result: ShortenResponse = await response.json();

      if (!result.shortUrl) {
        throw new Error('Breach of contract!');
      }

      return result;
    } catch (err) {
      err.message = `While shortening URL: ${err.message}!`;
      throw err;
    }
  }
}
