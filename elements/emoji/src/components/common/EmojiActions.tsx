/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	Fragment,
	useState,
	useRef,
	memo,
	useLayoutEffect,
	useCallback,
	type ComponentType,
	type FC,
	type KeyboardEvent,
	type MouseEvent,
	useEffect,
} from 'react';
import { css, cssMap, jsx } from '@compiled/react';
import { fg } from '@atlaskit/platform-feature-flags';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import { token } from '@atlaskit/tokens';
import {
	FormattedMessage,
	injectIntl,
	type WithIntlProps,
	type WrappedComponentProps,
} from 'react-intl';
import type {
	EmojiDescription,
	EmojiDescriptionWithVariations,
	Message,
	OnToneSelected,
	OnToneSelectorCancelled,
	ToneSelection,
	ToneValueType,
} from '../../types';
import type { CategoryId } from '../picker/categories';
import EmojiDeletePreview, { type OnDeleteEmoji } from './EmojiDeletePreview';
import EmojiUploadPicker, { type OnUploadEmoji } from './EmojiUploadPicker';
import TonePreviewButton from './TonePreviewButton';
import ToneSelector from './ToneSelector';
import ProductivityColorSelector, {
	productivityColorSelectorId,
} from './ProductivityColorSelector';
import Popup from './Popup';
import { EmojiPickerListSearch } from '../picker/EmojiPickerListSearch';
import { messages } from '../i18n';
import AkButton from '@atlaskit/button/standard-button';
import AddIcon from '@atlaskit/icon/core/add';
import { setSkinToneAriaLabelText } from './setSkinToneAriaLabelText';
import { emojiPickerAddEmoji } from './styles';
import { DEFAULT_TONE } from '../../util/constants';
import { Box } from '@atlaskit/primitives/compiled';
import { layers } from '@atlaskit/theme/constants';
import type { ProductivityColor } from '../../util/productivity-colors';

const isRefreshEmojiPickerEnabled = (): boolean => {
	if (!FeatureGates.initializeCompleted()) {
		return false;
	}

	// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
	const isEnabled = FeatureGates.getExperimentValue(
		'platform_teamoji_26_refresh_emoji_picker',
		'isEnabled',
		false,
	);

	return isEnabled;
};

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

const productivityColorPopup = css({
	backgroundColor: token('elevation.surface.overlay'),
	border: `${token('border.width')} solid ${token('color.border')}`,
	borderRadius: token('radius.small', '3px'),
	boxShadow: token('elevation.shadow.overlay'),
	paddingTop: token('space.075'),
	paddingRight: token('space.075'),
	paddingBottom: token('space.075'),
	paddingLeft: token('space.075'),
});

const previewFooter = css({
	flex: '0 0 auto',
	borderBottom: `${token('border.width.selected')} solid ${token('color.border')}`,
	boxShadow: `0px 1px 1px 0px ${token('color.border')}`,
});

const previewFooterNew = css({
	flex: '0 0 auto',
});

const atlassianSubcategoriesWithProductivityColorSelector = ['Objects', 'Productivity', 'Logos'];

type ProductivityColorPopupContentProps = {
	colorPreviewEmojis: Partial<Record<ProductivityColor, EmojiDescription>>;
	focusSelectedColorOnMount: boolean;
	onColorSelected: (color: ProductivityColor) => void;
	selectedColor: ProductivityColor;
};

