import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useIntl } from 'react-intl-next';
import { useDebouncedCallback } from 'use-debounce';

import {
  CheckboxOption,
  InputActionMeta,
  PopupSelect,
  ValueType,
} from '@atlaskit/select';

import { useFilterOptions } from '../../hooks/useFilterOptions';
import { BasicFilterFieldType, SelectOption } from '../../types';
import CustomMenuList from '../menu-list';

import CustomControl from './control';
import CustomDropdownIndicator from './dropdownIndicator';
import PopupFooter from './footer';
import formatOptionLabel from './formatOptionLabel';
import { asyncPopupSelectMessages } from './messages';
import PopupTrigger from './trigger';

export interface AsyncPopupSelectProps {
  filterType: BasicFilterFieldType;
  cloudId: string;
  selection: SelectOption[];
  onSelectionChange?: (selection: SelectOption[]) => void;
  isDisabled?: boolean;
}

// Needed to disable filtering from react-select
const noFilterOptions = () => true;

export const SEARCH_DEBOUNCE_MS = 350;

const AsyncPopupSelect = ({
  filterType,
  cloudId,
  selection,
  onSelectionChange = () => {},
  isDisabled = false,
}: AsyncPopupSelectProps) => {
  const { formatMessage } = useIntl();

  const pickerRef = useRef<PopupSelect<SelectOption, true>>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedOptions, setSelectedOptions] =
    useState<ValueType<SelectOption, true>>(selection);

  const { filterOptions, fetchFilterOptions, totalCount, status, pageCursor } =
    useFilterOptions({
      filterType,
      cloudId,
    });

  const [handleDebouncedFetchFilterOptions] = useDebouncedCallback(
    (searchString: string) => {
      fetchFilterOptions({
        searchString,
      });
    },
    SEARCH_DEBOUNCE_MS,
  );

  const handleInputChange = useCallback(
    async (newSearchTerm: string, actionMeta: InputActionMeta) => {
      if (
        actionMeta.action === 'input-change' &&
        newSearchTerm !== searchTerm
      ) {
        setSearchTerm(newSearchTerm);
        handleDebouncedFetchFilterOptions(newSearchTerm);
      }
    },
    [handleDebouncedFetchFilterOptions, searchTerm],
  );

  const handleOptionSelection = (newValue: ValueType<SelectOption, true>) => {
    setSelectedOptions(newValue);
    onSelectionChange(newValue as SelectOption[]);
  };

  const handleOpenPopup = useCallback(() => {
    if (status === 'empty' || status === 'rejected') {
      // if user searches and gets status as rejected, we want the dropdown to try load the request with searchString when the user reopens the dropdown
      fetchFilterOptions({
        searchString: searchTerm,
      });
    }
  }, [fetchFilterOptions, searchTerm, status]);

  const handleShowMore = useCallback(() => {
    if (pageCursor) {
      fetchFilterOptions({
        pageCursor,
        searchString: searchTerm,
      });
    }
  }, [fetchFilterOptions, pageCursor, searchTerm]);

  useEffect(() => {
    if (status === 'resolved') {
      // necessary to refocus the search input after the loading state
      pickerRef?.current?.selectRef?.inputRef?.focus();
    }
  }, [status]);

  const filterOptionsLength = filterOptions.length;

  const isError = status === 'rejected';
  const isLoading = status === 'loading' || status === 'empty';
  const isLoadingMore = status === 'loadingMore';
  const isEmpty = status === 'resolved' && filterOptionsLength === 0;
  const areAllResultsLoaded = filterOptions.length === totalCount;

  const shouldShowFooter =
    (status === 'resolved' || isLoadingMore) && filterOptions.length > 0; // footer should not disappear when there is an inline spinner for loading more data
  const shouldDisplayShowMoreButton =
    status === 'resolved' && !!pageCursor && !areAllResultsLoaded;

  const options = isLoading || isError ? [] : filterOptions; // if not set to [], for eg: on loading, no loading UI will be shown

  return (
    <PopupSelect<SelectOption, true>
      isMulti
      maxMenuWidth={300}
      minMenuWidth={300}
      ref={pickerRef}
      testId="jlol-basic-filter-popup-select"
      inputId="jlol-basic-filter-popup-select--input"
      /*
        this threshold controls the display of the search control (input field for search)
        if this threshold is less than 0, when typing a search string that returns no results it will not remove the search control
        if this threshold is 0 or higher, it will remove the search control when there are no results, the user will be unable to clear the search to see more results
      */
      searchThreshold={-1}
      inputValue={searchTerm}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      isLoading={isLoading}
      placeholder={formatMessage(asyncPopupSelectMessages.selectPlaceholder)}
      components={{
        /* @ts-expect-error - This component has stricter OptionType, hence a temp setup untill its made generic */
        Option: CheckboxOption,
        Control: CustomControl,
        MenuList: props => (
          <CustomMenuList
            {...props}
            filterType={filterType}
            isError={isError}
            isEmpty={isEmpty}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            showMore={shouldDisplayShowMoreButton}
            handleShowMore={handleShowMore}
          />
        ),
        DropdownIndicator: CustomDropdownIndicator,
        LoadingIndicator: undefined, // disables the three ... indicator in the searchbox when picker is loading
        IndicatorSeparator: undefined, // disables the | separator between search input and icon
      }}
      options={options}
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
          isDisabled={isDisabled}
        />
      )}
      footer={
        shouldShowFooter && (
          <PopupFooter
            currentDisplayCount={filterOptionsLength}
            totalCount={totalCount}
          />
        )
      }
    />
  );
};

export default AsyncPopupSelect;
