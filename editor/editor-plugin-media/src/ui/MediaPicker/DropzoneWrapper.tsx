import React from 'react';

import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { EditorAppearance, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { findOverflowScrollParent } from '@atlaskit/editor-common/ui';
import type { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';
import { type MediaClientConfig } from '@atlaskit/media-core';
import type { DropzoneConfig } from '@atlaskit/media-picker';
import { Dropzone } from '@atlaskit/media-picker';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';
import type PickerFacade from '../../pm-plugins/picker-facade';

import PickerFacadeProvider from './PickerFacadeProvider';

type Props = {
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	appearance: EditorAppearance;
	editorDomElement: Element;
	featureFlags?: MediaFeatureFlags;
	isActive: boolean;
};

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<MediaNextEditorPluginType>,
		'media'
	>,
) => {
	return {
		options: states.mediaState?.options,
		handleDrag: states.mediaState?.handleDrag,
	};
};

type DropzoneWrapperInternalProps = Props & {
	config: DropzoneConfig;
	mediaClientConfig: MediaClientConfig;
	pickerFacadeInstance: PickerFacade;
};

const DropzoneWrapperInternal = ({
	api,
	isActive,
	featureFlags,
	editorDomElement,
	appearance,
	mediaClientConfig,
	config,
	pickerFacadeInstance,
}: DropzoneWrapperInternalProps) => {
	const { options, handleDrag } = useSharedPluginStateWithSelector(api, ['media'], selector);
	const { customDropzoneContainer } = options || {};

	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const editorHtmlElement = editorDomElement as HTMLElement;
	const scrollParent = appearance === 'full-page' && findOverflowScrollParent(editorHtmlElement);
	const container = customDropzoneContainer || (scrollParent ? scrollParent : editorHtmlElement);
	const dropzoneConfig: DropzoneConfig = {
		...config,
		container,
	};

	return isActive ? (
		<Dropzone
			mediaClientConfig={mediaClientConfig}
			config={dropzoneConfig}
			onError={pickerFacadeInstance.handleUploadError}
			onPreviewUpdate={pickerFacadeInstance.handleUploadPreviewUpdate}
			onEnd={pickerFacadeInstance.handleReady}
			onDragEnter={() => handleDrag?.('enter')}
			onDragLeave={() => handleDrag?.('leave')}
			featureFlags={featureFlags}
		/>
	) : null;
};

export const DropzoneWrapper = ({
	api,
	isActive,
	featureFlags,
	editorDomElement,
	appearance,
}: Props) => (
	<PickerFacadeProvider api={api} analyticsName="dropzone">
		{({ mediaClientConfig, config, pickerFacadeInstance }) => (
			<DropzoneWrapperInternal
				api={api}
				isActive={isActive}
				featureFlags={featureFlags}
				editorDomElement={editorDomElement}
				appearance={appearance}
				mediaClientConfig={mediaClientConfig}
				config={config}
				pickerFacadeInstance={pickerFacadeInstance}
			/>
		)}
	</PickerFacadeProvider>
);
