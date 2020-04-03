export interface Hasher {
  hash(blob: Blob): Promise<string>;
}
