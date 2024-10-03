/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { alignmentMessages as messages } from '@atlaskit/editor-common/messages';
import {
	expandIconContainerStyle,
	separatorStyles,
	triggerWrapperStylesWithPadding,
} from '@atlaskit/editor-common/styles';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { OpenChangedEvent } from '@atlaskit/editor-common/ui';
import {
	ArrowKeyNavigationType,
	DropdownContainer as Dropdown,
	ToolbarButton,
} from '@atlaskit/editor-common/ui-menu';
import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags';

import type { AlignmentPlugin } from '../../plugin';
import type { AlignmentPluginState, AlignmentState } from '../../pm-plugins/types';
import Alignment from '../Alignment';

import { IconMap } from './icon-map';
import { triggerWrapper, wrapper } from './styles';

export interface State {
	isOpen: boolean;
}

export interface Props {
	pluginState: AlignmentPluginState | undefined;
	changeAlignment: (align: AlignmentState) => void;
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	isReducedSpacing?: boolean;
	disabled?: boolean;
	api: ExtractInjectionAPI<AlignmentPlugin> | undefined;
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
			pluginState,
			disabled,
			intl,
			api,
		} = this.props;
		const alignment = pluginState?.align ?? 'start';

		const title = intl.formatMessage(messages.alignment);

		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<span css={wrapper}>
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
					onOpenChange={this.onOpenChange}
					handleEscapeKeydown={this.hideOnEscape}
					arrowKeyNavigationProviderOptions={{
						type: ArrowKeyNavigationType.MENU,
					}}
					fitWidth={112}
					fitHeight={80}
					closeOnTab={true}
					trigger={
						<ToolbarButton
							spacing={isReducedSpacing ? 'none' : 'default'}
							disabled={disabled}
							selected={isOpen}
							title={title}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className="align-btn"
							aria-label={title}
							aria-expanded={isOpen}
							aria-haspopup
							onClick={this.toggleOpen}
							onKeyDown={this.toggleOpenByKeyboard}
							iconBefore={
								<div
									css={
										// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-registration
										fg('platform-visual-refresh-icons')
											? // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
												triggerWrapperStylesWithPadding
											: // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
												triggerWrapper
									}
								>
									<IconMap alignment={alignment} />
									{
										<span
											css={[
												// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-registration
												fg('platform-visual-refresh-icons') &&
													//eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
													expandIconContainerStyle,
											]}
										>
											<ChevronDownIcon label="" color="currentColor" LEGACY_margin="0 0 0 -8px" />
										</span>
									}
								</div>
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
				{!api?.primaryToolbar && (
					/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage */
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					<span css={separatorStyles} />
				)}
			</span>
		);
	}

	componentDidUpdate(prevProps: Props) {
		if (this.state.isOpen) {
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

	private onOpenChange = () => {
		this.setState({ isOpen: false });
	};
}

export default injectIntl(AlignmentToolbar);
