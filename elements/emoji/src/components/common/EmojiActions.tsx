/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState, useRef, memo, useLayoutEffect } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage, injectIntl, type WrappedComponentProps } from 'react-intl-next';
import type {
	EmojiDescription,
	EmojiDescriptionWithVariations,
	Message,
	OnToneSelected,
	OnToneSelectorCancelled,
	ToneSelection,
	ToneValueType,
} from '../../types';
import EmojiDeletePreview, { type OnDeleteEmoji } from '../common/EmojiDeletePreview';
import EmojiUploadPicker, { type OnUploadEmoji } from '../common/EmojiUploadPicker';
import { EmojiPickerListSearch } from '../picker/EmojiPickerListSearch';
import ToneSelector from './ToneSelector';
import TonePreviewButton from './TonePreviewButton';
import { messages } from '../i18n';
import AkButton from '@atlaskit/button/standard-button';
import AddIcon from '@atlaskit/icon/core/migration/add';
import { setSkinToneAriaLabelText } from './setSkinToneAriaLabelText';
import {
	addCustomEmoji,
	addCustomEmojiButton,
	emojiActionsWrapper,
	emojiPickerAddEmoji,
	emojiToneSelectorContainer,
} from './styles';
import { emojiActionsContainerWithBottomShadow, emojiPickerFooter } from '../picker/styles';
import { DEFAULT_TONE } from '../../util/constants';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

export interface Props {
	selectedTone?: ToneSelection;
	onToneSelected?: OnToneSelected;
	onToneSelectorCancelled?: OnToneSelectorCancelled;
	toneEmoji?: EmojiDescriptionWithVariations;
	uploading: boolean;
	uploadEnabled: boolean;
	emojiToDelete?: EmojiDescription;
	initialUploadName?: string;
	uploadErrorMessage?: Message;
	onUploadCancelled: () => void;
	onUploadEmoji: OnUploadEmoji;
	onCloseDelete: () => void;
	onDeleteEmoji: OnDeleteEmoji;
	onFileChooserClicked?: () => void;
	onOpenUpload: () => void;
	query?: string;
	onChange: (value: string) => void;
	resultsCount?: number;
}

export const emojiActionsTestId = 'emoji-actions';
export const uploadEmojiTestId = 'upload-emoji';

const iconStyles = xcss({ marginLeft: 'space.negative.050', marginRight: 'space.negative.025' });

// Generic Type for the wrapped functional component
type PropsWithWrappedComponentPropsType = Props & WrappedComponentProps;

type AddOwnEmojiProps = PropsWithWrappedComponentPropsType;
const AddOwnEmoji = (props: AddOwnEmojiProps) => {
	const { onOpenUpload, uploadEnabled } = props;

	return (
		<Fragment>
			{uploadEnabled && (
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				<div css={addCustomEmoji} data-testid={uploadEmojiTestId}>
					<FormattedMessage {...messages.addCustomEmojiLabel}>
						{(label) => (
							<AkButton
								onClick={onOpenUpload}
								iconBefore={
									<Box xcss={iconStyles}>
										<AddIcon
											LEGACY_margin={`0 ${token('space.025')} 0 ${token('space.050')}`}
											color="currentColor"
											label=""
											LEGACY_size="small"
										/>
									</Box>
								}
								appearance="subtle"
								// TODO: (from codemod) Buttons with "component", "css" or "style" prop can't be automatically migrated with codemods. Please migrate it manually.
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								css={addCustomEmojiButton}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className={emojiPickerAddEmoji}
								tabIndex={0}
								id="add-custom-emoji"
							>
								{label}
							</AkButton>
						)}
					</FormattedMessage>
				</div>
			)}
		</Fragment>
	);
};

