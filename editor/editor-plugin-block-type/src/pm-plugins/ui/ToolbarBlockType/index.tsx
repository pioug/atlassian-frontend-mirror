/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { clearFormatting, findKeymapByDescription, tooltip } from '@atlaskit/editor-common/keymaps';
import { toolbarMessages } from '@atlaskit/editor-common/messages';
import { separatorStyles, wrapperStyle } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import { DropdownMenuWithKeyboardNavigation as DropdownMenu } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import TextIcon from '@atlaskit/icon/core/text';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { ThemeMutationObserver, type ThemeState } from '@atlaskit/tokens';

import type { BlockTypePlugin } from '../../../blockTypePluginType';
import type { TextBlockTypes } from '../../block-types';
import { NORMAL_TEXT } from '../../block-types';
import type { BlockType } from '../../types';

import { BlockTypeButton } from './blocktype-button';
import {
	blockTypeMenuItemStyle,
	floatingToolbarWrapperStyle,
	keyboardShortcut,
	keyboardShortcutSelect,
} from './styled';

export type DropdownItem = MenuItem & {
	value: BlockType;
};

const buttonWrapperStyles = xcss({
	flexShrink: 0,
});

export interface Props {
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
	availableBlockTypes?: BlockType[];
	availableBlockTypesInDropdown?: BlockType[];
	blockTypesDisabled?: boolean;
	clearFormatting: () => void;
	currentBlockType?: BlockType;
	editorView?: EditorView;
	formattingIsPresent?: boolean;
	isDisabled?: boolean;
	isReducedSpacing?: boolean;
	isSmall?: boolean;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	setTextLevel: (type: TextBlockTypes, fromBlockQuote?: boolean) => void;
	shouldUseDefaultRole?: boolean;
	wrapBlockQuote: (type: TextBlockTypes) => void;
}

export interface State {
	active: boolean;
	isOpenedByKeyboard: boolean;
	observer: ThemeMutationObserver | null;
	typographyTheme?: ThemeState['typography'];
}

// eslint-disable-next-line @repo/internal/react/no-class-components
class ToolbarBlockType extends React.PureComponent<Props & WrappedComponentProps, State> {
	state = {
		active: false,
		isOpenedByKeyboard: false,
		typographyTheme: undefined,
		observer: null as ThemeMutationObserver | null,
	};

	componentDidMount() {
		const observer = new ThemeMutationObserver(({ typography }) => {
			if (typography !== this.state.typographyTheme) {
				this.setState({
					typographyTheme: typography,
				});
			}
		});

		this.setState({
			observer,
		});

		observer.observe();
	}

	componentWillUnmount() {
		this.state.observer?.disconnect();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private onOpenChange = (attrs: any) => {
		this.setState({
			...this.state,
			active: attrs.isOpen,
			isOpenedByKeyboard: attrs.isOpenedByKeyboard,
		});
	};

	render() {
		const { active, isOpenedByKeyboard } = this.state;
		const {
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
			isSmall,
			isReducedSpacing,
			currentBlockType,
			blockTypesDisabled,
			availableBlockTypes = [],
			availableBlockTypesInDropdown = [],
			shouldUseDefaultRole,
			intl: { formatMessage },
			api,
		} = this.props;

		const isHeadingDisabled = !availableBlockTypes.some(
			(blockType) => blockType.nodeName === 'heading',
		);

		if (isHeadingDisabled) {
			return null;
		}

		const blockTypeTitles = availableBlockTypesInDropdown
			.filter((blockType) => blockType.name === currentBlockType?.name)
			.map((blockType) => blockType.title);

		const defaultIcon = <TextIcon label="" />;
		const currentIcon = currentBlockType?.icon;

		if (!this.props.isDisabled && !blockTypesDisabled) {
			const items = this.createItems();

			const button = (
				<BlockTypeButton
					isSmall={isSmall}
					isReducedSpacing={isReducedSpacing}
					selected={active}
					disabled={false}
					title={blockTypeTitles[0]}
					onClick={this.handleTriggerClick}
					onKeyDown={this.handleTriggerByKeyboard}
					formatMessage={formatMessage}
					aria-expanded={active}
					blockTypeName={currentBlockType?.name}
					blockTypeIcon={currentIcon || defaultIcon}
				/>
			);

			return (
				<span
					css={
						editorExperiment('platform_editor_blockquote_in_text_formatting_menu', true)
							? // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								[wrapperStyle, floatingToolbarWrapperStyle]
							: // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								wrapperStyle
					}
				>
					<DropdownMenu
						items={items}
						onOpenChange={this.onOpenChange}
						onItemActivated={this.handleSelectBlockType}
						isOpen={active}
						mountTo={popupsMountPoint}
						boundariesElement={popupsBoundariesElement}
						scrollableElement={popupsScrollableElement}
						zIndex={akEditorMenuZIndex}
						fitHeight={360}
						fitWidth={106}
						section={{ hasSeparator: true }}
						shouldUseDefaultRole={shouldUseDefaultRole}
						// hasSeparator={true}
						shouldFocusFirstItem={() => {
							if (isOpenedByKeyboard) {
								// eslint-disable-next-line @repo/internal/react/no-set-state-inside-render
								this.setState({ ...this.state, isOpenedByKeyboard: false });
							}
							return isOpenedByKeyboard;
						}}
					>
						<Box xcss={buttonWrapperStyles}>{button}</Box>
					</DropdownMenu>
					{!api?.primaryToolbar && (
						<span
							// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
							css={separatorStyles}
						/>
					)}
				</span>
			);
		}

		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<span css={wrapperStyle}>
				<BlockTypeButton
					isSmall={isSmall}
					isReducedSpacing={isReducedSpacing}
					selected={active}
					disabled={true}
					title={blockTypeTitles[0]}
					onClick={this.handleTriggerClick}
					onKeyDown={this.handleTriggerByKeyboard}
					formatMessage={formatMessage}
					aria-expanded={active}
					blockTypeName={currentBlockType?.name}
					blockTypeIcon={currentIcon || defaultIcon}
				/>

				{!api?.primaryToolbar && (
					<span
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						css={separatorStyles}
					/>
				)}
			</span>
		);
	}

