/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/** @jsx jsx */
import React, { Fragment } from 'react';

import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import LegacyButton from '@atlaskit/button/standard-button';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  TRIGGER_METHOD,
} from '@atlaskit/editor-common/analytics';
import { findReplaceMessages as messages } from '@atlaskit/editor-common/messages';
import { Label, ValidMessage } from '@atlaskit/form';
import ChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Inline, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';

import { FindReplaceTooltipButton } from './FindReplaceTooltipButton';
import {
  NextPreviousItem,
  orderOneStyles,
  orderZeroStyles,
  replaceSectionButtonStyles,
  sectionWrapperJustified,
  sectionWrapperStyles,
  sectionWrapperStylesAlternate,
  textFieldWrapper,
} from './styles';

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
  onCancel: ({
    triggerMethod,
  }: {
    triggerMethod:
      | TRIGGER_METHOD.KEYBOARD
      | TRIGGER_METHOD.TOOLBAR
      | TRIGGER_METHOD.BUTTON;
  }) => void;
  count: { index: number; total: number };
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
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  setFindTyped: (value: boolean) => void;
  findTyped: boolean;
  focusToolbarButton: () => void;
};

export type ReplaceState = {
  replaceText: string;
  fakeSuccessReplacementMessageUpdate: boolean;
  isComposing: boolean;
  isHelperMessageVisible: boolean;
  replaceCount: number;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
class Replace extends React.PureComponent<
  ReplaceProps & WrappedComponentProps,
  ReplaceState
> {
  state: ReplaceState;

  private replaceTextfieldRef = React.createRef<HTMLInputElement>();
  private successReplacementMessageRef = React.createRef<HTMLInputElement>();
  private isComposing = false;
  private closeFindReplaceDialog: string;
  private replaceWith: string;
  private replace: string;
  private replaceAll: string;
  private findNext: string;
  private findPrevious: string;
  private findNextIcon: JSX.Element;
  private findPrevIcon: JSX.Element;

  constructor(props: ReplaceProps & WrappedComponentProps) {
    super(props);

    const {
      replaceText,
      intl: { formatMessage },
    } = props;

    this.state = {
      replaceText: replaceText || '',
      isComposing: false,
      isHelperMessageVisible: false,
      fakeSuccessReplacementMessageUpdate: false,
      replaceCount: 0,
    };

    this.replaceWith = formatMessage(messages.replaceWith);
    this.replace = formatMessage(messages.replace);
    this.replaceAll = formatMessage(messages.replaceAll);
    this.findNext = formatMessage(messages.findNext);
    this.findPrevious = formatMessage(messages.findPrevious);
    this.findNextIcon = <ChevronDownIcon label={this.findNext} />;
    this.findPrevIcon = <ChevronUpIcon label={this.findPrevious} />;
    this.closeFindReplaceDialog = formatMessage(
      messages.closeFindReplaceDialog,
    );
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
    if (getBooleanFF('platform.editor.a11y-find-replace')) {
      const findTextField = document.getElementById('find-text-field');
      const replaceButton = document.getElementById('replace-button');
      const replaceAllButton = document.getElementById('replaceAll-button');

      if (
        (replaceButton?.tabIndex === -1 || replaceAllButton?.tabIndex === -1) &&
        findTextField
      ) {
        findTextField.focus();
      }
    }
  }

  skipWhileComposing = (fn: Function) => {
    if (this.state.isComposing) {
      return;
    }
    fn();
  };

  triggerSuccessReplacementMessageUpdate(currentReplaceCount: number) {
    if (this.state?.replaceCount === currentReplaceCount) {
      this.setState({
        fakeSuccessReplacementMessageUpdate:
          !this.state.fakeSuccessReplacementMessageUpdate,
      });
    }
    if (
      this.successReplacementMessageRef &&
      this.successReplacementMessageRef.current
    ) {
      const ariaLiveRegion =
        this.successReplacementMessageRef.current.querySelector(
          '[aria-live="polite"]',
        );
      ariaLiveRegion?.removeAttribute('aria-live');
      ariaLiveRegion?.setAttribute('aria-live', 'polite');
    }
  }

  handleReplaceClick = () =>
    this.skipWhileComposing(() => {
      this.props.onReplace({
        triggerMethod: TRIGGER_METHOD.BUTTON,
        replaceText: this.state.replaceText,
      });
      // for replace button replaceCount always 1;
      const replaceCount = 1;
      this.triggerSuccessReplacementMessageUpdate(replaceCount);
      this.setState({ isHelperMessageVisible: true, replaceCount });
      this.props.setFindTyped(false);
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
      this.setState({ isHelperMessageVisible: true });
      this.triggerSuccessReplacementMessageUpdate(this.props.count.total);
      this.setState({ replaceCount: this.props.count.total });
      this.props.setFindTyped(false);
    });

  handleCompositionStart = () => {
    this.setState({ isComposing: true });
  };

  handleCompositionEnd = (event: React.CompositionEvent<HTMLInputElement>) => {
    this.setState({ isComposing: false });
    // type for React.CompositionEvent doesn't set type for target correctly
    this.updateReplaceValue((event.target as HTMLInputElement).value);
  };

  clearSearch = () => {
    this.props.onCancel({ triggerMethod: TRIGGER_METHOD.BUTTON });
    this.props.focusToolbarButton && this.props.focusToolbarButton();
  };

  handleFindNextClick = () => {
    if (this.isComposing) {
      return;
    }
    this.props.onFindNext({ triggerMethod: TRIGGER_METHOD.BUTTON });
  };

  handleFindPrevClick = () => {
    if (this.isComposing) {
      return;
    }
    this.props.onFindPrev({ triggerMethod: TRIGGER_METHOD.BUTTON });
  };

  render() {
    const { replaceText, isHelperMessageVisible, replaceCount } = this.state;
    const {
      canReplace,
      count,
      intl: { formatMessage },
    } = this.props;

    const resultsReplace = formatMessage(messages.replaceSuccess, {
      numberOfMatches: replaceCount,
    });

    return getBooleanFF('platform.editor.a11y-find-replace') ? (
      <Fragment>
        <div css={[sectionWrapperStyles, sectionWrapperStylesAlternate]}>
          <div css={textFieldWrapper}>
            <Label htmlFor="replace-text-field">Replace with</Label>
            <Textfield
              name="replace"
              id="replace-text-field"
              appearance="standard"
              defaultValue={replaceText}
              ref={this.replaceTextfieldRef}
              autoComplete="off"
              onChange={this.handleReplaceChange}
              onKeyDown={this.handleReplaceKeyDown}
              onCompositionStart={this.handleCompositionStart}
              onCompositionEnd={this.handleCompositionEnd}
            />

            {isHelperMessageVisible && this.props.findTyped === false && (
              <div ref={this.successReplacementMessageRef}>
                <ValidMessage testId="message-success-replacement">
                  {
                    /*
                    Replacement needed to trigger the SR announcement if message hasn't changed. e.g Replace button clicked twice.
                    '\u00a0' is value for &nbsp
                    */
                    this.state.fakeSuccessReplacementMessageUpdate
                      ? resultsReplace.replace(/ /, '\u00a0')
                      : resultsReplace
                  }
                </ValidMessage>
              </div>
            )}
          </div>
        </div>
        <div
          css={[
            sectionWrapperStyles,
            sectionWrapperStylesAlternate,
            sectionWrapperJustified,
          ]}
        >
          <div css={orderOneStyles}>
            <div css={NextPreviousItem}>
              <FindReplaceTooltipButton
                title={this.findNext}
                icon={this.findNextIcon}
                newIcon={ChevronDownIcon}
                iconLabel={this.findNext}
                keymapDescription={'Enter'}
                onClick={this.handleFindNextClick}
                disabled={count.total <= 1}
              />
            </div>
            <div css={NextPreviousItem}>
              <FindReplaceTooltipButton
                title={this.findPrevious}
                icon={this.findPrevIcon}
                newIcon={ChevronUpIcon}
                iconLabel={this.findPrevious}
                keymapDescription={'Shift Enter'}
                onClick={this.handleFindPrevClick}
                disabled={count.total <= 1}
              />
            </div>
            {getBooleanFF(
              'platform.design-system-team.editor-new-button_jjjdo',
            ) ? (
              <Inline
                space="space.075"
                xcss={xcss({
                  paddingInlineStart: 'space.050',
                  paddingInlineEnd: 'space.025',
                })}
              >
                <Button
                  testId={this.replace}
                  id="replace-button"
                  onClick={this.handleReplaceClick}
                  isDisabled={!canReplace}
                >
                  {this.replace}
                </Button>
                <Button
                  appearance="primary"
                  testId={this.replaceAll}
                  id="replaceAll-button"
                  onClick={this.handleReplaceAllClick}
                  isDisabled={!canReplace}
                >
                  {this.replaceAll}
                </Button>
              </Inline>
            ) : (
              <Fragment>
                <LegacyButton
                  css={replaceSectionButtonStyles}
                  testId={this.replace}
                  id="replace-button"
                  onClick={this.handleReplaceClick}
                  isDisabled={!canReplace}
                >
                  {this.replace}
                </LegacyButton>
                <LegacyButton
                  css={replaceSectionButtonStyles}
                  appearance="primary"
                  testId={this.replaceAll}
                  id="replaceAll-button"
                  onClick={this.handleReplaceAllClick}
                  isDisabled={!canReplace}
                >
                  {this.replaceAll}
                </LegacyButton>
              </Fragment>
            )}
          </div>
          <div css={orderZeroStyles}>
            {getBooleanFF(
              'platform.design-system-team.editor-new-button_jjjdo',
            ) ? (
              <Button
                appearance="subtle"
                testId={this.closeFindReplaceDialog}
                onClick={this.clearSearch}
              >
                {this.closeFindReplaceDialog}
              </Button>
            ) : (
              <LegacyButton
                css={replaceSectionButtonStyles}
                appearance="subtle"
                testId={this.closeFindReplaceDialog}
                onClick={this.clearSearch}
              >
                {this.closeFindReplaceDialog}
              </LegacyButton>
            )}
          </div>
        </div>
      </Fragment>
    ) : (
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
        {getBooleanFF('platform.design-system-team.editor-new-button_jjjdo') ? (
          <Inline space="space.050">
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
          </Inline>
        ) : (
          <Fragment>
            <LegacyButton
              css={replaceSectionButtonStyles}
              testId={this.replace}
              onClick={this.handleReplaceClick}
              isDisabled={!canReplace}
            >
              {this.replace}
            </LegacyButton>
            <LegacyButton
              css={replaceSectionButtonStyles}
              testId={this.replaceAll}
              onClick={this.handleReplaceAllClick}
              isDisabled={!canReplace}
            >
              {this.replaceAll}
            </LegacyButton>
          </Fragment>
        )}
      </div>
    );
  }
}

export default injectIntl(Replace);
