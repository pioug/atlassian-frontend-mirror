import React from 'react';

import { useIntl } from 'react-intl-next';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { mediaInsertMessages } from '@atlaskit/editor-common/messages';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import EditorFilePreviewIcon from '@atlaskit/icon/glyph/editor/file-preview';
import { getMediaClient } from '@atlaskit/media-client-react';
import { Box, Flex, Inline, Stack, xcss } from '@atlaskit/primitives';
import SectionMessage from '@atlaskit/section-message';
import TextField from '@atlaskit/textfield';

import { MediaCard } from './MediaCard';
import { type OnInsertAttrs } from './types';
import { useAnalyticsEvents } from './useAnalyticsEvents';

const PreviewBoxStyles = xcss({
	borderWidth: 'border.width',
	borderStyle: 'dashed',
	borderColor: 'color.border',
	borderRadius: 'border.radius',
	height: '200px',
});

const PreviewImageStyles = xcss({
	height: '200px',
});

const ButtonGroupStyles = xcss({
	alignSelf: 'end',
});

type PreviewState = {
	isLoading: boolean;
	error: string | null;
	warning: string | null;
	previewInfo: OnInsertAttrs | null;
};

type PreviewStateAction =
	| { type: 'loading' }
	| { type: 'error'; error: string }
	| { type: 'warning'; warning: string; url: string }
	| { type: 'success'; payload: OnInsertAttrs }
	| { type: 'reset' };

const INITIAL_PREVIEW_STATE: Readonly<PreviewState> = Object.freeze({
	isLoading: false,
	error: null,
	warning: null,
	previewInfo: null,
});

const previewStateReducer = (state: PreviewState, action: PreviewStateAction) => {
	switch (action.type) {
		case 'loading':
			return { ...INITIAL_PREVIEW_STATE, isLoading: true };
		case 'error':
			return { ...INITIAL_PREVIEW_STATE, error: action.error };
		case 'warning':
			return { ...INITIAL_PREVIEW_STATE, warning: action.warning };
		case 'success':
			return { ...INITIAL_PREVIEW_STATE, previewInfo: action.payload };
		case 'reset':
			return INITIAL_PREVIEW_STATE;
		default:
			return state;
	}
};

type Props = {
	mediaProvider: Promise<MediaProvider>;
	onInsert: (attrs: OnInsertAttrs) => void;
	onExternalInsert: (url: string) => void;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
};

// TODO: Delete these before rollout
const placeholders = [
	'https://picsum.photos/200/300', // has cors
	'https://placedog.net/500/280', // has cors
	'https://preview.redd.it/gabriel-medina-at-the-olympics-after-riding-a-nearly-v0-dbyczz2fkifd1.jpeg?auto=webp&s=045550d672718427b67fb929bc6efc57116a7596', // no cors
];

export function MediaFromURL({
	mediaProvider,
	onInsert,
	onExternalInsert,
	dispatchAnalyticsEvent,
}: Props) {
	const intl = useIntl();
	const strings = {
		loadPreview: intl.formatMessage(mediaInsertMessages.loadPreview),
		insert: intl.formatMessage(mediaInsertMessages.insert),
		pasteLinkToUpload: intl.formatMessage(mediaInsertMessages.pasteLinkToUpload),
		cancel: intl.formatMessage(mediaInsertMessages.cancel),
		errorMessage: intl.formatMessage(mediaInsertMessages.errorMessage),
		warning: intl.formatMessage(mediaInsertMessages.warning),
	};

	const [url, setUrl] = React.useState(placeholders[1]);
	const [previewState, dispatch] = React.useReducer(previewStateReducer, INITIAL_PREVIEW_STATE);

	const { onUploadAnalytics, onUploadSuccessAnalytics, onUploadFailureAnalytics } =
		useAnalyticsEvents(dispatchAnalyticsEvent);

	const onURLChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setUrl(e.target.value);
		dispatch({ type: 'reset' });
	}, []);

	const uploadExternalMedia = React.useCallback(async () => {
		dispatch({ type: 'loading' });
		const { uploadMediaClientConfig, uploadParams } = await mediaProvider;
		if (!uploadMediaClientConfig) {
			return;
		}

		const mediaClient = getMediaClient(uploadMediaClientConfig);
		const collection = uploadParams?.collection;

		onUploadAnalytics();
		try {
			const { uploadableFileUpfrontIds, dimensions } = await mediaClient.file.uploadExternal(
				url,
				collection,
			);
			onUploadSuccessAnalytics();
			dispatch({
				type: 'success',
				payload: {
					id: uploadableFileUpfrontIds.id,
					collection,
					height: dimensions.height,
					width: dimensions.width,
					occurrenceKey: uploadableFileUpfrontIds.occurrenceKey,
				},
			});
		} catch (e) {
			if (typeof e === 'string' && e === 'Could not download remote file') {
				// TODO: Make sure this gets good unit test coverage with the actual
				// media plugin. This hard coded error message could be changed at any
				// point and we need a unit test to break to stop people changing it.
				onUploadFailureAnalytics(e);
				dispatch({ type: 'warning', warning: e, url });
			} else if (e instanceof Error) {
				const message = 'Image preview fetch failed';
				onUploadFailureAnalytics(message);
				dispatch({ type: 'error', error: message });
			} else {
				onUploadFailureAnalytics('Unknown error');
				dispatch({ type: 'error', error: 'Unknown error' });
			}
		}
	}, [mediaProvider, onUploadAnalytics, onUploadFailureAnalytics, onUploadSuccessAnalytics, url]);

	const onInsertClick = React.useCallback(() => {
		if (previewState.previewInfo) {
			return onInsert(previewState.previewInfo);
		}

		if (previewState.warning) {
			return onExternalInsert(url);
		}
	}, [onExternalInsert, onInsert, previewState.previewInfo, previewState.warning, url]);

	return (
		<form
			onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault();
				uploadExternalMedia();
			}}
		>
			<Stack space="space.150">
				<TextField
					autoFocus
					value={url}
					placeholder={strings.pasteLinkToUpload}
					onChange={onURLChange}
				/>
				{previewState.previewInfo && (
					<Inline
						alignInline="center"
						alignBlock="center"
						xcss={PreviewImageStyles}
						space="space.200"
					>
						<MediaCard attrs={previewState.previewInfo} mediaProvider={mediaProvider} />
					</Inline>
				)}
				{previewState.error && (
					<SectionMessage appearance="error">{strings.errorMessage}</SectionMessage>
				)}
				{previewState.warning && (
					<SectionMessage appearance="warning">{strings.warning}</SectionMessage>
				)}
				{!previewState.previewInfo && !previewState.error && !previewState.warning && (
					<Flex xcss={PreviewBoxStyles} alignItems="center" justifyContent="center">
						<Button
							type="submit"
							isLoading={previewState.isLoading}
							isDisabled={!url}
							iconBefore={EditorFilePreviewIcon}
						>
							{strings.loadPreview}
						</Button>
					</Flex>
				)}
				<Box xcss={ButtonGroupStyles}>
					<ButtonGroup>
						<Button appearance="subtle">{strings.cancel}</Button>
						<Button
							appearance="primary"
							isDisabled={!previewState.previewInfo && !previewState.warning}
							onClick={onInsertClick}
						>
							{strings.insert}
						</Button>
					</ButtonGroup>
				</Box>
			</Stack>
		</form>
	);
}
