export interface CardPreview {
  dataURI: string;
  orientation?: number;
  source: 'local' | 'remote' | 'cache' | 'external';
}
