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
} from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N300 } from '@atlaskit/theme/colors';
import { FormattedMessage, injectIntl, type WrappedComponentProps } from 'react-intl-next';
import TextField from '@atlaskit/textfield';
import CrossIcon from '@atlaskit/icon/core/migration/close--cross';
import AkButton from '@atlaskit/button/standard-button';
import { Text } from '@atlaskit/primitives';
import FocusLock from 'react-focus-lock';

import type { EmojiUpload, Message } from '../../../types';
import * as ImageUtil from '../../../util/image';
import debug from '../../../util/logger';
import { messages } from '../../i18n';
import EmojiErrorMessage from './EmojiErrorMessage';
import EmojiUploadPreview from './EmojiUploadPreview';
import FileChooser from '../../common/FileChooser';
import { UploadStatus } from '../../common/internal-types';

const closeEmojiUploadButton = css({
	display: 'flex',
});

const emojiUpload = css({
	height: '78px',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	padding: '10px',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-around',
});

const emojiUploadTop = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingBottom: '7px',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'flex-end',
	font: token('font.body.UNSAFE_small'),
});

const headingH5 = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&': {
		font: token('font.body.UNSAFE_small'),
		fontWeight: token('font.weight.semibold', '600'),
	},
});

const uploadChooseFileEmojiName = css({
	flex: '1 1 auto',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginRight: '5px',
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
		color: token('color.text.subtle', N300),
	},
});

const uploadChooseFileRow = css({
	display: 'flex',
	justifyContent: 'space-between',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingBottom: '7px',
});

export interface OnUploadEmoji {
	(upload: EmojiUpload, retry: boolean, onSuccessHandler?: () => void): void;
}

export const uploadEmojiNameInputTestId = 'upload-emoji-name-input';
export const uploadEmojiComponentTestId = 'upload-emoji-component';
export const cancelEmojiUploadPickerTestId = 'cancel-emoji-upload-picker';

export interface Props {
	onUploadEmoji: OnUploadEmoji;
	onUploadCancelled: () => void;
	onFileChooserClicked?: () => void;
	errorMessage?: Message;
	initialUploadName?: string;
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
	name?: string;
	onChooseFile: ChangeEventHandler<any>;
	onClick?: () => void;
	onNameChange: ChangeEventHandler<any>;
	onUploadCancelled: () => void;
	errorMessage?: Message;
}

type ChooseEmojiFilePropsType = ChooseEmojiFileProps & WrappedComponentProps;
const ChooseEmojiFile = memo((props: ChooseEmojiFilePropsType) => {
	const {
		name = '',
		onChooseFile,
		onClick,
		onNameChange,
		onUploadCancelled,
		errorMessage,
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

	return (
		<div css={emojiUpload} data-testid={uploadEmojiComponentTestId}>
			<div css={emojiUploadTop}>
				<label css={[uploadChooseFileMessage, headingH5]} htmlFor="new-emoji-name-input">
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
					>
						<CrossIcon color="currentColor" LEGACY_size="small" label={cancelLabel} />
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
								label={emojiChooseFileTitle}
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
			const notifyUpload = (size: { width: number; height: number }) => {
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
					document.getElementById(lastFocus)?.focus();
				}
			},
			0,
			lastFocusedElementId.current,
		);
	}, [clearUploadPicker, onUploadCancelled]);

	const onChooseFileClicked = () => {
		onFileChooserClicked && onFileChooserClicked();
	};

	return (
		<FocusLock noFocusGuards>
			{name && previewImage ? (
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
					errorMessage={chooseEmojiErrorMessage}
					intl={intl}
				/>
			)}
		</FocusLock>
	);
};

const EmojiUploadPickerComponent = injectIntl(memo(EmojiUploadPicker));

export default EmojiUploadPickerComponent;
