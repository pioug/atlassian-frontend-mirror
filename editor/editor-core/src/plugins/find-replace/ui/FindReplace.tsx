import React from 'react';
import Find from './Find';
import Replace from './Replace';
import { Rule, Wrapper } from './styles';
import { TRIGGER_METHOD, DispatchAnalyticsEvent } from '../../analytics/types';
import { MatchCaseProps } from '../types';

export type FindReplaceProps = {
  findText?: string;
  replaceText?: string;
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
  onReplace: ({
    triggerMethod,
    replaceText,
  }: {
    triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
    replaceText: string;
  }) => void;
  onReplaceAll: ({ replaceText }: { replaceText: string }) => void;
  onCancel: ({
    triggerMethod,
  }: {
    triggerMethod:
      | TRIGGER_METHOD.KEYBOARD
      | TRIGGER_METHOD.TOOLBAR
      | TRIGGER_METHOD.BUTTON;
  }) => void;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
} & MatchCaseProps;
class FindReplace extends React.PureComponent<FindReplaceProps> {
  private findTextfield: HTMLInputElement | null = null;
  private replaceTextfield?: HTMLInputElement | null = null;

  setFindTextfieldRef = (
    findTextfieldRef: React.RefObject<HTMLInputElement>,
  ) => {
    this.findTextfield = findTextfieldRef.current;
  };

  setReplaceTextfieldRef = (
    replaceTextfieldRef: React.RefObject<HTMLInputElement>,
  ) => {
    this.replaceTextfield = replaceTextfieldRef.current;
  };

  setFocusToFind = () => {
    if (this.findTextfield) {
      this.findTextfield.focus();
    }
  };

  setFocusToReplace = () => {
    if (this.replaceTextfield) {
      this.replaceTextfield.focus();
    }
  };

  render() {
    const {
      findText,
      count,
      shouldFocus,
      onFind,
      onFindBlur,
      onFindNext,
      onFindPrev,
      onCancel,
      replaceText,
      onReplace,
      onReplaceAll,
      dispatchAnalyticsEvent,
      allowMatchCase,
      shouldMatchCase,
      onToggleMatchCase,
    } = this.props;

    return (
      <Wrapper>
        <Find
          allowMatchCase={allowMatchCase}
          shouldMatchCase={shouldMatchCase}
          onToggleMatchCase={onToggleMatchCase}
          findText={findText}
          count={count}
          shouldFocus={shouldFocus}
          onFind={onFind}
          onFindBlur={onFindBlur}
          onFindPrev={onFindPrev}
          onFindNext={onFindNext}
          onFindTextfieldRefSet={this.setFindTextfieldRef}
          onCancel={onCancel}
          onArrowDown={this.setFocusToReplace}
        />
        <Rule />
        <Replace
          canReplace={count.total > 0}
          replaceText={replaceText}
          onReplace={onReplace}
          onReplaceAll={onReplaceAll}
          onReplaceTextfieldRefSet={this.setReplaceTextfieldRef}
          onArrowUp={this.setFocusToFind}
          dispatchAnalyticsEvent={dispatchAnalyticsEvent}
        />
      </Wrapper>
    );
  }
}

export default FindReplace;
