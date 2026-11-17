/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { jsx } from '@atlaskit/css';
import { alignmentMessages as messages } from '@atlaskit/editor-common/alignment';
import { AlignmentIconMap } from '@atlaskit/editor-common/alignment-icon-map';
import type { OpenChangedEvent } from '@atlaskit/editor-common/DropList';
import { alignCenter, alignLeft, alignRight, tooltip } from '@atlaskit/editor-common/keymaps';
import { Shortcut } from '@atlaskit/editor-common/Shortcut';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { ArrowKeyNavigationType } from '@atlaskit/editor-common/ui-menu/ArrowKeyNavigationProvider/types';
import { DropdownMenuWithKeyboardNavigation as DropdownMenu } from '@atlaskit/editor-common/ui-menu/DropdownMenu';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu/DropdownMenu/types';
import ToolbarButton from '@atlaskit/editor-common/ui-menu/ToolbarButton';
import { ToolbarDropdownTriggerWrapper } from '@atlaskit/editor-common/ui-toolbar/DropdownTriggerWrapper';
import { ToolbarDropdownWrapper } from '@atlaskit/editor-common/ui-toolbar/DropdownWrapper';
import { ToolbarExpandIcon } from '@atlaskit/editor-common/ui-toolbar/ExpandIcon';
import { ToolbarSeparator } from '@atlaskit/editor-common/ui-toolbar/Separator';
import AlignTextCenterIcon from '@atlaskit/icon/core/align-text-center';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AlignTextRightIcon from '@atlaskit/icon/core/align-text-right';

import type { AlignmentPlugin } from '../../alignmentPluginType';
import type { AlignmentState } from '../../pm-plugins/types';

interface State {
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
}

// eslint-disable-next-line @repo/internal/react/no-class-components
class AlignmentToolbar extends React.Component<Props & WrappedComponentProps, State> {
	static displayName = 'AlignmentToolbar';

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
		const alignmentLabelMap: Record<string, string> = {
			start: intl.formatMessage(messages.alignLeft),
			center: intl.formatMessage(messages.alignCenter),
			end: intl.formatMessage(messages.alignRight),
		};

		const ariaLabel = `${title}, ${alignmentLabelMap[alignment] ?? ''}`;

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
				<DropdownMenu
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
					arrowKeyNavigationProviderOptions={{
						type: ArrowKeyNavigationType.MENU,
					}}
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
					items={[{ items }]}
					isOpen={isOpen}
					onItemActivated={this.handleOnItemActivated}
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
					onOpenChange={(attrs: OpenChangedEvent) => this.setState({ isOpen: attrs?.isOpen })}
					mountTo={popupsMountPoint}
					boundariesElement={popupsBoundariesElement}
					scrollableElement={popupsScrollableElement}
					fitWidth={200}
				>
					<ToolbarButton
						spacing={isReducedSpacing ? 'compact' : 'default'}
						disabled={disabled}
						selected={isOpen}
						title={title}
						aria-label={ariaLabel}
						aria-expanded={isOpen}
						aria-haspopup
						onClick={this.toggleOpen}
						onKeyDown={this.toggleOpenByKeyboard}
						iconBefore={
							<ToolbarDropdownTriggerWrapper>
								<AlignmentIconMap alignment={alignment} />
								<ToolbarExpandIcon />
							</ToolbarDropdownTriggerWrapper>
						}
					/>
				</DropdownMenu>
				{!api?.primaryToolbar && <ToolbarSeparator />}
			</ToolbarDropdownWrapper>
		);
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
}

// eslint-disable-next-line @typescript-eslint/no-restricted-types
const _default_1: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(AlignmentToolbar);
export default _default_1;