	private handleTriggerClick = () => {
		this.onOpenChange({
			isOpen: !this.state.active,
			isOpenedByKeyboard: false,
		});
	};

	private handleTriggerByKeyboard = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			this.onOpenChange({
				isOpen: !this.state.active,
				isOpenedByKeyboard: true,
			});
		}
	};

	private createItems = () => {
		const {
			intl: { formatMessage },
			currentBlockType,
			availableBlockTypesInDropdown,
			formattingIsPresent,
		} = this.props;

		const items: MenuItem[] = (availableBlockTypesInDropdown ?? []).map((blockType, index) => {
			const isActive = currentBlockType === blockType;
			const tagName = blockType.tagName || 'p';
			const Tag = tagName as keyof React.ReactHTML;

			const defaultMessage = Array.isArray(blockType.title.defaultMessage)
				? blockType.title.defaultMessage.find((message) => 'value' in message)
				: blockType.title.defaultMessage;

			const description =
				typeof defaultMessage === 'string'
					? defaultMessage
					: defaultMessage && 'value' in defaultMessage
						? defaultMessage.value
						: '';

			const keyMap = findKeymapByDescription(description);
			const icon = blockType?.icon;
			const item: MenuItem = {
				content: (
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					<div css={blockTypeMenuItemStyle(tagName, isActive, this.state.typographyTheme)}>
						<Tag>{formatMessage(blockType.title)}</Tag>
					</div>
				),
				value: blockType,
				'aria-label': tooltip(keyMap, formatMessage(blockType.title)),
				key: `${blockType.name}-${index}`,
				elemBefore: editorExperiment('platform_editor_controls', 'variant1') ? icon : undefined,
				elemAfter: (
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					<div css={[keyboardShortcut, isActive && keyboardShortcutSelect]}>{tooltip(keyMap)}</div>
				),
				isActive,
			};

			return item;
		});

		if (
			(availableBlockTypesInDropdown ?? [])
				.map((blockType) => blockType.name)
				.includes('blockquote') &&
			editorExperiment('platform_editor_controls', 'control')
		) {
			const clearFormattingItem: MenuItem = {
				content: (
					<div>
						{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
						<p>{toolbarMessages.clearFormatting.defaultMessage}</p>
					</div>
				),
				value: {
					name: 'clearFormatting',
				},
				'aria-label': tooltip(clearFormatting, toolbarMessages.clearFormatting.defaultMessage),
				key: 'clear-formatting',
				elemAfter: (
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					<div css={[keyboardShortcut]}>{tooltip(clearFormatting)}</div>
				),
				isActive: false,
				isDisabled: currentBlockType === NORMAL_TEXT && !formattingIsPresent,
			};
			return [
				{
					items,
				},
				{
					items: [clearFormattingItem],
				},
			];
		}

		return [
			{
				items,
			},
		];
	};

	private handleSelectBlockType = ({
		item,
		shouldCloseMenu = true,
	}: {
		item: DropdownItem;
		shouldCloseMenu: boolean;
	}) => {
		const blockType = item.value;
		if (blockType.name === 'blockquote') {
			this.props.wrapBlockQuote(blockType.name as TextBlockTypes);
		} else {
			if (blockType.name === 'clearFormatting') {
				this.props.clearFormatting();
			} else {
				const fromBlockQuote = this.props.currentBlockType?.name === 'blockquote';
				this.props.setTextLevel(blockType.name as TextBlockTypes, fromBlockQuote);
			}
		}
		if (shouldCloseMenu) {
			this.setState({ ...this.state, active: false });
		}
	};
}

export default injectIntl(ToolbarBlockType);
