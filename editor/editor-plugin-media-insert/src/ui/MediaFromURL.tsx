import React from 'react';

import { useIntl } from 'react-intl-next';

import { isSafeUrl } from '@atlaskit/adf-schema';
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
import Form, { ErrorMessage, Field, FormFooter, MessageWrapper } from '@atlaskit/form';
import EditorFilePreviewIcon from '@atlaskit/icon/glyph/editor/file-preview';
import { getMediaClient } from '@atlaskit/media-client-react';
import { Box, Flex, Inline, Stack, xcss } from '@atlaskit/primitives';
import SectionMessage from '@atlaskit/section-message';
import TextField from '@atlaskit/textfield';

import { type InsertExternalMediaSingle, type InsertMediaSingle } from '../types';

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

const FormStyles = xcss({
	flexGrow: 1,
});

type PreviewState = {
	isLoading: boolean;
	error: string | null;
	warning: string | null;
	previewInfo: Required<OnInsertAttrs> | null;
};

type PreviewStateAction =
	| { type: 'loading' }
	| { type: 'error'; error: string }
	| { type: 'warning'; warning: string; url: string }
	| { type: 'success'; payload: Required<OnInsertAttrs> }
	| { type: 'reset' };

const INITIAL_PREVIEW_STATE: Readonly<PreviewState> = Object.freeze({
	isLoading: false,
	error: null,
	warning: null,
	previewInfo: null,
});

const MAX_URL_LENGTH = 2048;
export const isValidUrl = (value: string): boolean => {
	try {
		// Check for spaces and length first to avoid the expensive URL parsing
		if (/\s/.test(value) || value.length > MAX_URL_LENGTH) {
			return false;
		}
		new URL(value);
	} catch (e) {
		return false;
	}
	return isSafeUrl(value);
};

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
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	closeMediaInsertPicker: () => void;
	insertMediaSingle: InsertMediaSingle;
	insertExternalMediaSingle: InsertExternalMediaSingle;
};

