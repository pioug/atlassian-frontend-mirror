import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { alignmentPlugin } from '@atlaskit/editor-plugins/alignment';
import { cardPlugin } from '@atlaskit/editor-plugins/card';
import { extensionPlugin } from '@atlaskit/editor-plugins/extension';
import { gridPlugin } from '@atlaskit/editor-plugins/grid';
import { layoutPlugin } from '@atlaskit/editor-plugins/layout';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { MockedSmartCardClientNoDelay } from '@atlaskit/media-integration-test-helpers/no-delay-card-client';

import {
	blockExtensionWithLayoutElement,
	blockExtensionWithParagraphAboveNodeAdf,
	blockExtensionWithSmartLinkAdf,
	bodiedExtensionWithLayoutElement,
	bodiedExtensionWithParagraphAboveNodeAdf,
	bodiedExtensionWithSmartLinkAdf,
	inlineExtensionCenterAlignedAdf,
	inlineExtensionRightAlignedAdf,
	inlineExtensionWithParagraphAboveAdf,
	inlineExtensionWithSmartlinkAdf,
} from './extension-with-updated-UI.adf';

const cardClient = new MockedSmartCardClientNoDelay('staging');

const createPreset = () =>
	createDefaultPreset({
		featureFlags: { macroInteractionUpdates: true, macroInteractionButtonUpdates: true },
		paste: {},
		appearance: 'full-page',
	})
		.add(gridPlugin)
		.add([cardPlugin, { platform: 'web' }])
		.add([extensionPlugin, { extensionHandlers }])
		.add(alignmentPlugin)
		.add(layoutPlugin);

export function BlockExtension() {
	const { preset } = usePreset(createPreset);
	return (
		<ComposableEditor
			defaultValue={blockExtensionWithParagraphAboveNodeAdf}
			preset={preset}
			appearance="full-page"
		/>
	);
}

export function BlockExtensionWithSmartLink() {
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

export function BodiedExtension() {
	const { preset } = usePreset(createPreset);
	return (
		<ComposableEditor
			defaultValue={bodiedExtensionWithParagraphAboveNodeAdf}
			preset={preset}
			appearance="full-page"
		/>
	);
}

export function BodiedExtensionWithSmartLink() {
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

export function InlineExtension() {
	const { preset } = usePreset(createPreset);
	return (
		<ComposableEditor
			defaultValue={inlineExtensionWithParagraphAboveAdf}
			preset={preset}
			appearance="full-page"
		/>
	);
}

export function InlineExtensionCenterAligned() {
	const { preset } = usePreset(createPreset);
	return (
		<SmartCardProvider client={cardClient}>
			<ComposableEditor
				defaultValue={inlineExtensionCenterAlignedAdf}
				preset={preset}
				appearance="full-page"
			/>
		</SmartCardProvider>
	);
}

export function InlineExtensionRightAligned() {
	const { preset } = usePreset(createPreset);
	return (
		<SmartCardProvider client={cardClient}>
			<ComposableEditor
				defaultValue={inlineExtensionRightAlignedAdf}
				preset={preset}
				appearance="full-page"
			/>
		</SmartCardProvider>
	);
}

export function InlineExtensionWithSmartLink() {
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

export function BodiedExtensionWithLayout() {
	const { preset } = usePreset(createPreset);
	return (
		<ComposableEditor
			defaultValue={bodiedExtensionWithLayoutElement}
			preset={preset}
			appearance="full-page"
		/>
	);
}

export function BlockExtensionWithLayout() {
	const { preset } = usePreset(createPreset);
	return (
		<ComposableEditor
			defaultValue={blockExtensionWithLayoutElement}
			preset={preset}
			appearance="full-page"
		/>
	);
}
