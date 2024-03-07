/** @jsx jsx */
import type { Ref } from 'react';
import React from 'react';
import { css, jsx } from '@emotion/react';
import { N200, N500, B400 } from '@atlaskit/theme/colors';
import LinkIcon from '@atlaskit/icon/glyph/link';
import Tooltip from '@atlaskit/tooltip';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import { headingAnchorLinkMessages } from '../../messages';
import type { MessageDescriptor } from '../../types/i18n';

import { token } from '@atlaskit/tokens';

export const HeadingAnchorWrapperClassName = 'heading-anchor-wrapper';

const CopyAnchorWrapperWithRef = React.forwardRef(
  (props: React.PropsWithChildren<unknown>, ref: Ref<HTMLElement>) => {
    const { children, ...rest } = props;
    return (
      <span {...rest} className={HeadingAnchorWrapperClassName} ref={ref}>
        {children}
      </span>
    );
  },
);

const copyAnchorButtonStyles = css`
  display: inline;
  outline: none;
  background-color: transparent;
  border: none;
  color: ${token('color.icon', N500)};
  cursor: pointer;
  right: 0;
`;

type Props = {
  onCopyText: () => Promise<void>;
  enableNestedHeaderLinks?: boolean;
  level: number;
};

type HeadingAnchorProps = Props &
  React.PropsWithChildren<any> &
  WrappedComponentProps;
type HeadingAnchorState = { tooltipMessage?: string; isClicked: boolean };

class HeadingAnchor extends React.PureComponent<
  HeadingAnchorProps,
  HeadingAnchorState
> {
  state = { tooltipMessage: '', isClicked: false };

  componentDidMount() {
    this.resetMessage();
  }

  private setTooltipState = (
    message: MessageDescriptor,
    isClicked: boolean = false,
  ) => {
    this.setState({
      // TODO: ED-14403 investigate why this does not translate
      tooltipMessage: this.props.intl.formatMessage(message),
      isClicked,
    });
  };

  private getCopyAriaLabel = () => {
    const { copyAriaLabel } = headingAnchorLinkMessages;
    return this.props.intl.formatMessage(copyAriaLabel);
  };

  copyToClipboard = async (event: React.SyntheticEvent<HTMLElement>) => {
    const { copiedHeadingLinkToClipboard, failedToCopyHeadingLink } =
      headingAnchorLinkMessages;
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
    return (
      <button
        css={copyAnchorButtonStyles}
        onMouseLeave={this.resetMessage}
        onClick={this.copyToClipboard}
        aria-label={this.state.tooltipMessage}
        type="button"
      >
        <LinkIcon
          label={this.getCopyAriaLabel()}
          size={this.props.level > 3 ? 'small' : 'medium'}
          primaryColor={
            this.state.isClicked
              ? token('color.icon.selected', B400)
              : token('color.icon.subtle', N200)
          }
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
