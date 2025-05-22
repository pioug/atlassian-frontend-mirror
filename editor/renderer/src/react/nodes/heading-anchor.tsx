/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { Ref } from 'react';
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import LinkIcon from '@atlaskit/icon/core/migration/link';
import Tooltip from '@atlaskit/tooltip';
import { token } from '@atlaskit/tokens';

import { headingAnchorLinkMessages } from '../../messages';
import type { MessageDescriptor } from '../../types/i18n';

export const HeadingAnchorWrapperClassName = 'heading-anchor-wrapper';

const CopyAnchorWrapperWithRef = React.forwardRef(
	(props: React.PropsWithChildren<unknown>, ref: Ref<HTMLElement>) => {
		const { children, ...rest } = props;
		return (
			<span
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...rest}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={HeadingAnchorWrapperClassName}
				ref={ref}
			>
				{children}
			</span>
		);
	},
);

const copyAnchorButtonStyles = css({
	display: 'inline',
	outline: 'none',
	backgroundColor: 'transparent',
	border: 'none',
	color: token('color.icon'),
	cursor: 'pointer',
	right: 0,
});

type Props = {
	onCopyText: () => Promise<void>;
	enableNestedHeaderLinks?: boolean;
	level: number;
	hideFromScreenReader?: boolean;
	headingId?: string;
};

type HeadingAnchorProps = Props & React.PropsWithChildren<unknown> & WrappedComponentProps;
type HeadingAnchorState = { tooltipMessage?: string; isClicked: boolean };

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class HeadingAnchor extends React.PureComponent<HeadingAnchorProps, HeadingAnchorState> {
	state = { tooltipMessage: '', isClicked: false };

	componentDidMount() {
		this.resetMessage();
	}

	private setTooltipState = (message: MessageDescriptor, isClicked: boolean = false) => {
		this.setState({
			// TODO: ED-14403 - investigate why this does not translate
			tooltipMessage: this.props.intl.formatMessage(message),
			isClicked,
		});
	};

	private getCopyAriaLabel = () => {
		const { copyAriaLabel } = headingAnchorLinkMessages;
		return this.props.intl.formatMessage(copyAriaLabel);
	};

	copyToClipboard = async (event: React.SyntheticEvent<HTMLElement>) => {
		const { copiedHeadingLinkToClipboard, failedToCopyHeadingLink } = headingAnchorLinkMessages;
		event.stopPropagation();
		try {
			await this.props.onCopyText();
			this.setTooltipState(copiedHeadingLinkToClipboard, true);
		} catch (e) {
			this.setTooltipState(failedToCopyHeadingLink);
		}
	};

	resetMessage = () => {
		this.setTooltipState(headingAnchorLinkMessages.copyHeadingLinkToClipboard);
	};

	renderAnchorButton = () => {
		const { hideFromScreenReader = false, headingId } = this.props;
		return (
			<button
				data-testid="anchor-button"
				css={copyAnchorButtonStyles}
				onMouseLeave={this.resetMessage}
				onClick={this.copyToClipboard}
				aria-hidden={hideFromScreenReader}
				tabIndex={hideFromScreenReader ? undefined : -1}
				aria-label={hideFromScreenReader ? undefined : this.state.tooltipMessage}
				aria-labelledby={hideFromScreenReader ? undefined : headingId}
				type="button"
			>
				<LinkIcon
					label={this.getCopyAriaLabel()}
					LEGACY_size={this.props.level > 3 ? 'small' : 'medium'}
					color={this.state.isClicked ? token('color.icon.selected') : token('color.icon.subtle')}
				/>
			</button>
		);
	};

	render() {
		const { tooltipMessage } = this.state;

		if (tooltipMessage) {
			// We set the key to the message to ensure it remounts when the message
			// changes, so that it correctly repositions.
			// @see https://ecosystem.atlassian.net/projects/AK/queues/issue/AK-6548
			return (
				<Tooltip
					// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
					tag={CopyAnchorWrapperWithRef}
					content={tooltipMessage}
					position="top"
					delay={0}
					key={tooltipMessage}
				>
					{this.renderAnchorButton()}
				</Tooltip>
			);
		}

		return this.renderAnchorButton();
	}
}

export default injectIntl(HeadingAnchor);
