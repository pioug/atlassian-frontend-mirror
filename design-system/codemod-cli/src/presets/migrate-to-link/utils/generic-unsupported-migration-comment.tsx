import { LINK_ENTRY_POINT } from './constants';

export const genericUnsupportedMigrationComment = (
	prefix: string = '',
) => `${prefix}- If this is a simple text-based link, replace with \`${LINK_ENTRY_POINT}\`.
${prefix}- If this is a button-like link style, replace with a link button from \`@atlaskit/button\`.
${prefix}- If this needs to retain custom styles, use the \`Anchor\` primitive from \`@atlaskit/primitives\`.`;