const ProductivityColorPopupContent = ({
	colorPreviewEmojis,
	focusSelectedColorOnMount,
	onColorSelected,
	selectedColor,
}: ProductivityColorPopupContentProps) => {
	const popupRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const popupElement = popupRef.current;

		if (!popupElement) {
			return;
		}

		const isProductivityColorInput = (target: EventTarget | null) =>
			target instanceof HTMLInputElement && target.name === 'productivity-emoji-colour';

		const stopNonInputDismissal = (event: Event) => {
			if (isProductivityColorInput(event.target)) {
				return;
			}

			event.stopPropagation();
		};

		const stopNonInputDismissalBeforeDocument = (event: Event) => {
			if (
				!(event.target instanceof Node) ||
				!popupElement.contains(event.target) ||
				isProductivityColorInput(event.target)
			) {
				return;
			}

			event.stopPropagation();
		};

		window.addEventListener('pointerdown', stopNonInputDismissalBeforeDocument, true);
		window.addEventListener('mousedown', stopNonInputDismissalBeforeDocument, true);
		window.addEventListener('click', stopNonInputDismissalBeforeDocument, true);
		popupElement.addEventListener('pointerdown', stopNonInputDismissal);
		popupElement.addEventListener('mousedown', stopNonInputDismissal);
		popupElement.addEventListener('click', stopNonInputDismissal);

		return () => {
			window.removeEventListener('pointerdown', stopNonInputDismissalBeforeDocument, true);
			window.removeEventListener('mousedown', stopNonInputDismissalBeforeDocument, true);
			window.removeEventListener('click', stopNonInputDismissalBeforeDocument, true);
			popupElement.removeEventListener('pointerdown', stopNonInputDismissal);
			popupElement.removeEventListener('mousedown', stopNonInputDismissal);
			popupElement.removeEventListener('click', stopNonInputDismissal);
		};
	}, []);

	return (
		<div ref={popupRef} css={productivityColorPopup}>
			<ProductivityColorSelector
				colorPreviewEmojis={colorPreviewEmojis}
				focusSelectedColorOnMount={focusSelectedColorOnMount}
				selectedColor={selectedColor}
				onColorSelected={onColorSelected}
			/>
		</div>
	);
};

export interface Props {
	activeCategoryId?: CategoryId | null;
	activeAtlassianSubcategory?: string | null;
	emojiToDelete?: EmojiDescription;
	initialUploadName?: string;
	onChange: (value: string) => void;
	onCloseDelete: () => void;
	onDeleteEmoji: OnDeleteEmoji;
	onFileChooserClicked?: () => void;
	onOpenUpload: () => void;
	onProductivityColorSelected?: (color: ProductivityColor) => void;
	onToneSelected?: OnToneSelected;
	onToneSelectorCancelled?: OnToneSelectorCancelled;
	onUploadCancelled: () => void;
	onUploadEmoji: OnUploadEmoji;
	productivityColorPreviewEmojis?: Partial<Record<ProductivityColor, EmojiDescription>>;
	query?: string;
	resultsCount?: number;
	selectedProductivityColor?: ProductivityColor;
	selectedTone?: ToneSelection;
	toneEmoji?: EmojiDescriptionWithVariations;
	uploadEnabled: boolean;
	uploadErrorMessage?: Message;
	uploading: boolean;
}

export const emojiActionsTestId = 'emoji-actions';
export const uploadEmojiTestId = 'upload-emoji';

// Generic Type for the wrapped functional component
type PropsWithWrappedComponentPropsType = Props & WrappedComponentProps;