export function MediaFromURL({
	mediaProvider,
	dispatchAnalyticsEvent,
	closeMediaInsertPicker,
	insertMediaSingle,
	insertExternalMediaSingle,
}: Props) {
	const intl = useIntl();
	const strings = {
		loadPreview: intl.formatMessage(mediaInsertMessages.loadPreview),
		insert: intl.formatMessage(mediaInsertMessages.insert),
		pasteLinkToUpload: intl.formatMessage(mediaInsertMessages.pasteLinkToUpload),
		cancel: intl.formatMessage(mediaInsertMessages.cancel),
		errorMessage: intl.formatMessage(mediaInsertMessages.fromUrlErrorMessage),
		warning: intl.formatMessage(mediaInsertMessages.fromUrlWarning),
		invalidUrl: intl.formatMessage(mediaInsertMessages.invalidUrlErrorMessage),
	};

	const [previewState, dispatch] = React.useReducer(previewStateReducer, INITIAL_PREVIEW_STATE);
	const pasteFlag = React.useRef(false);

	const {
		onUploadButtonClickedAnalytics,
		onUploadCommencedAnalytics,
		onUploadSuccessAnalytics,
		onUploadFailureAnalytics,
	} = useAnalyticsEvents(dispatchAnalyticsEvent);

	const uploadExternalMedia = React.useCallback(
		async (url: string) => {
			onUploadButtonClickedAnalytics();
			dispatch({ type: 'loading' });
			const { uploadMediaClientConfig, uploadParams } = mediaProvider;
			if (!uploadMediaClientConfig) {
				return;
			}

			const mediaClient = getMediaClient(uploadMediaClientConfig);
			const collection = uploadParams?.collection;

			onUploadCommencedAnalytics('url');
			try {
				const { uploadableFileUpfrontIds, dimensions, mimeType } =
					await mediaClient.file.uploadExternal(url, collection);
				onUploadSuccessAnalytics('url');
				dispatch({
					type: 'success',
					payload: {
						id: uploadableFileUpfrontIds.id,
						collection,
						dimensions,
						occurrenceKey: uploadableFileUpfrontIds.occurrenceKey,
						fileMimeType: mimeType,
					},
				});
			} catch (e) {
				if (typeof e === 'string' && e === 'Could not download remote file') {
					// TODO: Make sure this gets good unit test coverage with the actual
					// media plugin. This hard coded error message could be changed at any
					// point and we need a unit test to break to stop people changing it.
					onUploadFailureAnalytics(e, 'url');
					dispatch({ type: 'warning', warning: e, url });
				} else if (e instanceof Error) {
					const message = 'Image preview fetch failed';
					onUploadFailureAnalytics(message, 'url');
					dispatch({ type: 'error', error: message });
				} else {
					onUploadFailureAnalytics('Unknown error', 'url');
					dispatch({ type: 'error', error: 'Unknown error' });
				}
			}
		},
		[
			onUploadButtonClickedAnalytics,
			mediaProvider,
			onUploadCommencedAnalytics,
			onUploadSuccessAnalytics,
			onUploadFailureAnalytics,
		],
	);

	const onURLChange = React.useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			const url = e.currentTarget.value;
			dispatch({ type: 'reset' });
			if (!isValidUrl(url)) {
				return;
			}
			if (pasteFlag.current) {
				pasteFlag.current = false;
				uploadExternalMedia(url);
			}
		},
		[uploadExternalMedia],
	);

	const onPaste = React.useCallback(
		(e: React.ClipboardEvent<HTMLInputElement>, inputUrl: string) => {
			// Note: this is a little weird, but the paste event will always be
			// fired before the change event when pasting. We don't really want to
			// duplicate logic by handling pastes separately to changes, so we're
			// just noting paste occurred to then be handled in the onURLChange fn
			// above. The one exception to this is where paste inputs exactly what was
			// already in the input, in which case we want to ignore it.
			if (e.clipboardData.getData('text') !== inputUrl) {
				pasteFlag.current = true;
			}
		},
		[],
	);

	const onInsert = React.useCallback(() => {
		if (previewState.previewInfo) {
			insertMediaSingle({
				mediaState: previewState.previewInfo,
				inputMethod: INPUT_METHOD.MEDIA_PICKER,
			});
		}
		closeMediaInsertPicker();
	}, [closeMediaInsertPicker, insertMediaSingle, previewState.previewInfo]);

	const onExternalInsert = React.useCallback(
		(url: string) => {
			if (previewState.warning) {
				insertExternalMediaSingle({
					url,
					alt: '',
					inputMethod: INPUT_METHOD.MEDIA_PICKER,
				});
			}
			closeMediaInsertPicker();
		},
		[closeMediaInsertPicker, insertExternalMediaSingle, previewState.warning],
	);

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
		<Form<{ inputUrl: string }>
			onSubmit={({ inputUrl }, form) => {
				// This can be triggered from an enter key event on the input even when
				// the button is disabled, so we explicitly do nothing when in loading
				// state.
				if (previewState.isLoading || form.getState().invalid) {
					return;
				}

				if (previewState.previewInfo) {
					return onInsert();
				}

				if (previewState.warning) {
					return onExternalInsert(inputUrl);
				}

				return uploadExternalMedia(inputUrl);
			}}
		>
			{({ formProps }) => (
				<Box as="form" {...formProps} xcss={FormStyles}>
					<Stack space="space.150" grow="fill">
						<Field
							aria-required={true}
							isRequired={true}
							name="inputUrl"
							validate={(value) => (value && isValidUrl(value) ? undefined : strings.invalidUrl)}
						>
							{({ fieldProps: { value, onChange, ...rest }, error, meta }) => (
								<Stack space="space.150" grow="fill">
									<Box>
										<TextField
											{...rest}
											value={value}
											placeholder={strings.pasteLinkToUpload}
											maxLength={MAX_URL_LENGTH}
											onKeyPress={onInputKeyPress}
											onPaste={(event) => onPaste(event, value)}
											onChange={(value) => {
												onURLChange(value);
												onChange(value);
											}}
										/>
										<MessageWrapper>
											{error && (
												<ErrorMessage>
													<Box as="span">{error}</Box>
												</ErrorMessage>
											)}
										</MessageWrapper>
									</Box>
									{!previewState.previewInfo && !previewState.error && !previewState.warning && (
										<Flex xcss={PreviewBoxStyles} alignItems="center" justifyContent="center">
											<Button
												type="submit"
												isLoading={previewState.isLoading}
												isDisabled={!!error || !meta.dirty}
												iconBefore={EditorFilePreviewIcon}
											>
												{strings.loadPreview}
											</Button>
										</Flex>
									)}
								</Stack>
							)}
						</Field>
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
						<MessageWrapper>
							{previewState.error && (
								<SectionMessage appearance="error">{strings.errorMessage}</SectionMessage>
							)}
							{previewState.warning && (
								<SectionMessage appearance="warning">{strings.warning}</SectionMessage>
							)}
						</MessageWrapper>
						<FormFooter>
							<ButtonGroup>
								<Button appearance="subtle" onClick={onCancel}>
									{strings.cancel}
								</Button>
								<Button
									type="submit"
									appearance="primary"
									isDisabled={!previewState.previewInfo && !previewState.warning}
								>
									{strings.insert}
								</Button>
							</ButtonGroup>
						</FormFooter>
					</Stack>
				</Box>
			)}
		</Form>
	);
}
