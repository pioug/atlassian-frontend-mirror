import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { editorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import { alignmentPlugin } from '@atlaskit/editor-plugins/alignment';
import { cardPlugin } from '@atlaskit/editor-plugins/card';
import { extensionPlugin } from '@atlaskit/editor-plugins/extension';
import { gridPlugin } from '@atlaskit/editor-plugins/grid';
import { layoutPlugin } from '@atlaskit/editor-plugins/layout';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { MockedSmartCardClientNoDelay } from '@atlaskit/media-integration-test-helpers/no-delay-card-client';

import {
	blockExtensionWithSmartLinkAdf,
	blockExtensionWithParagraphAboveNodeAdf,
	bodiedExtensionWithLayoutElementAdf,
	bodiedExtensionWithParagraphAboveNodeAdf,
	bodiedExtensionWithSmartLinkAdf,
	emptyBodiedExtensionWithParagraphAboveNodeAdf,
	inlineExtensionWithSmartlinkAdf,
} from './extension-with-updated-button-UI.adf';

const cardClient = new MockedSmartCardClientNoDelay('staging');

const createPreset = () =>
	createDefaultPreset({
		featureFlags: { macroInteractionUpdates: true },
		paste: {},
		appearance: 'full-page',
	})
		.add(gridPlugin)
		.add(cardPlugin)
		.add([
			extensionPlugin,
			{
				extensionHandlers,
				__rendererExtensionOptions: {
					isAllowedToUseRendererView: () => true, // When this is true, will be a 2P macro
					showUpdated1PBodiedExtensionUI: () => false, // This is only true for 1P macros
				},
			},
		])
		.add([
			editorViewModePlugin,
			{
				mode: 'view',
			},
		])
		.add(alignmentPlugin)
		.add(layoutPlugin);

export function BlockExtensionWithSmartLink(): React.JSX.Element {
	const { preset } = usePreset(createPreset);
	return (
		<SmartCardProvider client={cardClient}>
			<ComposableEditor
				defaultValue={blockExtensionWithSmartLinkAdf}
				preset={preset}
				appearance="full-page"
			/>
		</SmartCardProvider>
	);
}

export function BlockExtension(): React.JSX.Element {
	const { preset } = usePreset(createPreset);
	return (
		<SmartCardProvider client={cardClient}>
			<ComposableEditor
				defaultValue={blockExtensionWithParagraphAboveNodeAdf}
				preset={preset}
				appearance="full-page"
			/>
		</SmartCardProvider>
	);
}

export function BodiedExtension(): React.JSX.Element {
	const { preset } = usePreset(createPreset);
	return (
		<ComposableEditor
			defaultValue={bodiedExtensionWithParagraphAboveNodeAdf}
			preset={preset}
			appearance="full-page"
		/>
	);
}

export function EmptyBodiedExtension(): React.JSX.Element {
	const { preset } = usePreset(createPreset);
	return (
		<ComposableEditor
			defaultValue={emptyBodiedExtensionWithParagraphAboveNodeAdf}
			preset={preset}
			appearance="full-page"
		/>
	);
}

export function BodiedExtensionWithSmartLink(): React.JSX.Element {
	const { preset } = usePreset(createPreset);
	return (
		<SmartCardProvider client={cardClient}>
			<ComposableEditor
				defaultValue={bodiedExtensionWithSmartLinkAdf}
				preset={preset}
				appearance="full-page"
			/>
		</SmartCardProvider>
	);
}

export function InlineExtensionWithSmartLink(): React.JSX.Element {
	const { preset } = usePreset(createPreset);
	return (
		<SmartCardProvider client={cardClient}>
			<ComposableEditor
				defaultValue={inlineExtensionWithSmartlinkAdf}
				preset={preset}
				appearance="full-page"
			/>
		</SmartCardProvider>
	);
}

export function BodiedExtensionWithLayout(): React.JSX.Element {
	const { preset } = usePreset(createPreset);
	return (
		<ComposableEditor
			defaultValue={bodiedExtensionWithLayoutElementAdf}
			preset={preset}
			appearance="full-page"
		/>
	);
}
