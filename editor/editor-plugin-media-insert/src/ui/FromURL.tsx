import React from 'react';

import { useIntl } from 'react-intl-next';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	type AnalyticsEventPayload,
	type DispatchAnalyticsEvent,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
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

const FormStyles = xcss({
	flexGrow: 1,
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
	mediaProvider: MediaProvider;
	onInsert: (attrs: OnInsertAttrs) => void;
	onExternalInsert: (url: string) => void;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	closeMediaInsertPicker: () => void;
};

export function MediaFromURL({
	mediaProvider,
	onInsert,
	onExternalInsert,
	dispatchAnalyticsEvent,
	closeMediaInsertPicker,
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

	const [inputUrl, setUrl] = React.useState<string>('');
	const [previewState, dispatch] = React.useReducer(previewStateReducer, INITIAL_PREVIEW_STATE);
	const pasteFlag = React.useRef(false);

	const { onUploadAnalytics, onUploadSuccessAnalytics, onUploadFailureAnalytics } =
		useAnalyticsEvents(dispatchAnalyticsEvent);

	const uploadExternalMedia = React.useCallback(
		async (url: string) => {
			dispatch({ type: 'loading' });
			const { uploadMediaClientConfig, uploadParams } = mediaProvider;
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
					dispatch({ type: 'warning', warning: e, url: inputUrl });
				} else if (e instanceof Error) {
					const message = 'Image preview fetch failed';
					onUploadFailureAnalytics(message);
					dispatch({ type: 'error', error: message });
				} else {
					onUploadFailureAnalytics('Unknown error');
					dispatch({ type: 'error', error: 'Unknown error' });
				}
			}
		},
		[
			mediaProvider,
			onUploadAnalytics,
			onUploadFailureAnalytics,
			onUploadSuccessAnalytics,
			inputUrl,
		],
	);

	const onURLChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const url = e.target.value;
			setUrl(url);
			dispatch({ type: 'reset' });

			if (pasteFlag.current === true) {
				pasteFlag.current = false;
				uploadExternalMedia(url);
			}
		},
		[uploadExternalMedia],
	);

	const onPaste = React.useCallback(
		(e: React.ClipboardEvent<HTMLInputElement>) => {
			// Note: this is a little weird, but the paste event will always be
			// fired before the change event when pasting. We don't really want to
			// duplicate logic by handling pastes separately to changes, so we're
			// just noting paste occured to then be handled in the onURLChange fn
			// above. The one exception to this is where paste inputs exactly what was
			// already in the input, in which case we want to ignore it.
			if (e.clipboardData.getData('text') !== inputUrl) {
				pasteFlag.current = true;
			}
		},
		[inputUrl],
	);

	const onInsertClick = React.useCallback(() => {
		if (previewState.previewInfo) {
			return onInsert(previewState.previewInfo);
		}

		if (previewState.warning) {
			return onExternalInsert(inputUrl);
		}
	}, [onExternalInsert, onInsert, previewState.previewInfo, previewState.warning, inputUrl]);

	const onInputKeyPress = React.useCallback(
		(event: React.KeyboardEvent<HTMLInputElement> | undefined) => {
			if (event && event.key === 'Esc') {
				if (dispatchAnalyticsEvent) {
					const payload: AnalyticsEventPayload = {
						action: ACTION.CLOSED,
						actionSubject: ACTION_SUBJECT.PICKER,
						actionSubjectId: ACTION_SUBJECT_ID.PICKER_MEDIA,
						eventType: EVENT_TYPE.UI,
						attributes: { exitMethod: INPUT_METHOD.KEYBOARD },
					};
					dispatchAnalyticsEvent(payload);
				}
				closeMediaInsertPicker();
			}
		},
		[dispatchAnalyticsEvent, closeMediaInsertPicker],
	);

	const onCancel = React.useCallback(() => {
		if (dispatchAnalyticsEvent) {
			const payload: AnalyticsEventPayload = {
				action: ACTION.CANCELLED,
				actionSubject: ACTION_SUBJECT.PICKER,
				actionSubjectId: ACTION_SUBJECT_ID.PICKER_MEDIA,
				eventType: EVENT_TYPE.UI,
			};
			dispatchAnalyticsEvent(payload);
		}
		closeMediaInsertPicker();
	}, [closeMediaInsertPicker, dispatchAnalyticsEvent]);

	return (
		<Box
			as="form"
			onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault();
				uploadExternalMedia(inputUrl);
			}}
			xcss={FormStyles}
		>
			<Stack space="space.150" grow="fill">
				<TextField
					autoFocus
					value={inputUrl}
					placeholder={strings.pasteLinkToUpload}
					onChange={onURLChange}
					onKeyPress={onInputKeyPress}
					onPaste={onPaste}
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
							isDisabled={inputUrl.length === 0}
							iconBefore={EditorFilePreviewIcon}
						>
							{strings.loadPreview}
						</Button>
					</Flex>
				)}
				<Box xcss={ButtonGroupStyles}>
					<ButtonGroup>
						<Button appearance="subtle" onClick={onCancel}>
							{strings.cancel}
						</Button>
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
		</Box>
	);
}
