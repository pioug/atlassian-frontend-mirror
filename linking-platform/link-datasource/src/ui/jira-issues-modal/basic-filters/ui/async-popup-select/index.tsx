import React, { useCallback, useEffect, useRef, useState } from 'react';

import isEqual from 'lodash/isEqual';
import { useIntl } from 'react-intl-next';
import { useDebouncedCallback } from 'use-debounce';

import {
  CheckboxOption,
  InputActionMeta,
  PopupSelect,
  ValueType,
} from '@atlaskit/select';

import { useDatasourceAnalyticsEvents } from '../../../../../analytics';
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
  onReset?: () => void;
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
  onReset: resetSelection = () => {},
  isDisabled = false,
}: AsyncPopupSelectProps) => {
  const { formatMessage } = useIntl();
  const { fireEvent } = useDatasourceAnalyticsEvents();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptions, setSelectedOptions] =
    useState<ValueType<SelectOption, true>>(selection);
  const [sortedOptions, setSortedOptions] = useState<readonly SelectOption[]>(
    [],
  );

  const currentSiteCloudId = useRef<string>(cloudId);
  const sortPaginatedResults = useRef(false); // this is to track pagination for sorting purpose

  const {
    filterOptions,
    fetchFilterOptions,
    totalCount,
    status,
    pageCursor,
    reset: resetHook,
    errors,
  } = useFilterOptions({
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

  const handleOptionSelection = useCallback(
    (newValue: ValueType<SelectOption, true>) => {
      onSelectionChange(newValue as SelectOption[]);
    },
    [onSelectionChange],
  );

  const sortOptionsOnPopupOpen = useCallback(() => {
    if (selectedOptions.length === 0) {
      return setSortedOptions(filterOptions);
    }

    const nonSelectedOptions = filterOptions.filter(
      option =>
        !selectedOptions.find(
          selectedOption => selectedOption.value === option.value,
        ),
    );

    const newOptions = [...selectedOptions, ...nonSelectedOptions];

    if (!isEqual(newOptions, sortedOptions)) {
      setSortedOptions(newOptions);
    }
  }, [selectedOptions, filterOptions, sortedOptions]);

  const sortOptionsOnResolve = useCallback(() => {
    // sortedOptions is empty initially, this will take care of setting the initial value and bring the selected items to the top
    if (sortedOptions.length === 0) {
      return sortOptionsOnPopupOpen();
    }

    // when the user is searching, we want the search result to be displayed as it is, and the select component will take care of marking the selected items
    if (searchTerm) {
      sortPaginatedResults.current = false; // set to false to indicate pagination resolve action is completed from the sorting perspective
      return setSortedOptions(filterOptions);
    }

    // this block handles the pagination, where on pagination, we will just append newOptions to the current list
    if (sortPaginatedResults.current) {
      const newOptions = filterOptions.filter(
        option =>
          !sortedOptions.find(
            sortedOption => sortedOption.value === option.value,
          ),
      );
      if (newOptions.length > 0) {
        setSortedOptions([...sortedOptions, ...newOptions]);
      }

      sortPaginatedResults.current = false; // set to false to indicate pagination resolve action is completed from the sorting perspective
      return;
    }

    sortPaginatedResults.current = false; // set to false to indicate pagination resolve action is completed from the sorting perspective
    sortOptionsOnPopupOpen();
  }, [filterOptions, searchTerm, sortOptionsOnPopupOpen, sortedOptions]);

  const handleShowMore = useCallback(() => {
    if (pageCursor) {
      sortPaginatedResults.current = true;
      fetchFilterOptions({
        pageCursor,
        searchString: searchTerm,
      });
    }
  }, [fetchFilterOptions, pageCursor, searchTerm]);

  const handleMenuOpen = useCallback(() => {
    if (status === 'empty' || status === 'rejected') {
      // if user searches and gets status as rejected, we want the dropdown to try load the request with searchString when the user reopens the dropdown
      fetchFilterOptions({
        searchString: searchTerm,
      });
    } else if (status === 'resolved') {
      sortOptionsOnPopupOpen();
    }

    fireEvent('ui.dropdown.opened.basicSearchDropdown', {
      filterType,
      selectionCount: selectedOptions.length,
    });
  }, [
    fetchFilterOptions,
    filterType,
    fireEvent,
    searchTerm,
    selectedOptions.length,
    sortOptionsOnPopupOpen,
    status,
  ]);

  const handleMenuClose = useCallback(() => {
    fireEvent('ui.dropdown.closed.basicSearchDropdown', {
      filterType,
      selectionCount: selectedOptions.length,
    });
  }, [filterType, fireEvent, selectedOptions.length]);

  useEffect(() => {
    if (status === 'resolved') {
      sortOptionsOnResolve();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]); // we only want the sortOptionsOnResolve to run when there is a status change

  useEffect(() => {
    if (currentSiteCloudId.current !== cloudId) {
      currentSiteCloudId.current = cloudId;
      setSortedOptions([]);
      setSearchTerm('');
      resetHook();
      resetSelection();
    }
  }, [cloudId, resetHook, resetSelection]);

  useEffect(() => {
    if (!isEqual(selection, selectedOptions)) {
      setSelectedOptions(selection);
    }
  }, [selectedOptions, selection]);

  const filterOptionsLength = filterOptions.length;
  const isJQLHydrating = false;
  const isError = status === 'rejected';
  const isLoading = status === 'loading' || status === 'empty';
  const isLoadingMore = status === 'loadingMore';
  const isEmpty = status === 'resolved' && filterOptionsLength === 0;
  const popupSelectOptions = isLoading || isError ? [] : sortedOptions; // if not set to [], then on loading, no loading UI will be shown
  const areAllResultsLoaded = filterOptionsLength === totalCount;

  const shouldShowFooter =
    (status === 'resolved' || isLoadingMore) && filterOptionsLength > 0; // footer should not disappear when there is an inline spinner for loading more data
  const shouldDisplayShowMoreButton =
    status === 'resolved' && !!pageCursor && !areAllResultsLoaded;

  return (
    <PopupSelect<SelectOption, true>
      isMulti
      maxMenuWidth={300}
      minMenuWidth={300}
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
      menuListProps={{
        filterType,
        isError,
        isEmpty,
        isLoading,
        isLoadingMore,
        handleShowMore,
        errors,
        showMore: shouldDisplayShowMoreButton,
      }}
      components={{
        /* @ts-expect-error - This component has stricter OptionType, hence a temp setup untill its made generic */
        Option: CheckboxOption,
        Control: CustomControl,
        MenuList: CustomMenuList,
        DropdownIndicator: CustomDropdownIndicator,
        LoadingIndicator: undefined, // disables the three ... indicator in the searchbox when picker is loading
        IndicatorSeparator: undefined, // disables the | separator between search input and icon
      }}
      options={popupSelectOptions}
      value={selectedOptions}
      filterOption={noFilterOptions}
      formatOptionLabel={formatOptionLabel}
      onChange={handleOptionSelection}
      onInputChange={handleInputChange}
      onOpen={handleMenuOpen}
      onClose={handleMenuClose}
      target={({ isOpen, ...triggerProps }) => (
        <PopupTrigger
          {...triggerProps}
          filterType={filterType}
          selectedOptions={selectedOptions}
          isSelected={isOpen}
          isDisabled={isDisabled}
          isLoading={isJQLHydrating}
        />
      )}
      footer={
        shouldShowFooter && (
          <PopupFooter
            currentDisplayCount={popupSelectOptions.length}
            totalCount={totalCount}
          />
        )
      }
    />
  );
};

export default AsyncPopupSelect;
