import type { InlineExtensionDefinition } from '@atlaskit/adf-schema/inline-extension';

export const inlineExtension =
	(attrs: InlineExtensionDefinition['attrs']) => (): InlineExtensionDefinition => ({
		type: 'inlineExtension',
		attrs,
	});
