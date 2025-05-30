/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import BlockCard from '../../react/nodes/blockCard';
import EmbedCard from '../../react/nodes/embedCard';
import InlineCard from '../../react/nodes/inlineCard';

/**
 * Synchronous renderer node mapping for card nodes
 *
 * WARNING: This is an EXPERIMENTAL entry point and may change without notice in the future. Use it only at your own risk!
 *
 * Context: https://hello.atlassian.net/wiki/spaces/JIE/pages/5342146338 (Atlassian-internal)
 */
const nodeToReact: typeof import('../../react/nodes').nodeToReact = {
	blockCard: BlockCard,
	embedCard: EmbedCard,
	inlineCard: InlineCard,
};

export default nodeToReact;
