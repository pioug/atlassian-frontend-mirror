import React, { useCallback, useState } from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';

import { DatePicker } from '@atlaskit/datetime-picker';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Popup from '@atlaskit/popup';
import { R400 } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import {
  type DateRangeOption,
  type DateRangeType,
} from '../../../../common/modal/popup-select/types';

import { dateRangeMessages } from './messages';
import { PopupComponent } from './PopupComponent';
import {
  CustomDateWrapper,
  CustomDropdown,
  CustomDropdownItem,
  DatePickersWrapper,
  DateRangeErrorMessage,
  SelectDateRangeButton,
} from './styled';
import { PopupTrigger } from './trigger';
import {
  getCurrentOptionLabel,
  getDropdownLabel,
  useInvalidDateRange,
} from './utils';

const dateRangeValues = [
  'anyTime',
  'today',
  'yesterday',
  'past7Days',
  'past30Days',
  'pastYear',
  'custom',
] as const;

type DateRangeValue = (typeof dateRangeValues)[number];
const defaultOptionValue: DateRangeValue = 'anyTime';

export type DateRangeSelection = Pick<DateRangeOption, 'value' | 'from' | 'to'>;

interface DateRangeProps {
  onSelectionChange: (options: DateRangeSelection) => void;
  selection?: DateRangeSelection;
}

export const DateRangePicker = ({
  onSelectionChange,
  selection,
}: DateRangeProps) => {
  const { value: selectedValue, from: fromDate, to: toDate } = selection || {};
  const todayDate = new Date().toISOString();

  const { locale, formatMessage, formatDate } = useIntl();

  const [currentOption, setCurrentOption] = useState(selectedValue);
  const [customFromDate, setCustomFromDate] = useState(fromDate);
  const [customToDate, setCustomToDate] = useState(toDate);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const isCustomSelected = currentOption === 'custom';

  const invalidDateRange = useInvalidDateRange(customFromDate, customToDate);

  const handleClickUpdateDateRange = () => {
    onSelectionChange({
      value: 'custom',
      from: customFromDate,
      to: customToDate,
    });
    setIsPickerOpen(false);
  };

  const handleClickFilterOption = useCallback(
    (option: DateRangeType) => {
      setCurrentOption(option);

      onSelectionChange({
        value: option,
      });

      if (option !== 'custom') {
        setIsPickerOpen(false);
      }
    },
    [onSelectionChange],
  );

  const handlePickerToggle = () => {
    if (isPickerOpen) {
      setCustomToDate(toDate);
      setCustomFromDate(fromDate);
      setIsPickerOpen(false);
      return;
    }
    setIsPickerOpen(true);
    return;
  };

  return (
    <Popup
      isOpen={isPickerOpen}
      onClose={handlePickerToggle}
      popupComponent={PopupComponent}
      zIndex={layers.modal()}
      content={() => {
        return (
          <CustomDropdown>
            {dateRangeValues.map(option => (
              <CustomDropdownItem
                key={option}
                // want to show Anytime as selected if none of the other options are selected
                isSelected={
                  selectedValue
                    ? option === selectedValue
                    : option === defaultOptionValue
                }
                onClick={() => handleClickFilterOption(option)}
              >
                {getDropdownLabel(option, formatMessage)}
              </CustomDropdownItem>
            ))}
            {isPickerOpen && isCustomSelected && (
              <CustomDateWrapper>
                <DatePickersWrapper>
                  <DatePicker
                    maxDate={todayDate}
                    innerProps={{ style: { width: 140 } }}
                    testId="date-from-picker"
                    dateFormat="D MMM YYYY"
                    onChange={setCustomFromDate}
                    onDelete={() => setCustomFromDate(undefined)}
                    defaultValue={fromDate}
                    placeholder={formatMessage(dateRangeMessages.dateRangeFrom)}
                    isInvalid={Boolean(invalidDateRange)}
                    locale={locale}
                    selectProps={{
                      styles: {
                        placeholder: (base: any) => ({
                          ...base,
                          width: 'max-content',
                        }),
                      },
                    }}
                  />
                  <FormattedMessage {...dateRangeMessages.dateRangeToLabel} />
                  <DatePicker
                    maxDate={todayDate}
                    innerProps={{ style: { width: 140 } }}
                    testId="date-to-picker"
                    dateFormat="D MMM YYYY"
                    onChange={setCustomToDate}
                    onDelete={() => setCustomToDate(undefined)}
                    defaultValue={toDate}
                    placeholder={formatMessage(dateRangeMessages.dateRangeTo)}
                    isInvalid={Boolean(invalidDateRange)}
                    locale={locale}
                    selectProps={{
                      styles: {
                        placeholder: (base: any) => ({
                          ...base,
                          width: 'max-content',
                        }),
                      },
                    }}
                  />
                </DatePickersWrapper>
                {invalidDateRange && (
                  <DateRangeErrorMessage>
                    <ErrorIcon
                      size="small"
                      primaryColor={token('color.icon.danger', R400)}
                      label="Date range error"
                    />
                    {invalidDateRange}
                  </DateRangeErrorMessage>
                )}
                <SelectDateRangeButton
                  data-testId="custom-date-range-update-button"
                  disabled={Boolean(invalidDateRange)}
                  onClick={handleClickUpdateDateRange}
                >
                  {formatMessage(dateRangeMessages.dateRangeUpdateButton)}
                </SelectDateRangeButton>
              </CustomDateWrapper>
            )}
          </CustomDropdown>
        );
      }}
      placement="bottom-start"
      trigger={triggerProps => {
        const labelText = getCurrentOptionLabel(
          formatDate,
          formatMessage,
          selectedValue,
          toDate,
          fromDate,
        );

        const isSelected = !!selectedValue || isPickerOpen;

        return (
          <PopupTrigger
            triggerProps={triggerProps}
            isSelected={isSelected}
            labelPrefix={formatMessage(dateRangeMessages.dateRangeTitle)}
            selectedLabel={labelText}
            onClick={handlePickerToggle}
          />
        );
      }}
    />
  );
};
