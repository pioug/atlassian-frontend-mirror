/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/* eslint-disable @atlaskit/design-system/prefer-primitives */
/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import type {
  DispatchAnalyticsEvent,
  TRIGGER_METHOD,
} from '@atlaskit/editor-common/analytics';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type { MatchCaseProps } from '../types';

import Find from './Find';
import Replace from './Replace';
import { ruleStyles, wrapperPaddingStyles, wrapperStyles } from './styles';

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
  focusToolbarButton?: () => void;
} & MatchCaseProps;
// eslint-disable-next-line @repo/internal/react/no-class-components
class FindReplace extends React.PureComponent<FindReplaceProps> {
  private findTextfield: HTMLInputElement | null = null;
  private replaceTextfield?: HTMLInputElement | null = null;
  private modalRef: React.RefObject<HTMLDivElement>;

  constructor(props: FindReplaceProps) {
    super(props);
    this.modalRef = React.createRef();
  }

  componentDidMount() {
    if (getBooleanFF('platform.editor.a11y-find-replace')) {
      // eslint-disable-next-line
      window.addEventListener('keydown', this.handleTabNavigation);
    }
  }

  componentWillUnmount() {
    if (getBooleanFF('platform.editor.a11y-find-replace')) {
      // eslint-disable-next-line
      window.removeEventListener('keydown', this.handleTabNavigation);
    }
  }

  handleTabNavigation = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const modalFindReplace = this.modalRef.current as HTMLDivElement | null;

      if (
        !modalFindReplace ||
        !modalFindReplace.contains(document.activeElement)
      ) {
        return;
      }

      const focusableElements = Array.from(
        modalFindReplace.querySelectorAll<HTMLElement>(
          '[tabindex]:not([tabindex="-1"]), input, button',
        ),
      ).filter((el: HTMLElement) => el.getAttribute('tabindex') !== '-1');

      const currentIndex = focusableElements.findIndex(
        el => el === document.activeElement,
      );
      const isShiftPressed = event.shiftKey;

      if (isShiftPressed) {
        const prevIndex =
          (currentIndex - 1 + focusableElements.length) %
          focusableElements.length;
        focusableElements[prevIndex].focus();
      } else {
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex].focus();
      }
    }
  };

  state = { findTyped: false };

  setFindTyped = (value: boolean) => {
    if (getBooleanFF('platform.editor.a11y-find-replace')) {
      this.setState({ findTyped: value });
    }
  };

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

    const focusToolbarButton = getBooleanFF('platform.editor.a11y-find-replace')
      ? this.props.focusToolbarButton || (() => {})
      : () => {};

    return (
      <div
        ref={this.modalRef}
        css={
          getBooleanFF('platform.editor.a11y-find-replace')
            ? [wrapperStyles, wrapperPaddingStyles]
            : wrapperStyles
        }
      >
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
          findTyped={this.state.findTyped}
          setFindTyped={this.setFindTyped}
        />
        {!getBooleanFF('platform.editor.a11y-find-replace') && (
          <hr css={ruleStyles} id="replace-hr-element" />
        )}
        <Replace
          canReplace={count.total > 0}
          replaceText={replaceText}
          onReplace={onReplace}
          onReplaceAll={onReplaceAll}
          onReplaceTextfieldRefSet={this.setReplaceTextfieldRef}
          onArrowUp={this.setFocusToFind}
          onCancel={onCancel}
          count={count}
          onFindPrev={onFindPrev}
          onFindNext={onFindNext}
          dispatchAnalyticsEvent={dispatchAnalyticsEvent}
          findTyped={this.state.findTyped}
          setFindTyped={this.setFindTyped}
          focusToolbarButton={focusToolbarButton}
        />
      </div>
    );
  }
}

export default FindReplace;
