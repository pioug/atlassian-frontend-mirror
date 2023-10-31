/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import type { WrappedComponentProps } from 'react-intl-next';
import { defineMessages, injectIntl } from 'react-intl-next';
import Textfield from '@atlaskit/textfield';
import { sectionWrapperStyles, replaceSectionButtonStyles } from './styles';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
  EVENT_TYPE,
  ACTION,
  ACTION_SUBJECT,
  TRIGGER_METHOD,
} from '@atlaskit/editor-common/analytics';

export type ReplaceProps = {
  canReplace: boolean;
  replaceText?: string;
  onReplace: ({
    triggerMethod,
    replaceText,
  }: {
    triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
    replaceText: string;
  }) => void;
  onReplaceAll: ({ replaceText }: { replaceText: string }) => void;
  onReplaceTextfieldRefSet: (ref: React.RefObject<HTMLInputElement>) => void;
  onArrowUp: () => void;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
};

export type ReplaceState = {
  replaceText: string;
  isComposing: boolean;
};

const messages = defineMessages({
  replaceWith: {
    id: 'fabric.editor.replaceWith',
    defaultMessage: 'Replace with',
    description:
      'The value that will replace the word or phrase that was searched for',
  },
  replace: {
    id: 'fabric.editor.replace',
    defaultMessage: 'Replace',
    description:
      'Replace only the currently selected instance of the word or phrase',
  },
  replaceAll: {
    id: 'fabric.editor.replaceAll',
    defaultMessage: 'Replace all',
    description:
      'Replace all instances of the word or phrase throughout the entire document',
  },
});

class Replace extends React.PureComponent<
  ReplaceProps & WrappedComponentProps,
  ReplaceState
> {
  state: ReplaceState;

  private replaceTextfieldRef = React.createRef<HTMLInputElement>();
  private replaceWith: string;
  private replace: string;
  private replaceAll: string;

  constructor(props: ReplaceProps & WrappedComponentProps) {
    super(props);

    const {
      replaceText,
      intl: { formatMessage },
    } = props;

    this.state = { replaceText: replaceText || '', isComposing: false };

    this.replaceWith = formatMessage(messages.replaceWith);
    this.replace = formatMessage(messages.replace);
    this.replaceAll = formatMessage(messages.replaceAll);
  }

  componentDidMount() {
    this.props.onReplaceTextfieldRefSet(this.replaceTextfieldRef);
  }

  componentDidUpdate({
    replaceText: prevReplaceText,
  }: ReplaceProps & WrappedComponentProps) {
    const { replaceText } = this.props;
    if (replaceText && replaceText !== prevReplaceText) {
      this.setState({ replaceText, isComposing: false });
    }
  }

  skipWhileComposing = (fn: Function) => {
    if (this.state.isComposing) {
      return;
    }
    fn();
  };

  handleReplaceClick = () =>
    this.skipWhileComposing(() => {
      this.props.onReplace({
        triggerMethod: TRIGGER_METHOD.BUTTON,
        replaceText: this.state.replaceText,
      });
    });

  handleReplaceChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.skipWhileComposing(() => {
      this.updateReplaceValue(event.target.value);
    });

  updateReplaceValue = (replaceText: string) => {
    const { dispatchAnalyticsEvent } = this.props;
    if (dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        eventType: EVENT_TYPE.TRACK,
        action: ACTION.CHANGED_REPLACEMENT_TEXT,
        actionSubject: ACTION_SUBJECT.FIND_REPLACE_DIALOG,
      });
    }
    this.setState({ replaceText });
  };

  handleReplaceKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) =>
    this.skipWhileComposing(() => {
      if (event.key === 'Enter') {
        this.props.onReplace({
          triggerMethod: TRIGGER_METHOD.KEYBOARD,
          replaceText: this.state.replaceText,
        });
      } else if (event.key === 'ArrowUp') {
        // we want to move focus between find & replace texfields when user hits up/down arrows
        this.props.onArrowUp();
      }
    });

  handleReplaceAllClick = () =>
    this.skipWhileComposing(() => {
      this.props.onReplaceAll({ replaceText: this.state.replaceText });
    });

  handleCompositionStart = () => {
    this.setState({ isComposing: true });
  };

  handleCompositionEnd = (event: React.CompositionEvent<HTMLInputElement>) => {
    this.setState({ isComposing: false });
    // type for React.CompositionEvent doesn't set type for target correctly
    this.updateReplaceValue((event.target as HTMLInputElement).value);
  };

  render() {
    const { replaceText } = this.state;
    const { canReplace } = this.props;

    return (
      <div css={sectionWrapperStyles}>
        <Textfield
          name="replace"
          appearance="none"
          placeholder={this.replaceWith}
          defaultValue={replaceText}
          ref={this.replaceTextfieldRef}
          autoComplete="off"
          onChange={this.handleReplaceChange}
          onKeyDown={this.handleReplaceKeyDown}
          onCompositionStart={this.handleCompositionStart}
          onCompositionEnd={this.handleCompositionEnd}
        />
        <Button
          css={replaceSectionButtonStyles}
          testId={this.replace}
          onClick={this.handleReplaceClick}
          isDisabled={!canReplace}
        >
          {this.replace}
        </Button>
        <Button
          css={replaceSectionButtonStyles}
          testId={this.replaceAll}
          onClick={this.handleReplaceAllClick}
          isDisabled={!canReplace}
        >
          {this.replaceAll}
        </Button>
      </div>
    );
  }
}

export default injectIntl(Replace);
