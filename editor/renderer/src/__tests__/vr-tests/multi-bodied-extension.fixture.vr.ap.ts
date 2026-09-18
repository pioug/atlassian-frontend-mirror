import type { ComponentType } from 'react';

import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { getXProductExtensionProvider } from '@atlaskit/editor-test-helpers/fakeXProductExtensions';

import {
	multiBodiedExtensionNodeAdf,
	multiBodiedExtensionExtNodeFullWidthAdf,
	multiBodiedExtensionExtNodeWideAdf,
} from '../__fixtures__/full-width-adf';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

// Create the extension provider synchronously to avoid timing issues
const extensionProvider = combineExtensionProviders([getXProductExtensionProvider()]);

const contextIdentifierProvider = storyContextIdentifierProviderFactory();
const providerFactory = ProviderFactory.create({
	contextIdentifierProvider,
	extensionProvider: Promise.resolve(extensionProvider),
});

export const MultiBodiedExtensionRenderer: ComponentType<any> = generateRendererComponent({
	document: multiBodiedExtensionNodeAdf,
	appearance: 'full-width',
	extensionHandlers: extensionHandlers,
	dataProviders: providerFactory,
});

export const MultiBodiedExtensionRendererFullPage: ComponentType<any> = generateRendererComponent({
	appearance: 'full-page',
	document: multiBodiedExtensionNodeAdf,
	extensionHandlers: extensionHandlers,
	dataProviders: providerFactory,
});

export const MultiBodiedExtensionRendererFullPageWideMode: ComponentType<any> =
	generateRendererComponent({
		appearance: 'full-page',
		document: multiBodiedExtensionExtNodeWideAdf,
		extensionHandlers: extensionHandlers,
		dataProviders: providerFactory,
	});

export const MultiBodiedExtensionRendererFullPageFullWidth: ComponentType<any> =
	generateRendererComponent({
		appearance: 'full-page',
		document: multiBodiedExtensionExtNodeFullWidthAdf,
		extensionHandlers: extensionHandlers,
		dataProviders: providerFactory,
	});
