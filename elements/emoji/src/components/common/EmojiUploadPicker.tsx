/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type KeyboardEventHandler,
	useEffect,
	useLayoutEffect,
	useState,
	type ChangeEvent,
	type ChangeEventHandler,
	useRef,
	memo,
	useCallback,
	type ComponentType,
	type FC,
} from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import {
	FormattedMessage,
	injectIntl,
	type WithIntlProps,
	type WrappedComponentProps,
} from 'react-intl';
import TextField from '@atlaskit/textfield';
import CrossIcon from '@atlaskit/icon/core/cross';
import AkButton from '@atlaskit/button/standard-button';
import { Text } from '@atlaskit/primitives/compiled';
import FocusLock from 'react-focus-lock';

import type { EmojiUpload, Message } from '../../types';
import * as ImageUtil from '../../util/image';
import debug from '../../util/logger';
import { messages } from '../i18n';
import EmojiErrorMessage from './EmojiErrorMessage';
import EmojiUploadPreview from './EmojiUploadPreview';
import FileChooser from './FileChooser';
import { UploadStatus } from './internal-types';
import { fg } from '@atlaskit/platform-feature-flags';
import Button from '@atlaskit/button/new';
import { Box } from '@atlaskit/primitives/compiled';
import { getDocument } from '@atlaskit/browser-apis';

const closeEmojiUploadButton = css({
	display: 'flex',
});

const uploadAddRowNew = css({
	display: 'flex',
	justifyContent: 'flex-end',
	alignItems: 'center',
	gap: token('space.100'),
	paddingTop: token('space.100'),
	paddingBottom: token('space.150'),
});

const emojiUpload = css({
	paddingTop: token('space.100'),
	paddingRight: token('space.100'),
	paddingBottom: token('space.100'),
	paddingLeft: token('space.100'),
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-around',
});

const emojiUploadNew = css({
	paddingTop: token('space.100'),
	paddingRight: token('space.200'),
	paddingBottom: token('space.100'),
	paddingLeft: token('space.200'),
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-around',
});

const emojiUploadTop = css({
	paddingBottom: token('space.100'),
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'flex-end',
	font: token('font.body.small'),
});

const emojiUploadTopNew = css({
	paddingTop: token('space.075'),
	paddingBottom: token('space.150'),
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'flex-end',
});

const labelStyles = css({
	font: token('font.body.small'),
	fontWeight: token('font.weight.semibold'),
});

const labelStylesNew = css({
	font: token('font.body'),
	fontWeight: token('font.weight.semibold'),
});

const uploadChooseFileEmojiName = css({
	flex: '1 1 auto',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	input: {
		background: 'transparent',
		border: 0,
		outline: 'none',

		'&:invalid': {
			boxShadow: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&::-ms-clear': {
			display: 'none',
		},
	},
});

const uploadChooseFileMessage = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&': {
		color: token('color.text.subtle'),
	},
});

const uploadChooseFileRow = css({
	display: 'flex',
	justifyContent: 'space-between',
	paddingBottom: token('space.100'),
	columnGap: token('space.075'),
});

const uploadChooseFileRowNew = css({
	display: 'flex',
	flexDirection: 'column',
	gap: token('space.075'),
	minHeight: '250px',
});

export interface OnUploadEmoji {
	(upload: EmojiUpload, retry: boolean, onSuccessHandler?: () => void): void;
}

export const uploadEmojiNameInputTestId = 'upload-emoji-name-input';
export const uploadEmojiComponentTestId = 'upload-emoji-component';
export const cancelEmojiUploadPickerTestId = 'cancel-emoji-upload-picker';

export interface Props {
	disableFocusLock?: boolean;
	errorMessage?: Message;
	initialUploadName?: string;
	onFileChooserClicked?: () => void;
	onUploadCancelled: () => void;
	onUploadEmoji: OnUploadEmoji;
}

const disallowedReplacementsMap = new Map([
	[':', ''],
	['!', ''],
	['@', ''],
	['#', ''],
	['%', ''],
	['^', ''],
	['&', ''],
	['*', ''],
	['(', ''],
	[')', ''],
	[' ', '_'],
]);

const sanitizeName = (name: string): string => {
	// prevent / replace certain characters, allow others
	disallowedReplacementsMap.forEach((replaceWith, exclude) => {
		name = name.split(exclude).join(replaceWith);
	});
	return name;
};

const maxNameLength = 50;

