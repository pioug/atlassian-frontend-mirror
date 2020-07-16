import React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import LinkIcon from '@atlaskit/icon/glyph/link';
import { gridSize } from '@atlaskit/theme/constants';
import Tooltip from '@atlaskit/tooltip';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { headingAnchorLinkMessages } from '../../messages';
import { MessageDescriptor } from '../../types/i18n';

// Legacy anchor link imports
import { N500 } from '@atlaskit/theme/colors';

export const HeadingAnchorWrapperClassName = 'heading-anchor-wrapper';
export const HeadingAnchorWrapperLegacyClassName = 'heading-anchor-wrapper-old';
export const HeadingAnchorButtonWrapperClassName = 'button-anchor-wrapper';

const CopyAnchorWrapper = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  right: ${gridSize()}px;
  width: ${gridSize() * 5}px;
  height: ${gridSize() * 5}px;
  top: -${gridSize()}px;
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

const CopyAnchorLegacy = styled.button`
  outline: none;
  background-color: transparent;
  border: none;
  color: ${N500};
  cursor: pointer;
  right: 0;
  height: 100%;
`;

type Props = {
  onCopyText: () => Promise<void>;
  enableNestedHeaderLinks?: boolean;
};

type HeadingAnchorProps = Props & React.Props<any> & InjectedIntlProps;
type HeadingAnchorState = { tooltipMessage?: string };

class HeadingAnchor extends React.PureComponent<
  HeadingAnchorProps,
  HeadingAnchorState
> {
  state = { tooltipMessage: '' };

  componentDidMount() {
    this.resetMessage();
  }

  private setTooltipState = (message: MessageDescriptor) => {
    this.setState({ tooltipMessage: this.props.intl.formatMessage(message) });
  };

  copyToClipboard = async () => {
    const {
      copiedHeadingLinkToClipboard,
      failedToCopyHeadingLink,
    } = headingAnchorLinkMessages;
    try {
      await this.props.onCopyText();
      this.setTooltipState(copiedHeadingLinkToClipboard);
    } catch (e) {
      this.setTooltipState(failedToCopyHeadingLink);
    }
  };

  resetMessage = () => {
    this.setTooltipState(headingAnchorLinkMessages.copyHeadingLinkToClipboard);
  };

  renderAnchorButton = () => {
    return (
      <div className={HeadingAnchorButtonWrapperClassName}>
        <Button
          appearance="subtle"
          spacing="none"
          onMouseLeave={this.resetMessage}
          onClick={this.copyToClipboard}
          iconBefore={
            <LinkIcon label="link icon" size="small">
              link selected
            </LinkIcon>
          }
        />
      </div>
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

  private renderOptionalTooltip = (renderMethod: () => JSX.Element) => {
    const { tooltipMessage: message } = this.state;
    // We set the key to the message to ensure it remounts when the message
    // changes, so that it correctly repositions.
    // @see https://ecosystem.atlassian.net/projects/AK/queues/issue/AK-6548
    return message ? (
      <Tooltip content={message} position="top" delay={0} key={message}>
        {renderMethod()}
      </Tooltip>
    ) : (
      <div>{renderMethod()}</div>
    );
  };

  render() {
    const { enableNestedHeaderLinks } = this.props;
    // We've bound the new UI/UX with the enablement of nested header link support
    const className = enableNestedHeaderLinks
      ? HeadingAnchorWrapperClassName
      : HeadingAnchorWrapperLegacyClassName;
    return (
      <div className={className}>
        {enableNestedHeaderLinks ? (
          <CopyAnchorWrapper>
            {this.renderOptionalTooltip(this.renderAnchorButton)}
          </CopyAnchorWrapper>
        ) : (
          <CopyAnchorWrapperLegacy>
            {this.renderOptionalTooltip(this.renderAnchorButtonLegacy)}
          </CopyAnchorWrapperLegacy>
        )}
      </div>
    );
  }
}

export default injectIntl(HeadingAnchor);
