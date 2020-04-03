import React from 'react';
import styled from 'styled-components';
import LinkIcon from '@atlaskit/icon/glyph/link';
import { colors } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { headingAnchorLinkMessages } from '../../messages';

export const HeadingAnchorWrapperClassName: string = 'heading-anchor-wrapper';

const CopyAnchorWrapper = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  overflow: hidden;
  right: 0;
  width: 32px;
  height: 100%;
`;

const CopyAnchor = styled.button`
  outline: none;
  background-color: transparent;
  border: none;
  color: ${colors.N500};
  cursor: pointer;
  right: 0;
  height: 100%;
`;

class HeadingAnchor extends React.PureComponent<
  { onCopyText: () => Promise<void> } & React.Props<any> & InjectedIntlProps
> {
  initialTooltipMessage = this.props.intl.formatMessage(
    headingAnchorLinkMessages.copyHeadingLinkToClipboard,
  );

  state = {
    tooltipMessage: this.initialTooltipMessage,
  };

  private resetMsgTimeoutId: number | undefined;

  componentWillUnmount() {
    window.clearTimeout(this.resetMsgTimeoutId);
  }

  copyToClipboard = async () => {
    // This is needed to reset tooltip to reposition it.
    // Might be better to fix tooltip reposition bug.
    // https://ecosystem.atlassian.net/projects/AK/queues/issue/AK-6548
    this.setState({ tooltipMessage: '' });

    try {
      await this.props.onCopyText();
      this.setState({
        tooltipMessage: this.props.intl.formatMessage(
          headingAnchorLinkMessages.copiedHeadingLinkToClipboard,
        ),
      });
    } catch (e) {
      this.setState({
        tooltipMessage: this.props.intl.formatMessage(
          headingAnchorLinkMessages.failedToCopyHeadingLink,
        ),
      });
    }
  };

  resetMessage = () => {
    this.setState({ tooltipMessage: '' });
    this.resetMsgTimeoutId = window.setTimeout(() => {
      this.setState({ tooltipMessage: this.initialTooltipMessage });
    }, 0);
  };

  renderAnchor() {
    return (
      <CopyAnchor
        onMouseLeave={this.resetMessage}
        onClick={this.copyToClipboard}
      >
        <LinkIcon label="copy" size="small" />
      </CopyAnchor>
    );
  }

  render() {
    return (
      <div className={HeadingAnchorWrapperClassName}>
        <CopyAnchorWrapper>
          {this.state.tooltipMessage ? (
            <Tooltip
              content={this.state.tooltipMessage}
              position="top"
              delay={0}
            >
              {this.renderAnchor()}
            </Tooltip>
          ) : (
            <div>{this.renderAnchor()}</div>
          )}
        </CopyAnchorWrapper>
      </div>
    );
  }
}

export default injectIntl(HeadingAnchor);
