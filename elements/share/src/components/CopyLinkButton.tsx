import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import LinkFilledIcon from '@atlaskit/icon/glyph/link-filled';
import Popup, { TriggerProps } from '@atlaskit/popup';
import { G300 } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import Tooltip from '@atlaskit/tooltip';
import React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import styled from 'styled-components';
import Button, { InlineDialogContentWrapper } from './styles';
import { messages } from '../i18n';

const Z_INDEX = layers.modal();

const AUTO_DISMISS_SECONDS = 8;

export const AUTO_DISMISS_MS = AUTO_DISMISS_SECONDS * 1000;

export const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  margin: -8px -16px;
`;

const MessageSpan = styled.span`
  text-indent: 6px;
`;

type InputProps = {
  text: string;
};

export const HiddenInput = React.forwardRef<HTMLInputElement, InputProps>(
  // we need a hidden input to reliably copy to clipboard across all browsers.
  (props, ref) => (
    <input
      style={{ position: 'absolute', left: '-9999px' }}
      ref={ref}
      value={props.text}
      readOnly
    />
  ),
);

export type Props = {
  onLinkCopy?: (link: string) => void;
  link: string;
  isDisabled?: boolean;
  isPublicLink?: boolean;
  copyTooltipText?: string;
};

export type State = {
  shouldShowCopiedMessage: boolean;
};

export class CopyLinkButton extends React.Component<
  Props & InjectedIntlProps,
  State
> {
  private autoDismiss: ReturnType<typeof setTimeout> | undefined;
  private inputRef: React.RefObject<HTMLInputElement> = React.createRef();

  state = {
    shouldShowCopiedMessage: false,
  };

  componentWillUnmount() {
    this.clearAutoDismiss();
  }

  private clearAutoDismiss = () => {
    if (this.autoDismiss) {
      clearTimeout(this.autoDismiss);
      this.autoDismiss = undefined;
    }
  };

  private handleClick = () => {
    this.inputRef.current!.select();
    document.execCommand('copy');

    if (this.props.onLinkCopy) {
      this.props.onLinkCopy!(this.props.link);
    }

    this.setState({ shouldShowCopiedMessage: true }, () => {
      this.clearAutoDismiss();
      this.autoDismiss = setTimeout(() => {
        this.setState({ shouldShowCopiedMessage: false });
      }, AUTO_DISMISS_MS);
    });
  };

  private handleDismissCopiedMessage = () => {
    this.clearAutoDismiss();
    this.setState({ shouldShowCopiedMessage: false });
  };

  renderTriggerButton = (triggerProps: TriggerProps) => {
    const {
      intl: { formatMessage },
      isDisabled,
      isPublicLink,
    } = this.props;
    return (
      <Button
        isDisabled={isDisabled}
        appearance="subtle-link"
        iconBefore={
          <LinkFilledIcon
            label={formatMessage(messages.copyLinkButtonIconLabel)}
            size="medium"
          />
        }
        onClick={this.handleClick}
        {...triggerProps}
      >
        <FormattedMessage
          {...(isPublicLink
            ? messages.copyPublicLinkButtonText
            : messages.copyLinkButtonText)}
        />
      </Button>
    );
  };

  render() {
    const { shouldShowCopiedMessage } = this.state;
    const {
      intl: { formatMessage },
      copyTooltipText,
    } = this.props;

    return (
      <>
        <HiddenInput ref={this.inputRef} text={this.props.link} />
        <Popup
          zIndex={Z_INDEX}
          content={() => (
            <InlineDialogContentWrapper>
              <MessageContainer>
                <CheckCircleIcon
                  label={formatMessage(messages.copiedToClipboardIconLabel)}
                  primaryColor={G300}
                />
                <MessageSpan>
                  <FormattedMessage {...messages.copiedToClipboardMessage} />
                </MessageSpan>
              </MessageContainer>
            </InlineDialogContentWrapper>
          )}
          isOpen={shouldShowCopiedMessage}
          onClose={this.handleDismissCopiedMessage}
          placement="top-start"
          trigger={(triggerProps: TriggerProps) =>
            copyTooltipText ? (
              <Tooltip content={copyTooltipText} position="bottom-start">
                {this.renderTriggerButton(triggerProps)}
              </Tooltip>
            ) : (
              this.renderTriggerButton(triggerProps)
            )
          }
        />
      </>
    );
  }
}

export default injectIntl(CopyLinkButton);
