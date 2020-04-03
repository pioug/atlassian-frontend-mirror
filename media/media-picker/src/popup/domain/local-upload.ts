export interface LocalUploadFileMetadata {
  readonly id: string;
  readonly mimeType: string;
  readonly name: string;
  readonly size: number;
  readonly occurrenceKey?: string;
}

export interface LocalUploadFile {
  readonly metadata: LocalUploadFileMetadata;
}

export interface LocalUpload {
  readonly file: LocalUploadFile;
  readonly index: number;
  readonly timeStarted: number;
}

export type LocalUploads = { [selectedItemId: string]: LocalUpload };
