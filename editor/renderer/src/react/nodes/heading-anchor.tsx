import React from 'react';
import styled from 'styled-components';
import { N200, N500, B400 } from '@atlaskit/theme/colors';
import LinkIcon from '@atlaskit/icon/glyph/link';
import Tooltip from '@atlaskit/tooltip';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { headingAnchorLinkMessages } from '../../messages';
import { MessageDescriptor } from '../../types/i18n';

export const HeadingAnchorWrapperClassName = 'heading-anchor-wrapper';
export const HeadingAnchorWrapperLegacyClassName = 'heading-anchor-wrapper-old';

const CopyAnchorWrapper = styled.span`
  display: inline;
  align-items: center;
  overflow: hidden;

  & > div {
    display: inline;
  }
`;

const CopyAnchorWrapperLegacy = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  overflow: hidden;
  right: 0;
  width: 32px;
  height: 100%;
`;

const CopyAnchorButton = styled.button`
  display: inline;
  outline: none;
  background-color: transparent;
  border: none;
  color: ${N500};
  cursor: pointer;
  right: 0;
`;

const CopyAnchorLegacy = styled.button`
  outline: none;
  background-color: transparent;
  border: none;
  height: 100%;
`;

type Props = {
  onCopyText: () => Promise<void>;
  enableNestedHeaderLinks?: boolean;
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

  copyToClipboard = async () => {
    const {
      copiedHeadingLinkToClipboard,
      failedToCopyHeadingLink,
    } = headingAnchorLinkMessages;
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
      >
        <LinkIcon
          label="copy"
          size="medium"
          primaryColor={this.state.isClicked ? B400 : N200}
        />
      </CopyAnchorButton>
    );
  };

  renderAnchorButtonLegacy = () => {
    return (
      <CopyAnchorLegacy
        onMouseLeave={this.resetMessage}
        onClick={this.copyToClipboard}
      >
        <LinkIcon label="copy" size="small" />
      </CopyAnchorLegacy>
    );
  };

  private renderOptionalTooltip = (
    renderMethod: () => JSX.Element,
    enableNestedHeaderLinks?: boolean,
  ) => {
    const { tooltipMessage: message } = this.state;
    // We set the key to the message to ensure it remounts when the message
    // changes, so that it correctly repositions.
    // @see https://ecosystem.atlassian.net/projects/AK/queues/issue/AK-6548
    return message ? (
      <Tooltip content={message} position="top" delay={0} key={message}>
        {renderMethod()}
      </Tooltip>
    ) : enableNestedHeaderLinks ? (
      <span>{renderMethod()}</span>
    ) : (
      <div>{renderMethod()}</div>
    );
  };

  render() {
    const { enableNestedHeaderLinks } = this.props;

    return enableNestedHeaderLinks ? (
      <span className={HeadingAnchorWrapperClassName}>
        <CopyAnchorWrapper>
          {this.renderOptionalTooltip(
            this.renderAnchorButton,
            enableNestedHeaderLinks,
          )}
        </CopyAnchorWrapper>
      </span>
    ) : (
      <div className={HeadingAnchorWrapperLegacyClassName}>
        <CopyAnchorWrapperLegacy>
          {this.renderOptionalTooltip(
            this.renderAnchorButtonLegacy,
            enableNestedHeaderLinks,
          )}
        </CopyAnchorWrapperLegacy>
      </div>
    );
  }
}

export default injectIntl(HeadingAnchor);