const toEmojiName = (uploadName: string): string => {
	const name = uploadName.split('_').join(' ');
	return `${name.substr(0, 1).toLocaleUpperCase()}${name.substr(1)}`;
};

interface ChooseEmojiFileProps {
	errorMessage?: Message;
	name?: string;
	nameErrorMessage?: Message;
	onAddEmoji?: () => void;
	onChooseFile: ChangeEventHandler<any>;
	onClick?: () => void;
	onNameChange: ChangeEventHandler<any>;
	onUploadCancelled: () => void;
	previewImage?: string;
	uploadStatus?: UploadStatus;
}

type ChooseEmojiFilePropsType = ChooseEmojiFileProps & WrappedComponentProps;
const ChooseEmojiFile = memo((props: ChooseEmojiFilePropsType) => {
	const {
		name = '',
		onChooseFile,
		onClick,
		onNameChange,
		onUploadCancelled,
		onAddEmoji,
		errorMessage,
		nameErrorMessage,
		previewImage,
		uploadStatus,
		intl,
	} = props;
	const { formatMessage } = intl;
	const disableChooser = !name;
	const fileChooserButtonDescriptionId = 'choose.emoji.file.button.screen.reader.description.id';
	const inputRef = useRef<HTMLElement>(null);

	const onKeyDownHandler: KeyboardEventHandler<HTMLInputElement> = useCallback(
		(event) => {
			if (event.key === 'Escape') {
				onUploadCancelled();
			}
		},
		[onUploadCancelled],
	);

	useLayoutEffect(() => {
		requestAnimationFrame(() => {
			inputRef.current?.focus();
		});
	}, []);

	const cancelLabel = formatMessage(messages.cancelLabel);
	const emojiPlaceholder = formatMessage(messages.emojiPlaceholder);
	const emojiNameAriaLabel = formatMessage(messages.emojiNameAriaLabel);
	const emojiChooseFileTitle = formatMessage(messages.emojiChooseFileTitle);
	const emojiChooseFileTitleNew = formatMessage(messages.emojiChooseFileDndTitle);

	const isUploading = uploadStatus === UploadStatus.Uploading;
	const addEmojiDisabled = !previewImage || !name || isUploading;

	return fg('platform_emoji_picker_refresh') ? (
		<div css={emojiUploadNew} data-testid={uploadEmojiComponentTestId}>
			<div css={emojiUploadTopNew}>
				<label css={[uploadChooseFileMessage, labelStylesNew]} htmlFor="new-emoji-name-input">
					{previewImage ? (
						<FormattedMessage {...messages.emojiPreviewTitle} />
					) : (
						<FormattedMessage {...messages.addCustomEmojiLabel} />
					)}
				</label>
			</div>
			<div css={uploadChooseFileRowNew}>
				<Box>
					<FormattedMessage {...messages.emojiChooseFileScreenReaderDescription}>
						{() => (
							<FileChooser
								label={
									fg('platform_emoji_picker_refresh')
										? emojiChooseFileTitleNew
										: emojiChooseFileTitle
								}
								onChange={onChooseFile}
								onClick={onClick}
								accept="image/png,image/jpeg,image/gif"
								ariaDescribedBy={fileChooserButtonDescriptionId}
								previewImage={previewImage}
								previewAlt={name}
							/>
						)}
					</FormattedMessage>
					<div id={fileChooserButtonDescriptionId}>
						{errorMessage && <EmojiErrorMessage errorStyle="chooseFile" message={errorMessage} />}
					</div>
				</Box>
				<div>
					<label css={[uploadChooseFileMessage, labelStyles]} htmlFor="new-emoji-name-input">
						<FormattedMessage {...messages.emojiNameLabel} />
					</label>
					<TextField
						placeholder={emojiPlaceholder}
						aria-label={emojiNameAriaLabel}
						maxLength={maxNameLength}
						onChange={onNameChange}
						onKeyDown={onKeyDownHandler}
						value={name}
						isCompact
						autoFocus
						isInvalid={!!nameErrorMessage}
						testId={uploadEmojiNameInputTestId}
						ref={inputRef}
						id="new-emoji-name-input"
						aria-required={true}
					/>
					{nameErrorMessage && (
						<EmojiErrorMessage errorStyle="chooseFile" message={nameErrorMessage} />
					)}
				</div>
			</div>
			<div css={uploadAddRowNew}>
				<Button
					onClick={onUploadCancelled}
					appearance="subtle"
					isDisabled={isUploading}
					testId={cancelEmojiUploadPickerTestId}
				>
					<FormattedMessage {...messages.cancelLabel} />
				</Button>
				<Button
					onClick={onAddEmoji}
					appearance="primary"
					isDisabled={addEmojiDisabled}
					isLoading={isUploading}
				>
					<FormattedMessage {...messages.addEmojiLabel} />
				</Button>
			</div>
		</div>
	) : (
		<div css={emojiUpload} data-testid={uploadEmojiComponentTestId}>
			<div css={emojiUploadTop}>
				<label css={[uploadChooseFileMessage, labelStyles]} htmlFor="new-emoji-name-input">
					<FormattedMessage {...messages.addCustomEmojiLabel} />
				</label>
				<div css={closeEmojiUploadButton}>
					<AkButton
						onClick={onUploadCancelled}
						aria-label={cancelLabel}
						appearance="subtle"
						spacing="none"
						shouldFitContainer={true}
						testId={cancelEmojiUploadPickerTestId}
						name={messages.addCustomEmojiLabel.defaultMessage}
					>
						<CrossIcon color="currentColor" label={cancelLabel} />
					</AkButton>
				</div>
			</div>
			<div css={uploadChooseFileRow}>
				<span css={uploadChooseFileEmojiName}>
					<TextField
						placeholder={emojiPlaceholder}
						aria-label={emojiNameAriaLabel}
						maxLength={maxNameLength}
						onChange={onNameChange}
						onKeyDown={onKeyDownHandler}
						value={name}
						isCompact
						autoFocus
						testId={uploadEmojiNameInputTestId}
						ref={inputRef}
						id="new-emoji-name-input"
						aria-required={true}
					/>
				</span>
				<Text>
					<FormattedMessage {...messages.emojiChooseFileScreenReaderDescription}>
						{() => (
							<FileChooser
								label={
									fg('platform_emoji_picker_refresh')
										? emojiChooseFileTitleNew
										: emojiChooseFileTitle
								}
								onChange={onChooseFile}
								onClick={onClick}
								accept="image/png,image/jpeg,image/gif"
								ariaDescribedBy={fileChooserButtonDescriptionId}
								isDisabled={disableChooser}
							/>
						)}
					</FormattedMessage>
				</Text>
			</div>
			<div id={fileChooserButtonDescriptionId}>
				{!errorMessage ? (
					<Text as="p" size="small">
						<FormattedMessage {...messages.emojiImageRequirements} />
					</Text>
				) : (
					<EmojiErrorMessage errorStyle="chooseFile" message={errorMessage} />
				)}
			</div>
		</div>
	);
});

