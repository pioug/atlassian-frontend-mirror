export interface EdgeData {
  data: {
    clientId: string;
    token: string;
    baseUrl: string;
    expiresIn: number;
    iat: number;
  };
}

export class StargateClient {
  private baseUrl: string;

  constructor(baseUrl: string | undefined) {
    this.baseUrl = baseUrl || '/gateway/api';
  }

  async fetchToken(clientId: string): Promise<EdgeData> {
    return (
      await fetch(`${this.baseUrl}/media/auth/smartedge`, {
        credentials: 'include',
        headers: {
          'x-client-id': clientId,
        },
      })
    ).json();
  }

  isTokenExpired(token: EdgeData): boolean {
    const currentTimeInSeconds = new Date().getTime() / 1000;
    return token.data.iat + token.data.expiresIn - currentTimeInSeconds < 0;
  }
}
