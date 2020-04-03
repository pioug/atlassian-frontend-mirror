export interface MutatedFile extends File {
  lastModified: number;
  name: string;
  uniqueIdentifier: string;
}

export interface SliceyFile extends File {
  mozSlice(start?: number, end?: number, contentType?: string): Blob;
  webkitSlice(start?: number, end?: number, contentType?: string): Blob;
}
