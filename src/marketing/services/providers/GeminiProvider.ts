
import { IARequest, IAResponse } from '../types/IAContracts';

// Define a simple interface for our provider, as we don't have a shared one.
interface IAIProvider {
  generate(request: IARequest): Promise<IAResponse>;
}

export class GeminiProvider implements IAIProvider {
  async generate(request: IARequest): Promise<IAResponse> {
    // This is a STUB provider. It returns a fixed response without any external calls.
    const response: IAResponse = {
      success: true,
      providerUsed: 'gemini',
      output: '[Gemini STUB] resposta simulada',
      fallbackLevel: 1,
      rawResponse: { stub: true },
      error: null,
    };
    return Promise.resolve(response);
  }
}
