import { Identifier } from '@atlaskit/media-client';

export { Outcome } from './outcome';

export type ItemSource =
  | { kind: 'COLLECTION'; collectionName: string; pageSize: number }
  | { kind: 'ARRAY'; items: Identifier[] };
