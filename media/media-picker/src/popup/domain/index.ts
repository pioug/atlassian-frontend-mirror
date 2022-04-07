export type { AuthHeaders } from './auth';
export type {
  SourceFile,
  SourceFileOwner,
  ClientBasedSourceFileOwner,
  AsapBasedSourceFileOwner,
} from './source-file';

export type ServiceName =
  | 'recent_files'
  | 'google'
  | 'dropbox'
  | 'upload'
  | 'giphy'
  | string;

// TODO [MS-1255] this interface is almost identical to LocalUploadFileMetadata (and possibly to tens others)
export interface ServiceFile {
  readonly mimeType: string;
  readonly id: string;
  readonly name: string;
  readonly size: number;
  readonly date: number;
  readonly occurrenceKey?: string;
  readonly metadata?: any;
  readonly createdAt?: number;
}

export interface SelectedItem extends ServiceFile {
  readonly serviceName: ServiceName;
  readonly accountId?: string;
}
