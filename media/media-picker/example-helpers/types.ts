import { Preview } from '../src/types';

export type AuthEnvironment = 'asap' | 'client';

export interface PreviewData {
  preview?: Preview;
  readonly fileId: string;
}
