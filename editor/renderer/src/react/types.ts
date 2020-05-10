import { PropsWithChildren } from 'react';

export interface NodeMeta {
  dataAttributes: {
    'data-renderer-start-pos': number;
  };
}

export type NodeProps<T = {}> = T & PropsWithChildren<NodeMeta>;
