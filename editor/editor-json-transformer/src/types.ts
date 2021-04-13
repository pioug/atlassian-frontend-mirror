export type JSONNode = {
  type: string;
  attrs?: object;
  content?: Array<JSONNode | undefined>;
  marks?: any[];
  text?: string;
};
export type JSONDocNode = {
  version: number;
  type: 'doc';
  content: JSONNode[];
};
