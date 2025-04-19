import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { getXProductExtensionProvider } from '@atlaskit/editor-test-helpers/fakeXProductExtensions';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

import { multiBodiedExtensionExtNodeAdf } from '../__fixtures__/full-width-adf';
import { generateRendererComponent } from '../__helpers/rendererComponents';

export const getMultiBodiedExtensionExtRenderer = () => {
	setBooleanFeatureFlagResolver(
		(flag) => flag === 'platform_editor_multi_body_extension_extensibility',
	);

	const contextIdentifierProvider = storyContextIdentifierProviderFactory();
	const providerFactory = ProviderFactory.create({
		contextIdentifierProvider,
		extensionProvider: Promise.resolve(combineExtensionProviders([getXProductExtensionProvider()])),
	});

	return generateRendererComponent({
		document: multiBodiedExtensionExtNodeAdf,
		appearance: 'full-width',
		extensionHandlers: extensionHandlers,
		dataProviders: providerFactory,
	});
};

// This fixture was created as a workaround for the fact that there is no way to conditionally set flags in tests.
// This fixture can be removed when flag 'platform_editor_multi_body_extension_extensibility' is removed
// At which point, multiBodiedExtensionExtNodeAdf can be joined with multiBodiedExtensionNodeAdf in the original fixture file
export const MultiBodiedExtensionExtRenderer = getMultiBodiedExtensionExtRenderer();
