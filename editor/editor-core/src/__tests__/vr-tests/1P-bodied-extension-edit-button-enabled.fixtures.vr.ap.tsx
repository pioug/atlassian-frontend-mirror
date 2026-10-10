import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { alignmentPlugin } from '@atlaskit/editor-plugin-alignment/alignmentPlugin';
import { cardPlugin } from '@atlaskit/editor-plugin-card/cardPlugin';
import { extensionPlugin } from '@atlaskit/editor-plugin-extension/extensionPlugin';
import { gridPlugin } from '@atlaskit/editor-plugin-grid/gridPlugin';
import { layoutPlugin } from '@atlaskit/editor-plugin-layout/layout-plugin';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { MockedSmartCardClientNoDelay } from '@atlaskit/media-integration-test-helpers/no-delay-card-client';

import {
	blockExtensionWithSmartLinkAdf,
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
					isAllowedToUseRendererView: () => false, // This is only true if is a 2P macro
					showUpdated1PBodiedExtensionUI: () => true, // This is only true for 1P macros
				},
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

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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
