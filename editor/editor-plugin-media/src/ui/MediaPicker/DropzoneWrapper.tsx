import React, { useCallback, useEffect } from 'react';

import { findOverflowScrollParent } from '@atlaskit/editor-common/Popup/utils';
import type { EditorAppearance } from '@atlaskit/editor-common/types/editor-appearance';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import type { MediaFeatureFlags } from '@atlaskit/media-common/types';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import { DropzoneLoader as Dropzone } from '@atlaskit/media-picker/dropzone';
import type {
	DropzoneConfig,
	UploadErrorEventPayload,
	UploadsStartEventPayload,
} from '@atlaskit/media-picker/types';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';
import {
	exposeMediaDropPosition,
	isMediaDropPositionEnabled,
} from '../../pm-plugins/media-drop-position-experiment';
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
		handleDragOver: states.mediaState?.handleDragOver,
		handleDrop: states.mediaState?.handleDrop,
		dropTargets: states.mediaState?.dropTargets,
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
	const { options, handleDrag, handleDragOver, handleDrop, dropTargets } =
		useSharedPluginStateWithSelector(api, ['media'], selector);
	const usePointerPosition = isMediaDropPositionEnabled();
	/** The mounted dropzone invokes this only for accepted external file drags and drops. */
	const enrolInMediaDropExperiment = useCallback(() => {
		exposeMediaDropPosition();
	}, []);
	const handleDragEnter = useCallback(() => {
		enrolInMediaDropExperiment();
		handleDrag?.('enter');
	}, [enrolInMediaDropExperiment, handleDrag]);
	const handleError = useCallback(
		(payload: UploadErrorEventPayload) => {
			dropTargets?.inserted(payload.fileId);
			pickerFacadeInstance.handleUploadError(payload);
		},
		[dropTargets, pickerFacadeInstance],
	);
	const handleUploadsStart = useCallback(
		({ files, traceContext }: UploadsStartEventPayload) => {
			if (traceContext) {
				dropTargets?.register(
					traceContext.traceId,
					files.map((file) => file.id),
				);
			}
		},
		[dropTargets],
	);
	const { customDropzoneContainer } = options || {};

	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const editorHtmlElement = editorDomElement as HTMLElement;
	const scrollParent = appearance === 'full-page' && findOverflowScrollParent(editorHtmlElement);
	const container = customDropzoneContainer || (scrollParent ? scrollParent : editorHtmlElement);
	/** Clears a stale hover indicator when the dropzone is removed or replaced mid-drag. */
	useEffect(() => {
		if (!usePointerPosition || !isActive) {
			return;
		}
		return () => handleDrag?.('leave');
	}, [container, handleDrag, isActive, usePointerPosition]);
	const dropzoneConfig: DropzoneConfig = {
		...config,
		container,
	};

	return isActive ? (
		<Dropzone
			mediaClientConfig={mediaClientConfig}
			config={dropzoneConfig}
			onDragOver={usePointerPosition ? handleDragOver : undefined}
			onDrop={enrolInMediaDropExperiment}
			onDropWithContext={usePointerPosition ? handleDrop : undefined}
			onUploadsStart={usePointerPosition ? handleUploadsStart : undefined}
			onError={usePointerPosition ? handleError : pickerFacadeInstance.handleUploadError}
			onPreviewUpdate={pickerFacadeInstance.handleUploadPreviewUpdate}
			onEnd={pickerFacadeInstance.handleReady}
			onDragEnter={handleDragEnter}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
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
}: Props): React.JSX.Element => (
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
