import React from 'react';
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';
import Textfield from '@atlaskit/textfield';
import Button from '@atlaskit/button';
import { SectionWrapper } from './styles';
import {
  EVENT_TYPE,
  ACTION,
  ACTION_SUBJECT,
  TRIGGER_METHOD,
  DispatchAnalyticsEvent,
} from '../../analytics/types';

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
  onReplaceTextfieldRefSet: (ref: React.RefObject<HTMLElement>) => void;
  onFocusElementRefSet: (ref: React.RefObject<HTMLElement>) => void;
  onArrowUp: () => void;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
};

export type ReplaceState = {
  replaceText: string;
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
  ReplaceProps & InjectedIntlProps,
  ReplaceState
> {
  state: ReplaceState;

  private replaceTextfieldRef = React.createRef<HTMLInputElement>();
  private replaceWith: string;
  private replace: string;
  private replaceAll: string;

  constructor(props: ReplaceProps & InjectedIntlProps) {
    super(props);

    const {
      replaceText,
      intl: { formatMessage },
    } = props;

    this.state = { replaceText: replaceText || '' };

    this.replaceWith = formatMessage(messages.replaceWith);
    this.replace = formatMessage(messages.replace);
    this.replaceAll = formatMessage(messages.replaceAll);
  }

  componentWillReceiveProps(newProps: ReplaceProps & InjectedIntlProps) {
    if (newProps.replaceText) {
      this.setState({ replaceText: newProps.replaceText });
    }
  }

  componentDidMount() {
    this.props.onReplaceTextfieldRefSet(this.replaceTextfieldRef);
  }

  handleReplaceClick = () => {
    this.props.onReplace({
      triggerMethod: TRIGGER_METHOD.BUTTON,
      replaceText: this.state.replaceText,
    });
  };

  handleReplaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { dispatchAnalyticsEvent } = this.props;
    if (dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        eventType: EVENT_TYPE.TRACK,
        action: ACTION.CHANGED_REPLACEMENT_TEXT,
        actionSubject: ACTION_SUBJECT.FIND_REPLACE_DIALOG,
      });
    }
    this.setState({ replaceText: event.target.value });
  };

  handleReplaceKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.props.onReplace({
        triggerMethod: TRIGGER_METHOD.KEYBOARD,
        replaceText: this.state.replaceText,
      });
    } else if (event.key === 'ArrowUp') {
      // we want to move focus between find & replace texfields when user hits up/down arrows
      this.props.onArrowUp();
    }
  };

  handleReplaceAllClick = () => {
    this.props.onReplaceAll({ replaceText: this.state.replaceText });
  };

  handleReplaceFocus = () => {
    this.props.onFocusElementRefSet(this.replaceTextfieldRef);
  };

  render() {
    const { replaceText } = this.state;
    const { canReplace } = this.props;

    return (
      <SectionWrapper>
        <Textfield
          name="replace"
          appearance="none"
          placeholder={this.replaceWith}
          defaultValue={replaceText}
          ref={this.replaceTextfieldRef}
          autoComplete="off"
          onChange={this.handleReplaceChange}
          onKeyDown={this.handleReplaceKeyDown}
          onFocus={this.handleReplaceFocus}
        />
        <Button
          testId={this.replace}
          onClick={this.handleReplaceClick}
          isDisabled={!canReplace}
        >
          {this.replace}
        </Button>
        <Button
          testId={this.replaceAll}
          onClick={this.handleReplaceAllClick}
          isDisabled={!canReplace}
        >
          {this.replaceAll}
        </Button>
      </SectionWrapper>
    );
  }
}

export default injectIntl(Replace);
