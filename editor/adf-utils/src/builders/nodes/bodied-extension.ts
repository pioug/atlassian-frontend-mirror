import type { BodiedExtensionDefinition } from '@atlaskit/adf-schema/bodied-extension';
import type { NonNestableBlockContent } from '@atlaskit/adf-schema/non-nestable-block-content';

export const bodiedExtension =
	(attrs: BodiedExtensionDefinition['attrs']) =>
	(...content: Array<NonNestableBlockContent>): BodiedExtensionDefinition => ({
		type: 'bodiedExtension',
		attrs,
		content,
	});
