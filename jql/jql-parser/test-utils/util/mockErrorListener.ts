import { mockSyntaxError } from './mockSyntaxError';

export const mockErrorListener: { syntaxError: jest.Mock } = { syntaxError: mockSyntaxError };
