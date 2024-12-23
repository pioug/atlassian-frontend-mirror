import module from 'collapse-whitespace';

declare module 'collapse-whitespace';

export interface ICollapseWhitespace {
	(node: Node, blockTest?: (node: Node) => boolean, preTest?: (node: Node) => boolean): void;
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const collapseWhitespace: ICollapseWhitespace = module as any;
export default collapseWhitespace;