type AddOwnEmojiProps = PropsWithWrappedComponentPropsType;
export const AddOwnEmoji = (props: AddOwnEmojiProps): JSX.Element => {
	const { onOpenUpload, uploadEnabled } = props;
	const handleOpenUpload = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			if (fg('platform_emoji_keep_picker_open_on_upload')) {
				event.preventDefault();
				event.stopPropagation();
			}
			onOpenUpload();
		},
		[onOpenUpload],
	);

	return (
		<Fragment>
			{uploadEnabled && (
				<div css={addCustomEmoji} data-testid={uploadEmojiTestId}>
					<FormattedMessage {...messages.addCustomEmojiLabel}>
						{(label) => (
							<AkButton
								onClick={handleOpenUpload}
								iconBefore={
									<Box xcss={styles.icon}>
										<AddIcon color="currentColor" label="" />
									</Box>
								}
								appearance="subtle"
								// TODO: (from codemod) Buttons with "component", "css" or "style" prop can't be automatically migrated with codemods. Please migrate it manually.
								// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
								css={addCustomEmojiButton}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766
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
	onToneClose: () => void;
	onToneOpen: () => void;
	onToneSelected: (toneValue: ToneValueType) => void;
	onToneToggle: () => void;
	showToneSelector: boolean;
};
const TonesWrapper = (props: TonesWrapperProps) => {
	const {
		activeCategoryId,
		activeAtlassianSubcategory,
		onProductivityColorSelected,
		productivityColorPreviewEmojis,
		selectedProductivityColor,
		toneEmoji,
		selectedTone = DEFAULT_TONE,
		intl,
		onToneClose,
		onToneOpen,
		onToneToggle,
		showToneSelector,
	} = props;
	const { formatMessage } = intl;
	const tonePreviewButtonRef = useRef<HTMLButtonElement>(null);
	const openProductivityColorSelectorWithKeyboard = useRef(false);
	const [focusTonePreviewButton, setFocusTonePreviewButton] = useState(false);
	const [focusSelectedProductivityColorOnMount, setFocusSelectedProductivityColorOnMount] =
		useState(false);

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

	const onProductivityColorSelectedHandler = useCallback(
		(color: ProductivityColor) => {
			onProductivityColorSelected?.(color);
			onToneClose();
			setFocusSelectedProductivityColorOnMount(false);
		},
		[onProductivityColorSelected, onToneClose],
	);

	const onProductivityColorToggle = useCallback(
		(event?: MouseEvent<HTMLButtonElement>) => {
			const isKeyboardClick = event?.detail === 0;
			setFocusSelectedProductivityColorOnMount(
				!showToneSelector && (openProductivityColorSelectorWithKeyboard.current || isKeyboardClick),
			);
			openProductivityColorSelectorWithKeyboard.current = false;
			onToneToggle();
		},
		[onToneToggle, showToneSelector],
	);

	const onProductivityColorPreviewKeyDown = useCallback(
		(event: KeyboardEvent<HTMLButtonElement>) => {
			if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
				openProductivityColorSelectorWithKeyboard.current = true;
			}
		},
		[],
	);

	const shouldShowProductivityColorSelector = !!(
		activeCategoryId === 'ATLASSIAN' &&
		activeAtlassianSubcategory &&
		atlassianSubcategoriesWithProductivityColorSelector.includes(activeAtlassianSubcategory) &&
		productivityColorPreviewEmojis &&
		selectedProductivityColor &&
		onProductivityColorSelected &&
		isRefreshEmojiPickerEnabled()
	);

	if (shouldShowProductivityColorSelector) {
		const previewEmoji =
			productivityColorPreviewEmojis?.[selectedProductivityColor] ||
			Object.values(productivityColorPreviewEmojis || {})[0];

		if (!previewEmoji) {
			return null;
		}

		return (
			<div css={emojiToneSelectorContainer}>
				{showToneSelector && tonePreviewButtonRef.current && (
					<Popup
						target={tonePreviewButtonRef.current}
						relativePosition="below"
						horizontalAlign="end-to-start"
						offsetY={4}
						zIndex={layers.tooltip()}
					>
						<ProductivityColorPopupContent
							colorPreviewEmojis={productivityColorPreviewEmojis}
							focusSelectedColorOnMount={focusSelectedProductivityColorOnMount}
							selectedColor={selectedProductivityColor}
							onColorSelected={onProductivityColorSelectedHandler}
						/>
					</Popup>
				)}
				<TonePreviewButton
					ref={tonePreviewButtonRef}
					ariaControls={productivityColorSelectorId}
					ariaExpanded={showToneSelector}
					emoji={previewEmoji}
					selectOnHover
					onKeyDown={onProductivityColorPreviewKeyDown}
					onSelected={onProductivityColorToggle}
					ariaLabelText={formatMessage(messages.emojiSelectColorButtonAriaLabelText)}
				/>
			</div>
		);
	}

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
// TODO: remove this on cleanup of platform_teamoji_26_refresh_emoji_picker
export const EmojiActions = (props: EmojiActionsProps): JSX.Element => {
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
	const wasProductivityColorSelectorOpen = useRef(false);

	const shouldUseProductivityColorControl = !!(
		props.activeCategoryId === 'ATLASSIAN' &&
		props.activeAtlassianSubcategory &&
		atlassianSubcategoriesWithProductivityColorSelector.includes(
			props.activeAtlassianSubcategory,
		) &&
		props.productivityColorPreviewEmojis &&
		props.selectedProductivityColor &&
		props.onProductivityColorSelected &&
		isRefreshEmojiPickerEnabled()
	);

	const onToneOpenHandler = useCallback(() => setShowToneSelector(true), []);

	const onToneCloseHandler = useCallback(() => setShowToneSelector(false), []);

	const onToneToggleHandler = useCallback(() => {
		setShowToneSelector((isOpen) => !isOpen);
	}, []);

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
		if (shouldUseProductivityColorControl) {
			return;
		}
		if (showToneSelector && onToneSelectorCancelled) {
			onToneSelectorCancelled();
		}
		setShowToneSelector(false);
	}, [shouldUseProductivityColorControl, showToneSelector, onToneSelectorCancelled]);

	useEffect(() => {
		if (shouldUseProductivityColorControl && showToneSelector) {
			wasProductivityColorSelectorOpen.current = true;
			return;
		}

		if (!shouldUseProductivityColorControl && wasProductivityColorSelectorOpen.current) {
			setShowToneSelector(false);
			wasProductivityColorSelectorOpen.current = false;
		}
	}, [shouldUseProductivityColorControl, showToneSelector]);

	if (uploading) {
		return isRefreshEmojiPickerEnabled() ? (
			<div css={previewFooterNew}>
				<EmojiUploadPicker
					onUploadCancelled={onUploadCancelled}
					onUploadEmoji={onUploadEmoji}
					onFileChooserClicked={onFileChooserClicked}
					errorMessage={uploadErrorMessage}
					initialUploadName={initialUploadName}
				/>
			</div>
		) : (
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
		return isRefreshEmojiPickerEnabled() ? (
			<div css={previewFooterNew}>
				<EmojiDeletePreview
					emoji={emojiToDelete}
					onDeleteEmoji={onDeleteEmoji}
					onCloseDelete={onCloseDelete}
				/>
			</div>
		) : (
			<div css={previewFooter}>
				<EmojiDeletePreview
					emoji={emojiToDelete}
					onDeleteEmoji={onDeleteEmoji}
					onCloseDelete={onCloseDelete}
				/>
			</div>
		);
	}

	return isRefreshEmojiPickerEnabled() ? (
		<div
			data-testid={emojiActionsTestId}
			css={previewFooterNew}
			onMouseLeave={onMouseLeaveHandler}
			onBlur={fg('platform_suppression_removal_fix_reactions') ? onMouseLeaveHandler : undefined}
		>
			<div css={emojiActionsWrapper}>
				<EmojiPickerListSearch
					onChange={onChange}
					query={query}
					resultsCount={resultsCount}
					isVisible={!showToneSelector || shouldUseProductivityColorControl}
				/>
				<TonesWrapper
					{...props}
					onToneOpen={onToneOpenHandler}
					onToneClose={onToneCloseHandler}
					onToneSelected={onToneSelectedHandler}
					onToneToggle={onToneToggleHandler}
					showToneSelector={showToneSelector}
				/>
			</div>
		</div>
	) : (
		<div
			data-testid={emojiActionsTestId}
			css={previewFooter}
			onMouseLeave={onMouseLeaveHandler}
			onBlur={fg('platform_suppression_removal_fix_reactions') ? onMouseLeaveHandler : undefined}
		>
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
					onToneToggle={onToneToggleHandler}
					showToneSelector={showToneSelector}
				/>
			</div>
			<AddOwnEmoji {...props} />
		</div>
	);
};

// eslint-disable-next-line @typescript-eslint/ban-types
const _default_1: FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: ComponentType<Props & WrappedComponentProps>;
} = injectIntl(memo(EmojiActions));
export default _default_1;
