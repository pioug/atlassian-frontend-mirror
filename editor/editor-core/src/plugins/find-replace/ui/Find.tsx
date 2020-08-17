import React from 'react';
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';
import rafSchedule from 'raf-schd';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import ChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import MatchCaseIcon from '@atlaskit/icon/glyph/emoji/keyboard';
import Textfield from '@atlaskit/textfield';
import { SectionWrapper, Count } from './styles';
import { TRIGGER_METHOD } from '../../analytics/types';
import { FindReplaceTooltipButton } from './FindReplaceTooltipButton';
import { MatchCaseProps } from '../types';

export type FindProps = {
  findText?: string;
  count: { index: number; total: number };
  shouldFocus: boolean;
  onFindBlur: () => void;
  onFind: (findText?: string) => void;
  onFindNext: ({
    triggerMethod,
  }: {
    triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
  }) => void;
  onFindPrev: ({
    triggerMethod,
  }: {
    triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
  }) => void;
  onFindTextfieldRefSet: (ref: React.RefObject<HTMLElement>) => void;
  onFocusElementRefSet: (ref: React.RefObject<HTMLElement>) => void;
  onCancel: ({
    triggerMethod,
  }: {
    triggerMethod:
      | TRIGGER_METHOD.KEYBOARD
      | TRIGGER_METHOD.TOOLBAR
      | TRIGGER_METHOD.BUTTON;
  }) => void;
  onArrowDown: () => void;
} & MatchCaseProps;

export type FindState = {
  findText: string;
  isComposing: boolean;
};

const messages = defineMessages({
  find: {
    id: 'fabric.editor.find',
    defaultMessage: 'Find',
    description: 'The word or phrase to search for on the document',
  },
  matchCase: {
    id: 'fabric.editor.matchCase',
    defaultMessage: 'Match case',
    description:
      'Toggle whether should also match case when searching for text',
  },
  findNext: {
    id: 'fabric.editor.findNext',
    defaultMessage: 'Find next',
    description:
      'Locate the next occurrence of the word or phrase that was searched for',
  },
  findPrevious: {
    id: 'fabric.editor.findPrevious',
    defaultMessage: 'Find previous',
    description:
      'Locate the previous occurrence of the word or phrase that was searched for',
  },
  closeFindReplaceDialog: {
    id: 'fabric.editor.closeFindReplaceDialog',
    defaultMessage: 'Close',
    description: 'Cancel search and close the "Find and Replace" dialog',
  },
  noResultsFound: {
    id: 'fabric.editor.noResultsFound',
    defaultMessage: 'No results',
    description:
      'No matches were found for the word or phrase that was searched for',
  },
  resultsCount: {
    id: 'fabric.editor.resultsCount',
    description:
      'Text for selected search match position and total results count',
    defaultMessage: '{selectedMatchPosition} of {totalResultsCount}',
  },
});

class Find extends React.Component<FindProps & InjectedIntlProps, FindState> {
  state: FindState = {
    findText: '',
    isComposing: false,
  };

  private findTextfieldRef = React.createRef<HTMLInputElement>();
  private find: string;
  private closeFindReplaceDialog: string;
  private noResultsFound: string;
  private findNext: string;
  private findPrevious: string;
  private matchCase: string;
  private matchCaseIcon: JSX.Element;
  private findNextIcon: JSX.Element;
  private findPrevIcon: JSX.Element;
  private closeIcon: JSX.Element;

  constructor(props: FindProps & InjectedIntlProps) {
    super(props);

    const {
      findText,
      intl: { formatMessage },
    } = props;

    if (findText) {
      this.updateFindTextfieldValue(findText);
    }

    this.find = formatMessage(messages.find);
    this.closeFindReplaceDialog = formatMessage(
      messages.closeFindReplaceDialog,
    );
    this.noResultsFound = formatMessage(messages.noResultsFound);
    this.findNext = formatMessage(messages.findNext);
    this.findPrevious = formatMessage(messages.findPrevious);
    this.matchCase = formatMessage(messages.matchCase);

    this.matchCaseIcon = <MatchCaseIcon label={this.matchCase} />;
    this.findNextIcon = <ChevronDownIcon label={this.findNext} />;
    this.findPrevIcon = <ChevronUpIcon label={this.findPrevious} />;
    this.closeIcon = <EditorCloseIcon label={this.closeFindReplaceDialog} />;
  }

  componentDidMount() {
    this.focusFindTextfield();
    this.props.onFindTextfieldRefSet(this.findTextfieldRef);
  }

  componentWillReceiveProps(newProps: FindProps & InjectedIntlProps) {
    // findText could have been updated from outside this component, for example
    // if a user double clicks to highlight a word and then hits cmd+f
    if (newProps.findText && newProps.findText !== this.state.findText) {
      this.updateFindTextfieldValue(newProps.findText);
    }

    if (newProps.shouldFocus) {
      this.focusFindTextfield();
    }
  }

