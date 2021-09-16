import React, { Ref } from 'react';
import styled from 'styled-components';
import { N200, N500, B400 } from '@atlaskit/theme/colors';
import LinkIcon from '@atlaskit/icon/glyph/link';
import Tooltip from '@atlaskit/tooltip';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { headingAnchorLinkMessages } from '../../messages';
import { MessageDescriptor } from '../../types/i18n';

export const HeadingAnchorWrapperClassName = 'heading-anchor-wrapper';

const CopyAnchorWrapperWithRef = React.forwardRef(
  (props, ref: Ref<HTMLElement>) => {
    const { children, ...rest } = props;
    return (
      <span {...rest} className={HeadingAnchorWrapperClassName} ref={ref}>
        {children}
      </span>
    );
  },
);

const CopyAnchorButton = styled.button`
  display: inline;
  outline: none;
  background-color: transparent;
  border: none;
  color: ${N500};
  cursor: pointer;
  right: 0;
`;

type Props = {
  onCopyText: () => Promise<void>;
  enableNestedHeaderLinks?: boolean;
  level: number;
};

type HeadingAnchorProps = Props & React.Props<any> & InjectedIntlProps;
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
      tooltipMessage: this.props.intl.formatMessage(message),
      isClicked,
    });
  };

  copyToClipboard = async (event: React.SyntheticEvent<HTMLElement>) => {
    const {
      copiedHeadingLinkToClipboard,
      failedToCopyHeadingLink,
    } = headingAnchorLinkMessages;
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
      <CopyAnchorButton
        onMouseLeave={this.resetMessage}
        onClick={this.copyToClipboard}
        aria-label={this.state.tooltipMessage}
      >
        <LinkIcon
          label="copy"
          size={this.props.level > 3 ? 'small' : 'medium'}
          primaryColor={this.state.isClicked ? B400 : N200}
        />
      </CopyAnchorButton>
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
