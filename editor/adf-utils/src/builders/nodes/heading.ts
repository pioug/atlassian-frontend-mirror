import type { HeadingDefinition } from '@atlaskit/adf-schema/heading';
import type { Inline } from '@atlaskit/adf-schema/inline-content';

export const heading =
	(attrs: HeadingDefinition['attrs']) =>
	(...content: Array<Inline>): HeadingDefinition => ({
		type: 'heading',
		attrs,
		content,
	});
