import { Observable } from 'rxjs/Observable';

export interface SlicenatorOptions {
  size: number;
}

export interface Slicenator {
  (blob: Blob, options: SlicenatorOptions): Observable<SlicedBlob>;
}

export interface HashinatorOptions {
  concurrency: number;
  hasher?: HashingFunction;
}

export interface SlicedBlob {
  partNumber: number;
  blob: Blob;
}

export interface HashedBlob extends SlicedBlob {
  hash: string;
}

export interface Hashinator {
  (blobs$: Observable<SlicedBlob>, options: HashinatorOptions): Observable<
    HashedBlob
  >;
}

export interface ProbedBlob extends HashedBlob {
  exists: boolean;
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
    probedBlobs$: Observable<ProbedBlob>,
    options: UploadinatorOptions,
  ): Observable<ProbedBlob>;
}

export interface ProcessinatorOptions {
  batchSize: number;
  processor?: ProcessingFunction;
}

export interface Processinator {
  (
    probedBlobs$: Observable<ProbedBlob>,
    options: ProcessinatorOptions,
  ): Observable<ProbedBlob[]>;
}

// Public

export interface Chunk extends SlicedBlob {
  hash: string;
}

export interface Callbacks {
  onProgress?: (progress: number) => void;
}

export type HashingFunction = (blob: Blob) => Promise<string>;
export type ProbingFunction = (chunks: Chunk[]) => Promise<boolean[]>;
export type UploadingFunction = (chunk: Chunk) => Promise<void>;
export type ProcessingFunction = (probedBlobs: Chunk[]) => Promise<void>;

export interface Options {
  chunkSize: number;
  hashingConcurrency: number;
  hashingFunction?: HashingFunction;
  probingBatchSize: number;
  probingFunction: ProbingFunction;
  uploadingConcurrency: number;
  uploadingFunction: UploadingFunction;
  processingBatchSize: number;
  processingFunction?: ProcessingFunction;
}

export type ChunkinatorFile = string | Blob;

export type ChunkinatorResponse = Observable<ProbedBlob[]>;

export interface Chunkinator {
  (
    file: ChunkinatorFile,
    options: Options,
    callbacks: Callbacks,
  ): ChunkinatorResponse;
}
