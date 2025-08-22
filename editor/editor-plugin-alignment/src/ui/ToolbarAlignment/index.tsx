/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { jsx } from '@atlaskit/css';
import { alignCenter, alignLeft, alignRight, tooltip } from '@atlaskit/editor-common/keymaps';
import { alignmentMessages as messages } from '@atlaskit/editor-common/messages';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { OpenChangedEvent } from '@atlaskit/editor-common/ui';
import {
	Shortcut,
	ToolbarDropdownTriggerWrapper,
	ToolbarDropdownWrapper,
	ToolbarExpandIcon,
	ToolbarSeparator,
} from '@atlaskit/editor-common/ui';
import {
	ArrowKeyNavigationType,
	DropdownContainer as Dropdown,
	DropdownMenuWithKeyboardNavigation as DropdownMenu,
	ToolbarButton,
	type MenuItem,
} from '@atlaskit/editor-common/ui-menu';
import AlignTextCenterIcon from '@atlaskit/icon/core/align-text-center';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AlignTextRightIcon from '@atlaskit/icon/core/align-text-right';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { AlignmentPlugin } from '../../alignmentPluginType';
import { ToolbarType, type AlignmentState } from '../../pm-plugins/types';
import Alignment from '../Alignment';

import { IconMap } from './icon-map';

export interface State {
	isOpen: boolean;
}

