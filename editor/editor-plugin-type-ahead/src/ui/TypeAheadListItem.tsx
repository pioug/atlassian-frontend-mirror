/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useLayoutEffect, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { IconFallback } from '@atlaskit/editor-common/quick-insert';
import { SelectItemMode, typeAheadListMessages } from '@atlaskit/editor-common/type-ahead';
import {
	type ExtractInjectionAPI,
	type TypeAheadItem,
	type TypeAheadItemRenderProps,
} from '@atlaskit/editor-common/types';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import { ButtonItem } from '@atlaskit/menu';
import { fg } from '@atlaskit/platform-feature-flags';
import { B400, N30, N800 } from '@atlaskit/theme/colors';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { type TypeAheadPlugin } from '../typeAheadPluginType';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const itemIcon: SerializedStyles = css({
	width: token('space.500', '40px'),
	height: token('space.500', '40px'),
	overflow: 'hidden',
	border: `${token('border.width')} solid ${token('color.border', 'rgba(223, 225, 229, 0.5)')}` /* N60 at 50% */,
	borderRadius: token('radius.small', '3px'),
	boxSizing: 'border-box',

	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	div: {
		width: token('space.500', '40px'),
		height: token('space.500', '40px'),
	},
});

const itemIconSizeUpdated = css({
	width: token('space.400', '32px'),
	height: token('space.400', '32px'),

	// AI icons may contain div as container of the icon
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	div: {
		width: token('space.400', '32px'),
		height: token('space.400', '32px'),
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const itemBody = css`
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-between;
`;

const itemText = css({
	whiteSpace: 'initial',
	color: `${token('color.text', N800)}`,
});
const itemTitle = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '1.4',
});
const itemTitleOverride = css({
	font: token('font.body'),
});

const itemDescription = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/use-tokens-typography
	fontSize: `${relativeFontSizeToBase16(12)};`,
	color: `${token('color.text.subtle')};`,
	marginTop: `${token('space.050', '4px')};`,
});
const itemDescriptionOverride = css({
	font: token('font.body.small'),
	marginTop: 0,
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const itemAfter = css`
	flex: 0 0 auto;
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
const customRenderItemDivStyle = css`
	overflow: hidden;
	&:focus {
		box-shadow: inset 2px 0px 0px ${token('color.border.focused', B400)};
		background-color: ${token('color.background.neutral.subtle.hovered', N30)};
		outline: none;
	}
`;

/**
 * This CSS emulates the desired behaviour with :focus-visible for firefox.
 * Firefox unfortunately does not register keyboard focus if user mouseDown and drag a typeahead item
 * resulting in focus-visible style not drawn.
 */
const selectionFrame = {
	'& > button:focus': {
		boxShadow: `inset 2px 0px 0px ${token('color.border.focused', B400)};`,
		backgroundColor: `${token('color.background.neutral.subtle.hovered', N30)}`,
		outline: 'none',
		'&:active': {
			boxShadow: 'none',
		},
	},
	'& > button:hover': {
		backgroundColor: 'inherit',
		outline: 'none',
	},
};

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
const selectedStyle = css`
	background-color: ${token('color.background.neutral.subtle.hovered', N30)};
	box-shadow: inset 2px 0px 0px ${token('color.border.focused', B400)};
`;

const disabledStyle = css({
	color: token('color.text.disabled'),
});

const titleWithLozengeStyle = css({
	display: 'flex',
	alignItems: 'center',
	gap: `${token('space.050', '4px')}`,
});

const FallbackIcon = React.memo(() => {
	return <IconFallback />;
});

const noop = () => {};

type TypeAheadListItemProps = {
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
	ariaLabel?: string;
	firstOnlineSupportedIndex: number;
	item: TypeAheadItem;
	itemIndex: number;
	itemsLength: number;
	moreElementsInQuickInsertViewEnabled?: boolean;
	onItemClick: (mode: SelectItemMode, index: number) => void;
	selectedIndex: number;
};

type CustomItemComponentWrapperProps = {
	ariaLabel: string | undefined;
	customItemRef: React.RefObject<HTMLDivElement>;
	customRenderItem: (
		props: TypeAheadItemRenderProps,
	) => React.ReactElement<TypeAheadItemRenderProps> | null;
	insertSelectedItem: () => void;
	isSelected: boolean;
	itemIndex: number;
	itemIsDisabled: boolean;
	itemsLength: number;
};

const CustomItemComponentWrapper = React.memo((props: CustomItemComponentWrapperProps) => {
	const {
		customRenderItem,
		isSelected,
		itemIsDisabled,
		ariaLabel,
		itemsLength,
		customItemRef,
		insertSelectedItem,
		itemIndex,
	} = props;

	const Comp = customRenderItem;
	const listItemClasses = useMemo(() => {
		return [
			customRenderItemDivStyle,
			isSelected && !itemIsDisabled && selectedStyle,
			itemIsDisabled && disabledStyle,
		];
	}, [isSelected, itemIsDisabled]);

	return (
		<div
			aria-selected={isSelected}
			role="option"
			aria-label={ariaLabel}
			aria-setsize={itemsLength}
			aria-posinset={itemIndex + 1}
			tabIndex={0}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={listItemClasses}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={`ak-typeahead-item ${isSelected ? 'typeahead-selected-item' : ''}`}
			//CSS classes added for test cases purpose
			ref={customItemRef}
		>
			<div aria-hidden={true}>
				<Comp
					onClick={insertSelectedItem}
					isSelected={false} //The selection styles are handled in the parent div instead. Hence isSelected is made false always.
					onHover={noop}
				/>
			</div>
		</div>
	);
});

export const TypeAheadListItem = React.memo(
	({
		item,
		itemsLength,
		selectedIndex,
		onItemClick,
		itemIndex,
		ariaLabel,
		moreElementsInQuickInsertViewEnabled,
		api,
		firstOnlineSupportedIndex,
	}: TypeAheadListItemProps) => {
		const { connectivityMode } = useSharedPluginStateWithSelector(
			api,
			['connectivity'],
			(states) => {
				return {
					connectivityMode: states.connectivityState?.mode,
				};
			},
		);
		const isItemDisabled = (item: TypeAheadItem | undefined) =>
			isOfflineMode(connectivityMode) && (item?.isDisabledOffline ?? false);
		const itemIsDisabled = isItemDisabled(item);
		const isFirstEnabledIndex =
			isOfflineMode(connectivityMode) &&
			itemIndex === firstOnlineSupportedIndex &&
			selectedIndex === -1;

		/**
		 * To select and highlight the first Item when no item is selected
		 * However selectedIndex remains -1, So that user does not skip the first item when down arrow key is used from typeahead query(inputQuery.tsx)
		 */
		let isSelected = false;
		// Feature gated - connectivity is only available on desktop and behind a feature gate on full page mode
		if (connectivityMode === undefined) {
			isSelected = itemIndex === selectedIndex || (selectedIndex === -1 && itemIndex === 0);
		} else {
			isSelected =
				itemIndex === selectedIndex ||
				(selectedIndex === -1 && (itemIndex === 0 || isFirstEnabledIndex) && !itemIsDisabled);
		}

		// Assistive text
		const intl = useIntl();
		const descriptionText = item.description ? `${item.description}.` : '';
		const shortcutText = item.keyshortcut
			? ` ${intl.formatMessage(typeAheadListMessages.shortcutLabel)} ${item.keyshortcut}.`
			: '';
		const descriptionId = `typeahead-item-description-${itemIndex}`;

		const { icon, title, render: customRenderItem } = item;
		const elementIcon = useMemo(() => {
			return (
				<div css={[itemIcon, moreElementsInQuickInsertViewEnabled && itemIconSizeUpdated]}>
					{icon ? icon() : <FallbackIcon />}
				</div>
			);
		}, [icon, moreElementsInQuickInsertViewEnabled]);

		const insertSelectedItem = useCallback(() => {
			if (itemIsDisabled) {
				return;
			}
			onItemClick(SelectItemMode.SELECTED, itemIndex);
		}, [onItemClick, itemIndex, itemIsDisabled]);

		const customItemRef = React.useRef<HTMLDivElement>(null);
		const buttonItemRef = React.useRef<HTMLDivElement>(null);
		const shouldUpdateFocus = selectedIndex === itemIndex && !isFirstEnabledIndex;
		const listItemClasses = useMemo(() => {
			return [selectionFrame, isSelected && !itemIsDisabled && selectedStyle];
		}, [isSelected, itemIsDisabled]);

		useLayoutEffect(() => {
			if (shouldUpdateFocus) {
				customItemRef?.current?.focus();
			}
		}, [customItemRef, shouldUpdateFocus]);

		useLayoutEffect(() => {
			if (shouldUpdateFocus) {
				buttonItemRef?.current?.focus();
			}
		}, [buttonItemRef, shouldUpdateFocus]);

		if (customRenderItem) {
			return (
				<CustomItemComponentWrapper
					itemIsDisabled={itemIsDisabled}
					customRenderItem={customRenderItem}
					isSelected={isSelected}
					ariaLabel={ariaLabel}
					itemsLength={itemsLength}
					customItemRef={customItemRef}
					insertSelectedItem={insertSelectedItem}
					itemIndex={itemIndex}
				/>
			);
		}

		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			<span css={listItemClasses}>
				{(descriptionText || shortcutText) && (
					<VisuallyHidden id={descriptionId}>
						{descriptionText} {shortcutText}
					</VisuallyHidden>
				)}
				<ButtonItem
					onClick={insertSelectedItem}
					iconBefore={elementIcon}
					isSelected={isSelected}
					aria-selected={isSelected}
					aria-label={title}
					aria-describedby={descriptionText || shortcutText ? descriptionId : undefined}
					aria-setsize={itemsLength}
					aria-posinset={itemIndex + 1}
					role="option"
					ref={buttonItemRef}
					isDisabled={itemIsDisabled}
					testId={editorExperiment('platform_synced_block', true) && fg('platform_synced_block_dogfooding') ? item.testId : undefined}
					// @ts-ignore
					css={listItemClasses}
				>
					<div aria-hidden={true}>
						<div css={[itemText]}>
							<div css={itemBody}>
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
								<div
									css={[
										itemTitle,
										moreElementsInQuickInsertViewEnabled && itemTitleOverride,
										itemIsDisabled && disabledStyle,
										item.lozenge &&
											editorExperiment('platform_synced_block', true) &&
											titleWithLozengeStyle,
									]}
								>
									{item.title}
									{editorExperiment('platform_synced_block', true) && item.lozenge}
								</div>
								<div css={itemAfter}>
									{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
									{item.keyshortcut && <div css={shortcutStyle}>{item.keyshortcut}</div>}
								</div>
							</div>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
							<div
								css={[
									itemDescription,
									moreElementsInQuickInsertViewEnabled && itemDescriptionOverride,
									itemIsDisabled && disabledStyle,
								]}
							>
								{item.description}
							</div>
						</div>
					</div>
				</ButtonItem>
			</span>
		);
	},
);
