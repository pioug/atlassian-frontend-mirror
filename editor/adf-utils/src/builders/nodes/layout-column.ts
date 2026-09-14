import type { BlockContent } from '@atlaskit/adf-schema/block-content';
import type { LayoutColumnDefinition } from '@atlaskit/adf-schema/nodes/layout-column';

export const layoutColumn =
	(attrs: { width: number }) =>
	(content: BlockContent[]): LayoutColumnDefinition => ({
		type: 'layoutColumn',
		attrs,
		content,
	});
