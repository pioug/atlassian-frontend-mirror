import React from 'react';
import ReactDOM from 'react-dom';
import {
  Popup,
  timestampToUTCDate,
  timestampToIsoFormat,
} from '@atlaskit/editor-common';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import Calendar from '@atlaskit/calendar';
import { borderRadius } from '@atlaskit/theme/constants';
import { N60A, N0 } from '@atlaskit/theme/colors';
import withOuterListeners from '../../../../ui/with-outer-listeners';
import { DateType } from '../../types';
import styled from 'styled-components';

const PopupWithListeners = withOuterListeners(Popup);
import { INPUT_METHOD } from '../../../analytics/types/enums';
import { DispatchAnalyticsEvent } from '../../../analytics';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import DatePickerInput from './date-picker-input';

const PopupContentWrapper = styled.div`
  padding: 2px;
  border-radius: ${borderRadius()}px;
  box-shadow: 0 4px 8px -2px ${N60A}, 0 0 1px ${N60A};
  background-color: ${N0};
`;

export interface Props {
  element: HTMLElement | null;
  closeDatePicker: () => void;
  /** Whether the date is newly created, selcting and focusing the input */
  isNew: boolean;
  /** Whether to automatically focus the input */
  autoFocus?: boolean;
  onSelect: (
    date: DateType | null,
    commitMethod: INPUT_METHOD.PICKER | INPUT_METHOD.KEYBOARD,
  ) => void;
  onDelete: () => void;
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
      isNew,
      autoFocus,
    } = this.props;
    const timestamp = element!.getAttribute('timestamp');
    if (this.state === null) {
      // Without this, you can blow up the page by slowing down cpu, opening date, typing after date
      // then clicking on date lozenge and typing quickly before it opens
      return null;
    }
    const { date, selected, latestValidDate } = this.state;
    const { day, month, year } = latestValidDate;
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
              onEmptySubmit={this.handleEmptySubmitDate}
              locale={intl.locale}
              dispatchAnalyticsEvent={dispatchAnalyticsEvent}
              autoFocus={autoFocus}
              autoSelectAll={isNew}
            />
          )}
          <Calendar
            onChange={this.handleOnChange}
            onSelect={(date: DateType) => onSelect(date, INPUT_METHOD.PICKER)}
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

  private handleKeyboardSubmitDate = (date: DateType | null) => {
    this.props.onSelect(date, INPUT_METHOD.KEYBOARD);
  };

  private handleEmptySubmitDate = () => {
    this.props.onDelete();
  };

  private handleOnChange = ({ day, month, year }: CalendarOnChange) => {
    const date: DateType = {
      day,
      month,
      year,
    };
    this.setState({ latestValidDate: date });
  };

  private closeDatePickerWithAnalytics = () => {
    this.props.closeDatePickerWithAnalytics({
      date: this.state.latestValidDate,
    });
  };

  private handleRef = (ref?: HTMLElement | null) => {
    const elm = ref && (ReactDOM.findDOMNode(ref) as HTMLElement);
    if (elm) {
      elm.focus();
    }
  };
}

export default injectIntl(DatePicker);
