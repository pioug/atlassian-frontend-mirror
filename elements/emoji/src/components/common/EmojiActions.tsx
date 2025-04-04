/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState, useRef, memo, useLayoutEffect, useCallback } from 'react';
import { css, cssMap, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N30A } from '@atlaskit/theme/colors';
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
import EmojiDeletePreview, { type OnDeleteEmoji } from './EmojiDeletePreview';
import EmojiUploadPicker, { type OnUploadEmoji } from './EmojiUploadPicker';
import TonePreviewButton from './TonePreviewButton';
import ToneSelector from './ToneSelector';
import { EmojiPickerListSearch } from '../picker/EmojiPickerListSearch';
import { messages } from '../i18n';
import AkButton from '@atlaskit/button/standard-button';
import AddIcon from '@atlaskit/icon/core/migration/add';
import { setSkinToneAriaLabelText } from './setSkinToneAriaLabelText';
import { emojiPickerAddEmoji } from './styles';
import { DEFAULT_TONE } from '../../util/constants';
import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	icon: { marginLeft: token('space.negative.050'), marginRight: token('space.negative.025') },
});

const addCustomEmoji = css({
	alignSelf: 'center',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginLeft: '10px',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginBottom: '10px',
});

const addCustomEmojiButton = css({
	maxWidth: '285px',
});

const emojiActionsWrapper = css({
	display: 'flex',
	justifyContent: 'flex-end',
	alignItems: 'center',
});

const emojiToneSelectorContainer = css({
	flex: 1,
	display: 'flex',
	justifyContent: 'flex-end',
	padding: '11px 10px 12px 0',
});

const previewFooter = css({
	flex: '0 0 auto',
	borderBottom: `2px solid ${token('color.border', N30A)}`,
	boxShadow: `0px 1px 1px 0px ${token('color.border', 'rgba(0, 0, 0, 0.1)')}`,
});

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

// Generic Type for the wrapped functional component
type PropsWithWrappedComponentPropsType = Props & WrappedComponentProps;

type AddOwnEmojiProps = PropsWithWrappedComponentPropsType;
const AddOwnEmoji = (props: AddOwnEmojiProps) => {
	const { onOpenUpload, uploadEnabled } = props;

	return (
		<Fragment>
			{uploadEnabled && (
				<div css={addCustomEmoji} data-testid={uploadEmojiTestId}>
					<FormattedMessage {...messages.addCustomEmojiLabel}>
						{(label) => (
							<AkButton
								onClick={onOpenUpload}
								iconBefore={
									<Box xcss={styles.icon}>
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

	const onToneCloseHandler = useCallback(() => {
		const { onToneClose } = props;
		onToneClose();
		setFocusTonePreviewButton(true);
	}, [props]);

	const onToneSelectedHandler = useCallback(
		(toneValue: ToneValueType) => {
			const { onToneSelected } = props;
			onToneSelected(toneValue);
			setFocusTonePreviewButton(true);
		},
		[props],
	);

	if (!toneEmoji) {
		return null;
	}

	let previewToneEmoji = toneEmoji;
	if (selectedTone !== DEFAULT_TONE && previewToneEmoji.skinVariations) {
		previewToneEmoji = previewToneEmoji.skinVariations[selectedTone - 1];
	}

	return (
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

	const onToneOpenHandler = useCallback(() => setShowToneSelector(true), []);

	const onToneCloseHandler = useCallback(() => setShowToneSelector(false), []);

	const onToneSelectedHandler = useCallback(
		(toneValue: ToneValueType) => {
			setShowToneSelector(false);
			if (onToneSelected) {
				onToneSelected(toneValue);
			}
		},
		[onToneSelected],
	);

	const onMouseLeaveHandler = useCallback(() => {
		if (showToneSelector && onToneSelectorCancelled) {
			onToneSelectorCancelled();
		}
		setShowToneSelector(false);
	}, [showToneSelector, onToneSelectorCancelled]);

	if (uploading) {
		return (
			<div css={previewFooter}>
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
			<div css={previewFooter}>
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
		<div data-testid={emojiActionsTestId} css={previewFooter} onMouseLeave={onMouseLeaveHandler}>
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
