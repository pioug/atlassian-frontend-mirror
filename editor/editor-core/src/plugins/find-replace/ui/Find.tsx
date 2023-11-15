/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';

import type { WrappedComponentProps } from 'react-intl-next';
import { defineMessages, injectIntl } from 'react-intl-next';

import debounce from 'lodash/debounce';

import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import ChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import MatchCaseIcon from '@atlaskit/icon/glyph/emoji/keyboard';
import Textfield from '@atlaskit/textfield';
import {
  countStyles,
  countWrapperStyles,
  sectionWrapperStyles,
} from './styles';
import { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';
import { FindReplaceTooltipButton } from './FindReplaceTooltipButton';
import type { MatchCaseProps } from '../types';
import rafSchd from 'raf-schd';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export const FIND_DEBOUNCE_MS = 100;

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
  onFindTextfieldRefSet: (ref: React.RefObject<HTMLInputElement>) => void;
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

type State = {
  localFindText: string;
};

class Find extends React.Component<FindProps & WrappedComponentProps, State> {
  private findTextfieldRef = React.createRef<HTMLInputElement>();
  private isComposing = false;

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

  constructor(props: FindProps & WrappedComponentProps) {
    super(props);

    const {
      intl: { formatMessage },
    } = props;

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

    // We locally manage the value of the input inside this component in order to support compositions.
    // This requires some additional work inside componentDidUpdate to ensure we support changes that
    // occur to this value which do not originate from this component.
    this.state = { localFindText: '' };
  }

  componentDidMount() {
    this.props.onFindTextfieldRefSet(this.findTextfieldRef);

    // focus initially on dialog mount if there is no find text provided
    if (!this.props.findText) {
      this.focusFindTextfield();
    }
    this.syncFindText(() => {
      // focus after input is synced if find text provided
      if (this.props.findText) {
        this.focusFindTextfield();
      }
    });
  }

  componentDidUpdate(prevProps: FindProps) {
    // focus on update if find text did not change
    if (!getBooleanFF('platform.editor.a11y-find-replace')) {
      if (this.props.findText === this.state?.localFindText) {
        this.focusFindTextfield();
      }
      if (this.props.findText !== prevProps.findText) {
        this.syncFindText(() => {
          // focus after input is synced if find text provided
          if (this.props.findText) {
            this.focusFindTextfield();
          }
        });
      }
    }
  }

  componentWillUnmount() {
    this.debouncedFind.cancel();
    this.handleFindKeyDownThrottled.cancel();
  }

  syncFindText = (onSynced?: Function) => {
    // If the external prop findText changes and we aren't in a composition we should update to
    // use the external prop value.
    //
    // An example of where this may happen is when a find occurs through the user selecting some text
    // and pressing Mod-f.
    if (
      !this.isComposing &&
      this.props.findText !== this.state?.localFindText
    ) {
      this.updateFindValue(this.props.findText || '', onSynced);
    }
  };

  focusFindTextfield = () => {
    const input = this.findTextfieldRef.current;
    if (this.props.shouldFocus && input) {
      input.select();
    }
  };

  handleFindChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.updateFindValue(event.target.value);
  };

  // debounce (vs throttle) to not block typing inside find input while onFind runs
  private debouncedFind = debounce((value) => {
    this.props.onFind(value);
  }, FIND_DEBOUNCE_MS);

  updateFindValue = (value: string, onSynced?: Function) => {
    this.setState({ localFindText: value }, () => {
      if (this.isComposing) {
        return;
      }
      onSynced && onSynced();
      this.debouncedFind(value);
    });
  };

  // throtlle between animation frames gives better experience on Enter compared to arbitrary value
  // it adjusts based on performance (and document size)
  private handleFindKeyDownThrottled = rafSchd(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
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
    },
  );

  handleFindKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (this.isComposing) {
      return;
    }
    event.persist();
    this.handleFindKeyDownThrottled(event);
  };

  handleFindKeyUp = () => {
    this.handleFindKeyDownThrottled.cancel();
  };

  handleFindNextClick = (ref: React.RefObject<HTMLElement>) => {
    if (this.isComposing) {
      return;
    }
    this.props.onFindNext({ triggerMethod: TRIGGER_METHOD.BUTTON });
  };

  handleFindPrevClick = (ref: React.RefObject<HTMLElement>) => {
    if (this.isComposing) {
      return;
    }
    this.props.onFindPrev({ triggerMethod: TRIGGER_METHOD.BUTTON });
  };

  handleCompositionStart = () => {
    this.isComposing = true;
  };

  handleCompositionEnd = (event: React.CompositionEvent<HTMLInputElement>) => {
    this.isComposing = false;
    // type for React.CompositionEvent doesn't set type for target correctly
    this.updateFindValue((event.target as HTMLInputElement).value);
  };

  clearSearch = () => {
    this.props.onCancel({ triggerMethod: TRIGGER_METHOD.BUTTON });
  };

  handleMatchCaseClick = (buttonRef: React.RefObject<HTMLButtonElement>) => {
    if (this.props.allowMatchCase && this.props.onToggleMatchCase) {
      this.props.onToggleMatchCase();
      this.props.onFind(this.props.findText);
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
      <div css={sectionWrapperStyles}>
        <Textfield
          name="find"
          appearance="none"
          placeholder={this.find}
          value={this.state.localFindText}
          ref={this.findTextfieldRef}
          autoComplete="off"
          onChange={this.handleFindChange}
          onKeyDown={this.handleFindKeyDown}
          onKeyUp={this.handleFindKeyUp}
          onBlur={this.props.onFindBlur}
          onCompositionStart={this.handleCompositionStart}
          onCompositionEnd={this.handleCompositionEnd}
        />
        <div css={countWrapperStyles} aria-live="polite">
          {findText && (
            <span data-testid="textfield-count" css={countStyles}>
              {count.total === 0 ? this.noResultsFound : resultsCount}
            </span>
          )}
        </div>
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
      </div>
    );
  }
}

export default injectIntl(Find);
