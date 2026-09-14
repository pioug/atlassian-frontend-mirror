import type { ExtensionDefinition } from '@atlaskit/adf-schema/extension';

export const extension = (attrs: ExtensionDefinition['attrs']): ExtensionDefinition => ({
	type: 'extension',
	attrs,
});
