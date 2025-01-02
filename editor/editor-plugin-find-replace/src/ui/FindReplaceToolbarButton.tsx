/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';
import {
	findKeymapByDescription,
	getAriaKeyshortcuts,
	tooltip,
	ToolTipContent,
} from '@atlaskit/editor-common/keymaps';
import { findReplaceMessages as messages } from '@atlaskit/editor-common/messages';
import {
	ArrowKeyNavigationType,
	Dropdown,
	TOOLBAR_BUTTON,
	ToolbarButton,
} from '@atlaskit/editor-common/ui-menu';
import {
	akEditorFloatingPanelZIndex,
	akEditorMobileMaxWidth,
} from '@atlaskit/editor-shared-styles';
import SearchIcon from '@atlaskit/icon/core/migration/search';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import type { FindReplaceProps } from './FindReplace';
import FindReplace from './FindReplace';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
const toolbarButtonWrapper = css`
	display: flex;
	flex: 1 1 auto;
	flex-grow: 0;
	justify-content: flex-end;
	align-items: center;
	padding: 0 ${token('space.100', '8px')};
	@media (max-width: ${akEditorMobileMaxWidth}px) {
		justify-content: center;
		padding: 0;
	}
`;

const TriggerButtonWrapper = ({
	isButtonHidden,
	children,
}: {
	isButtonHidden: boolean;
	children: React.ReactNode;
}) => {
	return <div css={{ display: isButtonHidden ? 'none' : 'block' }}>{children}</div>;
};

const toolbarButtonWrapperFullWidth = css({
	flexGrow: 1,
});

const toolbarButtonWrapperHidden = css({
	flexGrow: 0,
	padding: 0,
});

const wrapper = css({
	display: 'flex',
	flexDirection: 'column',
});

const dropdownWidthNewDesign = 382;

export interface FindReplaceToolbarButtonProps extends Omit<FindReplaceProps, 'count'> {
	index: number;
	numMatches: number;
	isActive: boolean;
	onActivate: () => void;
	isReducedSpacing?: boolean;
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	takeFullWidth: boolean;
	isButtonHidden?: boolean;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
class FindReplaceToolbarButton extends React.PureComponent<
	FindReplaceToolbarButtonProps & WrappedComponentProps
> {
	state = {
		openedByClick: false,
	};

	toggleOpen = () => {
		if (this.props.isActive) {
			this.props.onCancel({ triggerMethod: TRIGGER_METHOD.TOOLBAR });
		} else {
			this.setState({ openedByClick: true });
			this.props.onActivate();
		}
	};

	focusToolbarButton = () => {
		if (this.state.openedByClick && this.toolbarButtonRef.current) {
			this.toolbarButtonRef.current.focus();
		}
		this.setState({ openedByClick: false });
	};

	toolbarButtonRef = React.createRef<HTMLButtonElement>();

	render() {
		const {
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
			isReducedSpacing,
			findText,
			replaceText,
			isActive,
			index,
			numMatches,
			intl: { formatMessage },
			takeFullWidth,
			isButtonHidden = false,
		} = this.props;

		const title = formatMessage(messages.findReplaceToolbarButton);
		const stackBelowOtherEditorFloatingPanels = akEditorFloatingPanelZIndex - 1;

		const keymap = findKeymapByDescription('Find');
		return (
			<div
				css={[
					toolbarButtonWrapper,
					takeFullWidth && toolbarButtonWrapperFullWidth,
					isButtonHidden &&
						fg('platform_editor_toolbar_responsive_fixes') &&
						toolbarButtonWrapperHidden,
				]}
			>
				<Dropdown
					mountTo={popupsMountPoint}
					boundariesElement={popupsBoundariesElement}
					scrollableElement={popupsScrollableElement}
					isOpen={isActive}
					handleEscapeKeydown={() => {
						if (isActive) {
							this.props.onCancel({ triggerMethod: TRIGGER_METHOD.KEYBOARD });
							if (this.state.openedByClick && this.toolbarButtonRef.current) {
								this.toolbarButtonRef.current.focus();
							}
							this.setState({ openedByClick: false });
						}
					}}
					fitWidth={dropdownWidthNewDesign}
					zIndex={stackBelowOtherEditorFloatingPanels}
					arrowKeyNavigationProviderOptions={{
						type: ArrowKeyNavigationType.MENU,
						disableArrowKeyNavigation: true,
					}}
					trigger={
						fg('platform_editor_toolbar_responsive_fixes') ? (
							<TriggerButtonWrapper isButtonHidden={isButtonHidden}>
								<ToolbarButton
									buttonId={TOOLBAR_BUTTON.FIND_REPLACE}
									testId={`editor-toolbar__${TOOLBAR_BUTTON.FIND_REPLACE}`}
									spacing={isReducedSpacing ? 'none' : 'default'}
									selected={isActive}
									title={<ToolTipContent description={title} keymap={keymap} />}
									iconBefore={<SearchIcon label={title} spacing="spacious" />}
									onClick={this.toggleOpen}
									aria-expanded={isActive}
									aria-haspopup
									aria-label={keymap ? tooltip(keymap, title) : title}
									aria-keyshortcuts={getAriaKeyshortcuts(keymap)}
									ref={this.toolbarButtonRef}
								/>
							</TriggerButtonWrapper>
						) : (
							<ToolbarButton
								buttonId={TOOLBAR_BUTTON.FIND_REPLACE}
								testId={`editor-toolbar__${TOOLBAR_BUTTON.FIND_REPLACE}`}
								spacing={isReducedSpacing ? 'none' : 'default'}
								selected={isActive}
								title={<ToolTipContent description={title} keymap={keymap} />}
								iconBefore={<SearchIcon label={title} spacing="spacious" />}
								onClick={this.toggleOpen}
								aria-expanded={isActive}
								aria-haspopup
								aria-label={keymap ? tooltip(keymap, title) : title}
								aria-keyshortcuts={getAriaKeyshortcuts(keymap)}
								ref={this.toolbarButtonRef}
							/>
						)
					}
				>
					<div css={wrapper}>
						<FindReplace
							findText={findText}
							replaceText={replaceText}
							count={{ index, total: numMatches }}
							focusToolbarButton={this.focusToolbarButton}
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...this.props}
						/>
					</div>
				</Dropdown>
			</div>
		);
	}
}
export default injectIntl(FindReplaceToolbarButton);