type TonesWrapperProps = PropsWithWrappedComponentPropsType & {
	onToneOpen: () => void;
	onToneClose: () => void;
	onToneSelected: (toneValue: ToneValueType) => void;
	showToneSelector: boolean;
};
const TonesWrapper = (props: TonesWrapperProps) => {
	const { toneEmoji, selectedTone = DEFAULT_TONE, intl, onToneOpen, showToneSelector } = props;
	const { formatMessage } = intl;
	const tonePreviewButtonRef = useRef<HTMLButtonElement>(null);
	const [focusTonePreviewButton, setFocusTonePreviewButton] = useState(false);

	useLayoutEffect(() => {
		if (focusTonePreviewButton && !showToneSelector) {
			tonePreviewButtonRef.current?.focus();
		}
		return () => {
			setFocusTonePreviewButton(false);
		};
	}, [focusTonePreviewButton, showToneSelector]);

	const onToneCloseHandler = () => {
		const { onToneClose } = props;
		onToneClose();
		setFocusTonePreviewButton(true);
	};

	const onToneSelectedHandler = (toneValue: ToneValueType) => {
		const { onToneSelected } = props;
		onToneSelected(toneValue);
		setFocusTonePreviewButton(true);
	};

	if (!toneEmoji) {
		return null;
	}

	let previewToneEmoji = toneEmoji;
	if (selectedTone !== DEFAULT_TONE && previewToneEmoji.skinVariations) {
		previewToneEmoji = previewToneEmoji.skinVariations[selectedTone - 1];
	}

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={emojiToneSelectorContainer}>
			<ToneSelector
				emoji={toneEmoji}
				onToneSelected={onToneSelectedHandler}
				onToneClose={onToneCloseHandler}
				selectedTone={selectedTone}
				isVisible={showToneSelector}
			/>
			<TonePreviewButton
				ref={tonePreviewButtonRef}
				ariaExpanded={showToneSelector}
				emoji={previewToneEmoji}
				selectOnHover
				onSelected={onToneOpen}
				ariaLabelText={formatMessage(messages.emojiSelectSkinToneButtonAriaLabelText, {
					selectedTone: `${setSkinToneAriaLabelText(previewToneEmoji.name as string)}`,
				})}
				isVisible={!showToneSelector}
			/>
		</div>
	);
};

type EmojiActionsProps = PropsWithWrappedComponentPropsType;
export const EmojiActions = (props: EmojiActionsProps) => {
	const {
		onToneSelected,
		onToneSelectorCancelled,
		initialUploadName,
		onUploadCancelled,
		onCloseDelete,
		onDeleteEmoji,
		onUploadEmoji,
		uploadErrorMessage,
		uploading,
		onFileChooserClicked,
		emojiToDelete,
		onChange,
		query,
		resultsCount = 0,
	} = props;
	const [showToneSelector, setShowToneSelector] = useState(false);

	const previewFooterClassnames = [emojiPickerFooter, emojiActionsContainerWithBottomShadow];

	const onToneOpenHandler = () => setShowToneSelector(true);

	const onToneCloseHandler = () => setShowToneSelector(false);

	const onToneSelectedHandler = (toneValue: ToneValueType) => {
		setShowToneSelector(false);
		if (onToneSelected) {
			onToneSelected(toneValue);
		}
	};

	const onMouseLeaveHandler = () => {
		if (showToneSelector && onToneSelectorCancelled) {
			onToneSelectorCancelled();
		}
		setShowToneSelector(false);
	};

	if (uploading) {
		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			<div css={previewFooterClassnames}>
				<EmojiUploadPicker
					onUploadCancelled={onUploadCancelled}
					onUploadEmoji={onUploadEmoji}
					onFileChooserClicked={onFileChooserClicked}
					errorMessage={uploadErrorMessage}
					initialUploadName={initialUploadName}
				/>
			</div>
		);
	}

	if (emojiToDelete) {
		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			<div css={previewFooterClassnames}>
				<EmojiDeletePreview
					emoji={emojiToDelete}
					onDeleteEmoji={onDeleteEmoji}
					onCloseDelete={onCloseDelete}
				/>
			</div>
		);
	}

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			data-testid={emojiActionsTestId}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={previewFooterClassnames}
			onMouseLeave={onMouseLeaveHandler}
		>
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
			<div css={emojiActionsWrapper}>
				<EmojiPickerListSearch
					onChange={onChange}
					query={query}
					resultsCount={resultsCount}
					isVisible={!showToneSelector}
				/>
				<TonesWrapper
					{...props}
					onToneOpen={onToneOpenHandler}
					onToneClose={onToneCloseHandler}
					onToneSelected={onToneSelectedHandler}
					showToneSelector={showToneSelector}
				/>
			</div>
			<AddOwnEmoji {...props} />
		</div>
	);
};

export default injectIntl(memo(EmojiActions));
