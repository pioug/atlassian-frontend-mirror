import React, { Ref } from 'react';
import styled from 'styled-components';
import { N200, N500, B400 } from '@atlaskit/theme/colors';
import LinkIcon from '@atlaskit/icon/glyph/link';
import Tooltip from '@atlaskit/tooltip';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { headingAnchorLinkMessages } from '../../messages';
import { MessageDescriptor } from '../../types/i18n';

export const HeadingAnchorWrapperClassName = 'heading-anchor-wrapper';
export const HeadingAnchorWrapperLegacyClassName = 'heading-anchor-wrapper-old';

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
      >
        <LinkIcon
          label="copy"
          size={this.props.level > 3 ? 'small' : 'medium'}
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

  private renderWithOptionalTooltip = (renderMethod: () => JSX.Element) => {
    const { tooltipMessage: message } = this.state;

    if (message) {
      const tag =
        renderMethod === this.renderAnchorButtonLegacy
          ? 'span'
          : CopyAnchorWrapperWithRef;
      // We set the key to the message to ensure it remounts when the message
      // changes, so that it correctly repositions.
      // @see https://ecosystem.atlassian.net/projects/AK/queues/issue/AK-6548
      return (
        <Tooltip
          tag={tag}
          content={message}
          position="top"
          delay={0}
          key={message}
        >
          {renderMethod()}
        </Tooltip>
      );
    }

    return renderMethod();
  };

  render() {
    const { enableNestedHeaderLinks } = this.props;

    // New UX
    if (enableNestedHeaderLinks) {
      return this.renderWithOptionalTooltip(this.renderAnchorButton);
    }

    // Legacy UX
    return (
      <div className={HeadingAnchorWrapperLegacyClassName}>
        <CopyAnchorWrapperLegacy>
          {this.renderWithOptionalTooltip(this.renderAnchorButtonLegacy)}
        </CopyAnchorWrapperLegacy>
      </div>
    );
  }
}

export default injectIntl(HeadingAnchor);
