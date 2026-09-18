import type { LayoutSectionDefinition } from '@atlaskit/adf-schema/layout-section';
import type { LayoutColumnDefinition } from '@atlaskit/adf-schema/nodes/layout-column';

export const layoutSection =
	() =>
	(content: Array<LayoutColumnDefinition>): LayoutSectionDefinition => ({
		type: 'layoutSection',
		content,
	});
