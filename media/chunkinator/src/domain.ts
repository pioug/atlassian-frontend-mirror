import { type Observable } from 'rxjs/Observable';

export interface SlicenatorOptions {
  size: number;
}

export interface Slicenator {
  (blob: Blob, options: SlicenatorOptions): Observable<SlicedBlob>;
}

export interface HashinatorOptions {
  concurrency: number;
  hasher: HashingFunction;
}

export interface SlicedBlob {
  partNumber: number;
  blob: Blob;
}

export interface HashedBlob extends SlicedBlob {
  hash: string;
}

export interface Hashinator {
  (
    blobs$: Observable<SlicedBlob>,
    options: HashinatorOptions,
  ): Observable<HashedBlob>;
}

export interface UploadinatorOptions {
  concurrency: number;
  uploader: UploadingFunction;
}

export interface UploadinatorProgress {
  chunk: HashedBlob;
}

export interface Uploadinator {
  (
    blobs$: Observable<HashedBlob>,
    options: UploadinatorOptions,
  ): Observable<HashedBlob>;
}

export interface ProcessinatorOptions {
  batchSize: number;
  processor?: ProcessingFunction;
}

export interface Processinator {
  (blobs$: Observable<HashedBlob>, options: ProcessinatorOptions): Observable<
    HashedBlob[]
  >;
}

// Public

export interface Chunk extends SlicedBlob {
  hash: string;
}

export interface Callbacks {
  onProgress?: (progress: number) => void;
}

export type HashingFunction = (blob: Blob) => Promise<string>;
export type UploadingFunction = (chunk: Chunk) => Promise<void>;
export type ProcessingFunction = (blobs: Chunk[]) => Promise<void>;

export interface Options {
  chunkSize: number;
  hashingConcurrency: number;
  hashingFunction: HashingFunction;
  uploadingConcurrency: number;
  uploadingFunction: UploadingFunction;
  processingBatchSize: number;
  processingFunction?: ProcessingFunction;
}

export type ChunkinatorFile = string | Blob;

export type ChunkinatorResponse = Observable<HashedBlob[]>;

export interface Chunkinator {
  (
    file: ChunkinatorFile,
    options: Options,
    callbacks: Callbacks,
  ): ChunkinatorResponse;
}