export interface Props {
	align: AlignmentState | undefined;
	api: ExtractInjectionAPI<AlignmentPlugin> | undefined;
	changeAlignment: (align: AlignmentState) => void;
	disabled?: boolean;
	isReducedSpacing?: boolean;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	toolbarType: ToolbarType;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export class AlignmentToolbar extends React.Component<Props & WrappedComponentProps, State> {
	static displayName = 'AlignmentToolbar';
	private toolbarItemRef = React.createRef<HTMLElement>();

	state: State = {
		isOpen: false,
	};

	render() {
		const { isOpen } = this.state;
		const {
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
			isReducedSpacing,
			align,
			disabled,
			intl,
			api,
		} = this.props;
		const alignment = align ?? 'start';

		const title = intl.formatMessage(messages.alignment);

		const reducedSpacing = editorExperiment('platform_editor_controls', 'variant1', {
			exposure: true,
		})
			? 'compact'
			: 'none';

		const items = [
			{
				key: 'alignmentLeft',
				content: intl.formatMessage(messages.alignLeft),
				value: { name: 'start' },
				isActive: align === 'start',
				elemAfter: <Shortcut>{tooltip(alignLeft)}</Shortcut>,
				elemBefore: <AlignTextLeftIcon label="" />,
			},
			{
				key: 'alignmentCenter',
				content: intl.formatMessage(messages.alignCenter),
				value: { name: 'center' },
				isActive: align === 'center',
				elemAfter: <Shortcut>{tooltip(alignCenter)}</Shortcut>,
				elemBefore: <AlignTextCenterIcon label="" />,
			},
			{
				key: 'alignmentRight',
				content: intl.formatMessage(messages.alignRight),
				value: { name: 'end' },
				isActive: align === 'end',
				elemAfter: <Shortcut>{tooltip(alignRight)}</Shortcut>,
				elemBefore: <AlignTextRightIcon label="" />,
			},
		];

		return (
			<ToolbarDropdownWrapper>
				{editorExperiment('platform_editor_controls', 'variant1') ? (
					<DropdownMenu
						arrowKeyNavigationProviderOptions={{
							type: ArrowKeyNavigationType.MENU,
						}}
						items={[{ items }]}
						isOpen={isOpen}
						onItemActivated={this.handleOnItemActivated}
						onOpenChange={(attrs: OpenChangedEvent) => this.setState({ isOpen: attrs?.isOpen })}
						mountTo={popupsMountPoint}
						boundariesElement={popupsBoundariesElement}
						scrollableElement={popupsScrollableElement}
						fitWidth={200}
					>
						<ToolbarButton
							spacing={isReducedSpacing ? reducedSpacing : 'default'}
							disabled={disabled}
							selected={isOpen}
							title={title}
							aria-label={title}
							aria-expanded={isOpen}
							aria-haspopup
							onClick={this.toggleOpen}
							onKeyDown={this.toggleOpenByKeyboard}
							iconBefore={
								<ToolbarDropdownTriggerWrapper>
									<IconMap alignment={alignment} />
									<ToolbarExpandIcon />
								</ToolbarDropdownTriggerWrapper>
							}
						/>
					</DropdownMenu>
				) : (
					<Dropdown
						mountTo={popupsMountPoint}
						boundariesElement={popupsBoundariesElement}
						scrollableElement={popupsScrollableElement}
						isOpen={isOpen}
						handleClickOutside={(event: MouseEvent) => {
							if (event instanceof MouseEvent) {
								this.hide({ isOpen: false, event });
							}
						}}
						handleEscapeKeydown={this.hideOnEscape}
						arrowKeyNavigationProviderOptions={{
							type: ArrowKeyNavigationType.MENU,
						}}
						fitWidth={112}
						fitHeight={80}
						closeOnTab={true}
						trigger={
							<ToolbarButton
								spacing={isReducedSpacing ? reducedSpacing : 'default'}
								disabled={disabled}
								selected={isOpen}
								title={title}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766
								className="align-btn"
								aria-label={title}
								aria-expanded={isOpen}
								aria-haspopup
								onClick={this.toggleOpen}
								onKeyDown={this.toggleOpenByKeyboard}
								iconBefore={
									<ToolbarDropdownTriggerWrapper>
										<IconMap alignment={alignment} />
										<ToolbarExpandIcon />
									</ToolbarDropdownTriggerWrapper>
								}
								ref={this.toolbarItemRef}
							/>
						}
					>
						<Alignment
							onClick={(align) => this.changeAlignment(align, false)}
							selectedAlignment={alignment}
						/>
					</Dropdown>
				)}
				{!api?.primaryToolbar && <ToolbarSeparator />}
			</ToolbarDropdownWrapper>
		);
	}

	componentDidUpdate(prevProps: Props) {
		if (this.props.toolbarType !== ToolbarType.FLOATING && this.state.isOpen) {
			// by triggering the keyboard event with a setTimeout, we ensure that the tooltip
			// associated with the alignment button doesn't render until the next render cycle
			// where the popup will be correctly positioned and the relative position of the tooltip
			// will not overlap with the button.
			setTimeout(() => {
				const keyboardEvent = new KeyboardEvent('keydown', {
					bubbles: true,
					key: 'ArrowDown',
				});
				this.toolbarItemRef.current?.dispatchEvent(keyboardEvent);
			}, 0);
		}
	}

	private changeAlignment = (align: AlignmentState, togglePopup: boolean) => {
		if (togglePopup) {
			this.toggleOpen();
		}

		return this.props.changeAlignment(align);
	};

	private toggleOpen = () => {
		this.setState({ isOpen: !this.state.isOpen });
	};

	private toggleOpenByKeyboard = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			this.setState({ isOpen: !this.state.isOpen });
		}
	};

	private handleOnItemActivated = ({
		item,
		shouldCloseMenu = true,
	}: {
		item: MenuItem;
		shouldCloseMenu: boolean;
	}) => this.changeAlignment(item.value.name as AlignmentState, shouldCloseMenu);

	private hide = (attrs?: OpenChangedEvent) => {
		if (this.state.isOpen) {
			this.setState({ isOpen: false });
			if (attrs?.event instanceof KeyboardEvent && attrs.event.key === 'Escape') {
				this.toolbarItemRef?.current?.focus();
			}
		}
	};

	private hideOnEscape = () => {
		this.hide();
		this.toolbarItemRef?.current?.focus();
	};
}

export default injectIntl(AlignmentToolbar);
