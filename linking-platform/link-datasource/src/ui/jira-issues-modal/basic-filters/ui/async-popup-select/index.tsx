import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useIntl } from 'react-intl-next';

import {
  CheckboxOption,
  InputActionMeta,
  PopupSelect,
  ValueType,
} from '@atlaskit/select';

import { useFieldValues } from '../../hooks/useFieldValues';

import CustomControl from './control';
import PopupFooter from './footer';
import formatOptionLabel from './formatOptionLabel';
import { asyncPopupSelectMessages } from './messages';
import PopupTrigger from './trigger';
import { BasicFilterFieldType, SelectOption } from './types';

export interface AsyncPopupSelectProps {
  filterType: BasicFilterFieldType;
  selection: SelectOption[];
  onSelectionChange?: (selection: SelectOption[]) => void;
}

// Needed to disable filtering from react-select
const noFilterOptions = () => true;

const AsyncPopupSelect = ({
  filterType,
  selection,
  onSelectionChange = () => {},
}: AsyncPopupSelectProps) => {
  const { formatMessage } = useIntl();

  const pickerRef = useRef<PopupSelect<SelectOption, true>>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedOptions, setSelectedOptions] =
    useState<ValueType<SelectOption, true>>(selection);

  const { filterOptions, fetchFilterOptions, totalCount, status } =
    useFieldValues({
      filterType,
    });

  const handleInputChange = useCallback(
    (searchString: string, actionMeta: InputActionMeta) => {
      if (actionMeta.action === 'input-change' && searchString !== searchTerm) {
        setSearchTerm(searchString);
      }
    },
    [searchTerm],
  );

  const handleOptionSelection = (newValue: ValueType<SelectOption, true>) => {
    setSelectedOptions(newValue);
    onSelectionChange(newValue as SelectOption[]);
  };

  const handleOpenPopup = useCallback(async () => {
    if (status === 'empty') {
      fetchFilterOptions();
    }
  }, [fetchFilterOptions, status]);

  useEffect(() => {
    if (status === 'resolved') {
      // necessary to refocus the search input after the loading state
      pickerRef?.current?.selectRef?.inputRef?.focus();
    }
  }, [status]);

  return (
    <PopupSelect<SelectOption, true>
      isMulti
      maxMenuWidth={300}
      minMenuWidth={300}
      ref={pickerRef}
      testId="jlol-basic-filter-popup-select"
      inputId="jlol-basic-filter-popup-select--input"
      searchThreshold={0}
      inputValue={searchTerm}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      isLoading={status === 'loading'}
      placeholder={formatMessage(asyncPopupSelectMessages.selectPlaceholder)}
      components={{
        /* @ts-expect-error - This component has stricter OptionType, hence a temp setup untill its made generic */
        Option: CheckboxOption,
        Control: CustomControl,
      }}
      options={filterOptions}
      value={selectedOptions}
      filterOption={noFilterOptions}
      formatOptionLabel={formatOptionLabel}
      onChange={handleOptionSelection}
      onInputChange={handleInputChange}
      target={({ isOpen, ...triggerProps }) => (
        <PopupTrigger
          {...triggerProps}
          filterType={filterType}
          isSelected={isOpen}
          onClick={handleOpenPopup}
        />
      )}
      footer={
        <PopupFooter
          currentDisplayCount={filterOptions.length}
          totalCount={totalCount}
        />
      }
    />
  );
};

export default AsyncPopupSelect;
