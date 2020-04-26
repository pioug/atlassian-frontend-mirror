import React from 'react';
import ReactDOM from 'react-dom';
import {
  Popup,
  timestampToUTCDate,
  timestampToIsoFormat,
  akEditorFloatingDialogZIndex,
} from '@atlaskit/editor-common';
import Calendar from '@atlaskit/calendar';
import { colors, borderRadius } from '@atlaskit/theme';
import withOuterListeners from '../../../../ui/with-outer-listeners';
import { DateType } from '../../types';
import TextField from '@atlaskit/textfield';
import { FormEvent } from 'react';
import styled from 'styled-components';

const PopupWithListeners = withOuterListeners(Popup);
import { findDateSegmentByPosition, adjustDate } from '../../utils/internal';
import { parseDateType, formatDateType } from '../../utils/formatParse';
import {
  EVENT_TYPE,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  INPUT_METHOD,
} from '../../../analytics/types/enums';
import { DispatchAnalyticsEvent } from '../../../analytics';
import { injectIntl, InjectedIntlProps } from 'react-intl';

const PopupContentWrapper = styled.div`
  padding: ${borderRadius()}px;
  border-radius: ${borderRadius()}px;
  box-shadow: 0 4px 8px -2px ${colors.N60A}, 0 0 1px ${colors.N60A};
  background-color: ${colors.N0};
`;

const DateTextFieldWrapper = styled.div`
  padding: 16px 22px 12px;
`;

export interface Props {
  element: HTMLElement | null;
  closeDatePicker: () => void;
  onSelect: (
    date: DateType,
    commitMethod: INPUT_METHOD.PICKER | INPUT_METHOD.KEYBOARD,
  ) => void;
  mountTo?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  closeDatePickerWithAnalytics: ({ date }: { date?: DateType }) => void;
  onTextChanged: (date: DateType) => void;
  showTextField?: boolean;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
}

export interface State {
  date: DateType;
  selected: Array<string>;
  setInputSelectionPos?: number;
  latestValidDate: DateType;
}

type CalendarOnChange = {
  day: number;
  month: number;
  year: number;
};

export interface InputProps {
  intl: ReactIntl.InjectedIntl;
  date: DateType;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  onNewDate: (date: DateType) => void;
  onSubmitDate: (date: DateType | undefined) => void;
}

export interface InputState {
  inputText: string;
}

class DatePickerInput extends React.Component<InputProps, InputState> {
  private inputRef: any;
  private setInputSelectionPos: number | undefined;
  private autofocusTimeout: number | undefined;

  constructor(props: InputProps) {
    super(props);
    const { date } = props;
    this.setInputSelectionPos = undefined;
    const inputText = formatDateType(date, this.props.intl.locale);
    this.state = {
      inputText,
    };
  }

  render() {
    return (
      <DateTextFieldWrapper>
        <TextField
          name="datetextfield"
          value={this.state.inputText}
          ref={this.handleInputRef}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          onKeyDown={this.handleKeyDown}
          spellCheck={false}
          autoComplete="off"
        />
      </DateTextFieldWrapper>
    );
  }

  componentDidUpdate() {
    const setInputSelectionPos = this.setInputSelectionPos;
    if (setInputSelectionPos !== undefined) {
      this.inputRef.setSelectionRange(
        setInputSelectionPos,
        setInputSelectionPos,
      );
      this.setInputSelectionPos = undefined;
    }
  }

  componentWillUnmount() {
    if (this.autofocusTimeout !== undefined) {
      clearTimeout(this.autofocusTimeout);
    }
  }
  private handleChange = (evt: FormEvent<HTMLInputElement>) => {
    const textFieldValue: string = (evt.target as HTMLInputElement).value;
    const { intl, dispatchAnalyticsEvent } = this.props;

    const newDate: DateType | undefined = parseDateType(
      textFieldValue,
      intl.locale,
    );
    if (newDate !== undefined) {
      this.setState({
        inputText: textFieldValue,
      });
      this.props.onNewDate(newDate);
      if (dispatchAnalyticsEvent) {
        dispatchAnalyticsEvent({
          eventType: EVENT_TYPE.TRACK,
          action: ACTION.TYPING_FINISHED,
          actionSubject: ACTION_SUBJECT.DATE,
        });
      }
    } else {
      // if invalid, just update state text (to rerender textfield)
      this.setState({
        inputText: textFieldValue,
      });
    }
  };

  private handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { intl, dispatchAnalyticsEvent } = this.props;
    const textFieldValue: string = (event.target as HTMLInputElement).value;