  skipWhileComposing = (fn: Function) => {
    if (this.state.isComposing) {
      return;
    }
    fn();
  };

  focusFindTextfield = () => {
    if (this.findTextfieldRef.current) {
      this.findTextfieldRef.current.select();
    }
  };

  updateFindTextfieldValue = (value: string) => {
    this.setState({ findText: value, isComposing: false });
    if (this.findTextfieldRef.current) {
      this.findTextfieldRef.current.value = value;
    }
    this.updateFindValue(value);
  };

  handleFindChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.skipWhileComposing(() => {
      this.updateFindValue(event.target.value);
    });

  updateFindValue = rafSchedule((value: string) => {
    this.setState({ findText: value });
    this.props.onFind(value);
  });

  handleFindKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) =>
    this.skipWhileComposing(() => {
      if (event.key === 'Enter') {
        if (event.shiftKey) {
          this.props.onFindPrev({ triggerMethod: TRIGGER_METHOD.KEYBOARD });
        } else {
          this.props.onFindNext({ triggerMethod: TRIGGER_METHOD.KEYBOARD });
        }
      } else if (event.key === 'ArrowDown') {
        // we want to move focus between find & replace texfields when user hits up/down arrows
        this.props.onArrowDown();
      }
    });

  handleFindFocus = () => {
    this.props.onFocusElementRefSet(this.findTextfieldRef);
  };

  handleFindNextClick = (ref: React.RefObject<HTMLElement>) =>
    this.skipWhileComposing(() => {
      this.props.onFocusElementRefSet(ref);
      this.props.onFindNext({ triggerMethod: TRIGGER_METHOD.BUTTON });
    });

  handleFindPrevClick = (ref: React.RefObject<HTMLElement>) =>
    this.skipWhileComposing(() => {
      this.props.onFocusElementRefSet(ref);
      this.props.onFindPrev({ triggerMethod: TRIGGER_METHOD.BUTTON });
    });

  handleCompositionStart = () => {
    this.setState({ isComposing: true });
  };

  handleCompositionEnd = (event: React.CompositionEvent<HTMLInputElement>) => {
    this.setState({ isComposing: false });
    // type for React.CompositionEvent doesn't set type for target correctly
    this.updateFindValue((event.target as HTMLInputElement).value);
  };

  clearSearch = () => {
    this.props.onCancel({ triggerMethod: TRIGGER_METHOD.BUTTON });
  };

  handleMatchCaseClick = (ref: React.RefObject<HTMLElement>) => {
    if (this.props.allowMatchCase && this.props.onToggleMatchCase) {
      this.props.onFocusElementRefSet(ref);
      this.props.onToggleMatchCase();
      this.props.onFind(this.state.findText);
    }
  };

  render() {
    const {
      findText,
      count,
      allowMatchCase,
      shouldMatchCase,
      intl: { formatMessage },
    } = this.props;

    const resultsCount = formatMessage(messages.resultsCount, {
      selectedMatchPosition: count.index + 1,
      totalResultsCount: count.total,
    });

    return (
      <SectionWrapper>
        <Textfield
          name="find"
          appearance="none"
          placeholder={this.find}
          defaultValue={findText}
          ref={this.findTextfieldRef}
          autoComplete="off"
          onChange={this.handleFindChange}
          onKeyDown={this.handleFindKeyDown}
          onBlur={this.props.onFindBlur}
          onFocus={this.handleFindFocus}
          onCompositionStart={this.handleCompositionStart}
          onCompositionEnd={this.handleCompositionEnd}
        />
        {findText && (
          <Count>
            {count.total === 0 ? this.noResultsFound : resultsCount}
          </Count>
        )}
        {allowMatchCase && (
          <FindReplaceTooltipButton
            title={this.matchCase}
            icon={this.matchCaseIcon}
            onClick={this.handleMatchCaseClick}
            isPressed={shouldMatchCase}
          />
        )}
        <FindReplaceTooltipButton
          title={this.findNext}
          icon={this.findNextIcon}
          keymapDescription={'Enter'}
          onClick={this.handleFindNextClick}
          disabled={count.total <= 1}
        />
        <FindReplaceTooltipButton
          title={this.findPrevious}
          icon={this.findPrevIcon}
          keymapDescription={'Shift Enter'}
          onClick={this.handleFindPrevClick}
          disabled={count.total <= 1}
        />
        <FindReplaceTooltipButton
          title={this.closeFindReplaceDialog}
          icon={this.closeIcon}
          keymapDescription={'Escape'}
          onClick={this.clearSearch}
        />
      </SectionWrapper>
    );
  }
}

export default injectIntl(Find);
