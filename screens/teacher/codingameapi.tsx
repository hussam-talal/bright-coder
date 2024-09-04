import axios, { AxiosInstance } from 'axios';

class CodinGameApiService {
  private apiClient: AxiosInstance;
  private static BASE_URL = 'https://www.codingame.com/services/';
  private static CONTENT_TYPE = 'application/json;charset=UTF-8';

  constructor() {
    this.apiClient = axios.create({
      baseURL: CodinGameApiService.BASE_URL,
      headers: {
        'Content-Type': CodinGameApiService.CONTENT_TYPE,
      },
    });
  }

  public async getUserInfo(userId: string): Promise<any> {
    const endpoint = 'CodinGamer/findCodingamer';
    const requestBody = JSON.stringify([userId]);

    try {
      const response = await this.apiClient.post(endpoint, requestBody);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      throw error;
    }
  }
}

export default CodinGameApiService;
