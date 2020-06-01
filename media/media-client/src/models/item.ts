import { MediaType } from './media';
export type MediaItemType = 'file' | 'external-image';

export interface FileItem {
  type: 'file';
  details: FileDetails;
}

export type FileProcessingStatus =
  | 'pending'
  | 'running'
  | 'succeeded'
  | 'failed';

export interface MediaArtifact {
  processingStatus?: FileProcessingStatus;
  url?: string;
}

export type Artifacts = { [name: string]: MediaArtifact };

export interface FileDetails {
  id: string;
  name?: string;
  size?: number;
  mimeType?: string;
  mediaType?: MediaType;
  creationDate?: number; // timestamp in milliseconds from EPOCH
  processingStatus?: FileProcessingStatus;
  artifacts?: Artifacts;
  createdAt?: number;
}
