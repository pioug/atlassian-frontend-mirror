import type { LayoutColumnDefinition } from '@atlaskit/adf-schema/nodes/layout-column';
import type { LayoutSectionDefinition } from '@atlaskit/adf-schema/layout-section';

export const layoutSection =
	() =>
	(content: Array<LayoutColumnDefinition>): LayoutSectionDefinition => ({
		type: 'layoutSection',
		content,
	});