const EmojiUploadPicker = (props: Props & WrappedComponentProps) => {
	const {
		errorMessage,
		initialUploadName,
		onUploadEmoji,
		onFileChooserClicked,
		onUploadCancelled,
		disableFocusLock = false,
		intl,
	} = props;
	const [uploadStatus, setUploadStatus] = useState(
		errorMessage ? UploadStatus.Error : UploadStatus.Waiting,
	);
	const [chooseEmojiErrorMessage, setChooseEmojiErrorMessage] = useState<Message>();
	const [name, setName] = useState(initialUploadName && sanitizeName(initialUploadName));
	const [filename, setFilename] = useState<string>();
	const [previewImage, setPreviewImage] = useState<string>();
	// document is undefined during ssr rendering and throws an error
	const lastFocusedElementId = useRef(
		typeof document !== 'undefined' ? document.activeElement?.id : '',
	);

	useEffect(() => {
		if (errorMessage) {
			setUploadStatus(UploadStatus.Error);
			return;
		} else {
			if (uploadStatus === UploadStatus.Error) {
				setUploadStatus(UploadStatus.Waiting);
			}
		}
	}, [errorMessage, uploadStatus]);

	useEffect(() => {
		if (initialUploadName) {
			setName(sanitizeName(initialUploadName));
		}
	}, [initialUploadName]);

	const clearUploadPicker = useCallback(() => {
		setName(undefined);
		setPreviewImage(undefined);
		setUploadStatus(UploadStatus.Waiting);
	}, []);

	const onNameChange = useCallback(
		(event: ChangeEvent<any>) => {
			let newName = sanitizeName(event.target.value);
			if (name !== newName) {
				setName(newName);
			}
		},
		[name],
	);

	const onAddEmoji = useCallback(() => {
		if (uploadStatus === UploadStatus.Uploading) {
			return;
		}

		if (filename && name && previewImage) {
			const notifyUpload = (size: { height: number; width: number }) => {
				const { width, height } = size;
				setUploadStatus(UploadStatus.Uploading);

				onUploadEmoji(
					{
						name: toEmojiName(name),
						shortName: `:${name}:`,
						filename,
						dataURL: previewImage,
						width,
						height,
					},
					uploadStatus === UploadStatus.Error,
					clearUploadPicker,
				);
			};
			ImageUtil.getNaturalImageSize(previewImage)
				.then((size) => {
					notifyUpload(size);
				})
				.catch((error) => {
					debug('getNaturalImageSize error', error);
					// Just set arbitrary size, worse case is it may render
					// in wrong aspect ratio in some circumstances.
					notifyUpload({
						width: 32,
						height: 32,
					});
				});
		}
	}, [clearUploadPicker, filename, name, onUploadEmoji, previewImage, uploadStatus]);

	const cancelChooseFile = useCallback(() => {
		setPreviewImage(undefined);
	}, []);

	const errorOnUpload = useCallback(
		(event: any): void => {
			debug('File load error: ', event);
			setChooseEmojiErrorMessage(<FormattedMessage {...messages.emojiUploadFailed} />);
			cancelChooseFile();
		},
		[cancelChooseFile],
	);

	const onFileLoad = useCallback(
		(file: File) =>
			async (f: any): Promise<any> => {
				try {
					setFilename(file.name);
					await ImageUtil.parseImage(f.target.result);
					setPreviewImage(f.target.result);
					setChooseEmojiErrorMessage(undefined);
				} catch {
					setChooseEmojiErrorMessage(<FormattedMessage {...messages.emojiInvalidImage} />);
					cancelChooseFile();
				}
			},
		[cancelChooseFile],
	);

	const onChooseFile = useCallback(
		(event: ChangeEvent<any>): void => {
			const files = event.target.files;
			if (files.length) {
				const reader = new FileReader();
				const file: File = files[0];

				if (ImageUtil.hasFileExceededSize(file)) {
					setChooseEmojiErrorMessage(<FormattedMessage {...messages.emojiImageTooBig} />);
					cancelChooseFile();
					return;
				}

				reader.addEventListener('load', onFileLoad(file));
				reader.addEventListener('abort', errorOnUpload);
				reader.addEventListener('error', errorOnUpload);
				reader.readAsDataURL(file);
			} else {
				cancelChooseFile();
			}
		},
		[cancelChooseFile, errorOnUpload, onFileLoad],
	);

	const cancelUpload = useCallback(() => {
		clearUploadPicker();
		onUploadCancelled();

		// using setTimeout here to allow the UI to update before setting focus
		setTimeout(
			(lastFocus) => {
				if (lastFocus) {
					getDocument()?.getElementById(lastFocus)?.focus();
				}
			},
			0,
			lastFocusedElementId.current,
		);
	}, [clearUploadPicker, onUploadCancelled]);

	const onChooseFileClicked = () => {
		onFileChooserClicked && onFileChooserClicked();
	};

	const isDuplicateNameError =
		errorMessage !== null && errorMessage !== undefined && fg('platform_emoji_picker_refresh');

	const content =
		name && previewImage && !fg('platform_emoji_picker_refresh') ? (
			<EmojiUploadPreview
				errorMessage={errorMessage}
				name={name}
				onAddEmoji={onAddEmoji}
				onUploadCancelled={cancelUpload}
				previewImage={previewImage}
				uploadStatus={uploadStatus}
			/>
		) : (
			<ChooseEmojiFile
				name={name}
				onChooseFile={onChooseFile}
				onClick={onChooseFileClicked}
				onNameChange={onNameChange}
				onUploadCancelled={cancelUpload}
				onAddEmoji={onAddEmoji}
				previewImage={previewImage}
				uploadStatus={uploadStatus}
				errorMessage={chooseEmojiErrorMessage}
				nameErrorMessage={isDuplicateNameError ? errorMessage : undefined}
				intl={intl}
			/>
		);

	return disableFocusLock || fg('platform_emoji_picker_refresh') ? (
		content
	) : (
		<FocusLock noFocusGuards>{content}</FocusLock>
	);
};

// eslint-disable-next-line @typescript-eslint/ban-types
const EmojiUploadPickerComponent: FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: ComponentType<Props & WrappedComponentProps>;
} = injectIntl(memo(EmojiUploadPicker));

export default EmojiUploadPickerComponent;
