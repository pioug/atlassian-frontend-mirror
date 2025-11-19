import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { getXProductExtensionProvider } from '@atlaskit/editor-test-helpers/fakeXProductExtensions';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

import {
	multiBodiedExtensionExtNodeAdf,
	multiBodiedExtensionExtNodeFullWidthAdf,
	multiBodiedExtensionExtNodeWideAdf,
} from '../__fixtures__/full-width-adf';
import { generateRendererComponent } from '../__helpers/rendererComponents';
import type { RendererAppearance } from '../../ui/Renderer/types';
import type { DocNode } from '@atlaskit/adf-schema';

export const getMultiBodiedExtensionExtRenderer = (options: {
	appearance: RendererAppearance;
	document: DocNode;
}) => {
	setBooleanFeatureFlagResolver(
		(flag) => flag === 'platform_editor_multi_body_extension_extensibility',
	);

	const contextIdentifierProvider = storyContextIdentifierProviderFactory();
	const providerFactory = ProviderFactory.create({
		contextIdentifierProvider,
		extensionProvider: Promise.resolve(combineExtensionProviders([getXProductExtensionProvider()])),
	});

	return generateRendererComponent({
		document: options.document,
		appearance: options.appearance,
		extensionHandlers: extensionHandlers,
		dataProviders: providerFactory,
	});
};

// This fixture was created as a workaround for the fact that there is no way to conditionally set flags in tests.
// This fixture can be removed when flag 'platform_editor_multi_body_extension_extensibility' is removed
// At which point, multiBodiedExtensionExtNodeAdf can be joined with multiBodiedExtensionNodeAdf in the original fixture file
export const MultiBodiedExtensionExtRenderer = getMultiBodiedExtensionExtRenderer({
	appearance: 'full-width',
	document: multiBodiedExtensionExtNodeAdf,
});

export const MultiBodiedExtensionExtRendererFullPage = getMultiBodiedExtensionExtRenderer({
	appearance: 'full-page',
	document: multiBodiedExtensionExtNodeAdf,
});

export const MultiBodiedExtensionExtRendererFullPageWideMode = getMultiBodiedExtensionExtRenderer({
	appearance: 'full-page',
	document: multiBodiedExtensionExtNodeWideAdf,
});

export const MultiBodiedExtensionExtRendererFullPageFullWidth = getMultiBodiedExtensionExtRenderer({
	appearance: 'full-page',
	document: multiBodiedExtensionExtNodeFullWidthAdf,
});
