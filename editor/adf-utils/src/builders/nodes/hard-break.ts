import type { HardBreakDefinition } from '@atlaskit/adf-schema/hard-break';

export const hardBreak = (attrs?: HardBreakDefinition['attrs']): HardBreakDefinition => ({
	type: 'hardBreak',
	attrs,
});
