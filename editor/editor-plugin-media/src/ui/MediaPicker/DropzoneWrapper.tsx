import React from 'react';

import type { EditorAppearance } from '@atlaskit/editor-common/types';
import { findOverflowScrollParent } from '@atlaskit/editor-common/ui';
import type { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';
import type { DropzoneConfig } from '@atlaskit/media-picker';
import { Dropzone } from '@atlaskit/media-picker';

import type { MediaPluginState } from '../../pm-plugins/types';

import PickerFacadeProvider from './PickerFacadeProvider';

type Props = {
	mediaState: MediaPluginState;
	isActive: boolean;
	featureFlags?: MediaFeatureFlags;
	editorDomElement: Element;
	appearance: EditorAppearance;
};

export const DropzoneWrapper = ({
	mediaState,
	isActive,
	featureFlags,
	editorDomElement,
	appearance,
}: Props) => (
	<PickerFacadeProvider mediaState={mediaState} analyticsName="dropzone">
		{({ mediaClientConfig, config, pickerFacadeInstance }) => {
			const {
				options: { customDropzoneContainer },
				handleDrag,
			} = mediaState;
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const editorHtmlElement = editorDomElement as HTMLElement;
			const scrollParent =
				appearance === 'full-page' && findOverflowScrollParent(editorHtmlElement);
			const container =
				customDropzoneContainer || (scrollParent ? scrollParent : editorHtmlElement);
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
					onDragEnter={() => handleDrag('enter')}
					onDragLeave={() => handleDrag('leave')}
					featureFlags={featureFlags}
				/>
			) : null;
		}}
	</PickerFacadeProvider>
);
