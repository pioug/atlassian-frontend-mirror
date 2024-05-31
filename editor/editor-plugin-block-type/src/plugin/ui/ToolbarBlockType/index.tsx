/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import {
	findKeymapByDescription,
	getAriaKeyshortcuts,
	tooltip,
} from '@atlaskit/editor-common/keymaps';
import { separatorStyles, wrapperStyle } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import { DropdownMenuWithKeyboardNavigation as DropdownMenu } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';

import type { TextBlockTypes } from '../../block-types';
import type { BlockTypePlugin } from '../../index';
import type { BlockTypeState } from '../../pm-plugins/main';
import type { BlockType } from '../../types';

import { BlockTypeButton } from './blocktype-button';
import { blockTypeMenuItemStyle, keyboardShortcut, keyboardShortcutSelect } from './styled';

export type DropdownItem = MenuItem & {
	value: BlockType;
};

export interface Props {
	isDisabled?: boolean;
	isSmall?: boolean;
	isReducedSpacing?: boolean;
	pluginState: BlockTypeState;
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	editorView?: EditorView;
	setTextLevel: (type: TextBlockTypes) => void;
	shouldUseDefaultRole?: boolean;
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
}

export interface State {
	active: boolean;
	isOpenedByKeyboard: boolean;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
class ToolbarBlockType extends React.PureComponent<Props & WrappedComponentProps, State> {
	state = {
		active: false,
		isOpenedByKeyboard: false,
	};

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
			pluginState: { currentBlockType, blockTypesDisabled, availableBlockTypes },
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

		const blockTypeTitles = availableBlockTypes
			.filter((blockType) => blockType.name === currentBlockType.name)
			.map((blockType) => blockType.title);

		if (!this.props.isDisabled && !blockTypesDisabled) {
			const items = this.createItems();
			return (
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
				<span css={wrapperStyle}>
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
						shouldUseDefaultRole={shouldUseDefaultRole}
						shouldFocusFirstItem={() => {
							if (isOpenedByKeyboard) {
								// eslint-disable-next-line @repo/internal/react/no-set-state-inside-render
								this.setState({ ...this.state, isOpenedByKeyboard: false });
							}
							return isOpenedByKeyboard;
						}}
					>
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
							blockTypeName={currentBlockType.name}
						/>
					</DropdownMenu>
					{!api?.primaryToolbar && (
						<span
							// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
							css={separatorStyles}
						/>
					)}
				</span>
			);
		}

		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
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
					blockTypeName={currentBlockType.name}
				/>
				<span
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
					css={separatorStyles}
				/>
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
		} = this.props;
		const { currentBlockType, availableBlockTypes } = this.props.pluginState;

		const items: MenuItem[] = availableBlockTypes.map((blockType, index) => {
			const isActive = currentBlockType === blockType;
			const tagName = blockType.tagName || 'p';
			const Tag = tagName as keyof React.ReactHTML;
			const keyMap = findKeymapByDescription(blockType.title.defaultMessage as string);

			return {
				content: (
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
					<div css={blockTypeMenuItemStyle(tagName, isActive)}>
						<Tag>{formatMessage(blockType.title)}</Tag>
					</div>
				),
				value: blockType,
				label: formatMessage(blockType.title),
				'aria-label': tooltip(keyMap, formatMessage(blockType.title)),
				keyShortcuts: getAriaKeyshortcuts(keyMap),
				key: `${blockType.name}-${index}`,
				elemAfter: (
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
					<div css={[keyboardShortcut, isActive && keyboardShortcutSelect]}>{tooltip(keyMap)}</div>
				),
				isActive,
			};
		});
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
		this.props.setTextLevel(blockType.name as TextBlockTypes);
		if (shouldCloseMenu) {
			this.setState({ ...this.state, active: false });
		}
	};
}

export default injectIntl(ToolbarBlockType);