    // Fire event on every keypress (textfield not necessarily empty)
    if (
      dispatchAnalyticsEvent &&
      event.key !== 'Enter' &&
      event.key !== 'Backspace'
    ) {
      dispatchAnalyticsEvent({
        eventType: EVENT_TYPE.TRACK,
        action: ACTION.TYPING_STARTED,
        actionSubject: ACTION_SUBJECT.DATE,
      });
    }
    if (event.key === 'Enter') {
      const newDate: DateType | undefined = parseDateType(
        textFieldValue,
        intl.locale,
      );

      if (newDate === undefined) {
        // not a blur event so don't call withAnalytics version of closeDatePicker
        this.props.onSubmitDate(undefined);
        return;
      }

      this.props.onSubmitDate(newDate);
    }
  };

  // arrow keys are only triggered by onKeyDown, not onKeyPress
  private handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const dateString: string = (event.target as HTMLInputElement).value;
    const { locale } = this.props.intl;
    let adjustment: number | undefined;
    if (event.key === 'ArrowUp') {
      adjustment = 1;
    } else if (event.key === 'ArrowDown') {
      adjustment = -1;
    }
    if (adjustment === undefined) {
      return;
    }

    const { dispatchAnalyticsEvent } = this.props;
    const cursorPos = this.inputRef.selectionStart;
    const activeSegment = findDateSegmentByPosition(
      cursorPos,
      dateString,
      locale,
    );
    if (activeSegment === undefined) {
      return;
    }

    let dateSegment:
      | ACTION_SUBJECT_ID.DATE_DAY
      | ACTION_SUBJECT_ID.DATE_MONTH
      | ACTION_SUBJECT_ID.DATE_YEAR;
    switch (activeSegment) {
      case 'day':
        dateSegment = ACTION_SUBJECT_ID.DATE_DAY;
        break;
      case 'month':
        dateSegment = ACTION_SUBJECT_ID.DATE_MONTH;
        break;
      default:
        dateSegment = ACTION_SUBJECT_ID.DATE_YEAR;
    }
    if (dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        eventType: EVENT_TYPE.TRACK,
        action: adjustment > 0 ? ACTION.INCREMENTED : ACTION.DECREMENTED,
        actionSubject: ACTION_SUBJECT.DATE_SEGMENT,
        attributes: { dateSegment },
      });
    }

    const newDateType = adjustDate(
      dateString,
      activeSegment,
      adjustment,
      locale,
    );
    if (newDateType === undefined) {
      return;
    }

    this.setState({
      inputText: formatDateType(newDateType, locale),
    });
    this.props.onNewDate(newDateType);
    this.setInputSelectionPos = Math.min(cursorPos, dateString.length);
    event.preventDefault();
  };
  private handleInputRef = (ref?: HTMLInputElement) => {
    if (ref) {
      this.inputRef = ref;
      // Defer to prevent editor scrolling to top (See FS-3227, also ED-2992)
      this.autofocusTimeout = setTimeout(() => {
        ref.focus();
      });
    }
  };
}

class DatePicker extends React.Component<Props & InjectedIntlProps, State> {
  constructor(props: Props & InjectedIntlProps) {
    super(props);
    const timestamp = props.element!.getAttribute('timestamp');
    if (timestamp) {
      // Warning: The 'Date' return type of timestampToUTCDate() is not a JS date, it's more similar
      // to the DateType type
      const { day, month, year } = timestampToUTCDate(timestamp);
      const date: DateType = {
        day,
        month,
        year,
      };
      this.state = {
        selected: [timestampToIsoFormat(timestamp)],
        date,
        latestValidDate: date,
      };
    }
  }

  render() {
    const {
      element,
      onSelect,
      mountTo,
      boundariesElement,
      scrollableElement,
      showTextField,
      intl,
      dispatchAnalyticsEvent,
    } = this.props;
    const timestamp = element!.getAttribute('timestamp');
    if (this.state === null) {
      // Without this, you can blow up the page by slowing down cpu, opening date, typing after date
      // then clicking on date lozenge and typing quickly before it opens
      return null;
    }
    const { date, selected } = this.state;
    const { day, month, year } = date;
    if (!timestamp) {
      return null;
    }
    return (
      <PopupWithListeners
        target={element!}
        offset={[0, 8]}
        fitHeight={327}
        fitWidth={340}
        handleClickOutside={this.closeDatePickerWithAnalytics}
        handleEscapeKeydown={this.closeDatePickerWithAnalytics}
        zIndex={akEditorFloatingDialogZIndex}
        mountTo={mountTo}
        boundariesElement={boundariesElement}
        scrollableElement={scrollableElement}
      >
        <PopupContentWrapper>
          {showTextField === true && (
            <DatePickerInput
              date={date}
              onNewDate={this.handleNewDate}
              onSubmitDate={this.handleKeyboardSubmitDate}
              intl={intl}
              dispatchAnalyticsEvent={dispatchAnalyticsEvent}
            />
          )}
          <Calendar
            onChange={this.handleOnChange}
            onSelect={date => onSelect(date, INPUT_METHOD.PICKER)}
            day={day}
            month={month}
            year={year}
            selected={selected}
            ref={this.handleRef}
          />
        </PopupContentWrapper>
      </PopupWithListeners>
    );
  }
  private handleNewDate = (date: DateType) => {
    this.props.onTextChanged(date);
    this.setState({
      latestValidDate: date,
    });
  };

  private handleKeyboardSubmitDate = (date: DateType | undefined) => {
    if (date !== undefined) {
      this.props.onSelect(date, INPUT_METHOD.KEYBOARD);
    }
  };

  private handleOnChange = ({ day, month, year }: CalendarOnChange) => {
    const date: DateType = {
      day,
      month,
      year,
    };
    this.setState({ date });
  };

  private closeDatePickerWithAnalytics = () => {
    this.props.closeDatePickerWithAnalytics({
      date: this.state.latestValidDate,
    });
  };

  private handleRef = (ref?: HTMLElement) => {
    const elm = ref && (ReactDOM.findDOMNode(ref) as HTMLElement);
    if (elm) {
      elm.focus();
    }
  };
}

export default injectIntl(DatePicker);
