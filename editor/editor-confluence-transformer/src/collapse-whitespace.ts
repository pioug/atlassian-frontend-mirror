import module from 'collapse-whitespace';

declare module 'collapse-whitespace';

export interface ICollapseWhitespace {
  (
    node: Node,
    blockTest?: (node: Node) => boolean,
    preTest?: (node: Node) => boolean,
  ): void;
}

const collapseWhitespace: ICollapseWhitespace = module as any;
export default collapseWhitespace;
