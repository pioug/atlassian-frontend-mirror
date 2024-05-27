import React, { useCallback, useEffect, useRef, useState } from 'react';

import isEqual from 'lodash/isEqual';
import { useIntl } from 'react-intl-next';
import { useDebouncedCallback } from 'use-debounce';

import { type ValueType } from '@atlaskit/select';

import type { Site } from '../../../../../common/types';
import { FilterPopupSelect } from '../../../../common/modal/popup-select';
import { SEARCH_DEBOUNCE_MS } from '../../../../common/modal/popup-select/constants';
import { type SelectOption } from '../../../../common/modal/popup-select/types';
import { useFilterOptions } from '../../hooks/useFilterOptions';
import { type BasicFilterFieldType } from '../../types';

import { asyncPopupSelectMessages } from './messages';

export interface AsyncPopupSelectProps {
  filterType: BasicFilterFieldType;
  selection: SelectOption[];
  isJQLHydrating: boolean;
  onSelectionChange?: (
    filterType: BasicFilterFieldType,
    options: SelectOption[],
  ) => void;
  isDisabled?: boolean;
  site?: Site;
}

const AsyncPopupSelect = ({
  filterType,
  site,
  selection,
  isJQLHydrating,
  onSelectionChange = () => {},
  isDisabled = false,
}: AsyncPopupSelectProps) => {
  const { formatMessage } = useIntl();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptions, setSelectedOptions] =
    useState<ValueType<SelectOption, true>>(selection);

  const { cloudId } = site || {};
  const currentSiteCloudId = useRef<string>(cloudId || '');

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
    site,
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
    async (newSearchTerm: string) => {
      setSearchTerm(newSearchTerm);
      handleDebouncedFetchFilterOptions(newSearchTerm);
    },
    [handleDebouncedFetchFilterOptions],
  );

  const handleOptionSelection = useCallback(
    (newValue: ValueType<SelectOption, true>) => {
      onSelectionChange(filterType, newValue as SelectOption[]);
    },
    [filterType, onSelectionChange],
  );

  const handleShowMore = useCallback(() => {
    if (pageCursor) {
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
    }
  }, [fetchFilterOptions, searchTerm, status]);

  useEffect(() => {
    if (cloudId && currentSiteCloudId.current !== cloudId) {
      currentSiteCloudId.current = cloudId;
      setSearchTerm('');
      resetHook();
    }
  }, [cloudId, resetHook]);

  useEffect(() => {
    if (!isEqual(selection, selectedOptions)) {
      setSelectedOptions(selection);
    }
  }, [selectedOptions, selection]);

  const filterOptionsLength = filterOptions.length;
  const isError = status === 'rejected';
  const isLoading = status === 'loading' || status === 'empty';
  const isLoadingMore = status === 'loadingMore';
  const isEmpty = status === 'resolved' && filterOptionsLength === 0;
  const popupSelectOptions = isLoading || isError ? [] : filterOptions; // if not set to [], then on loading, no loading UI will be shown
  const areAllResultsLoaded = filterOptionsLength === totalCount;
  const filterName = `jlol-basic-filter-${filterType}`;

  const shouldShowFooter =
    (status === 'resolved' || isLoadingMore) && filterOptionsLength > 0; // footer should not disappear when there is an inline spinner for loading more data
  const shouldDisplayShowMoreButton =
    status === 'resolved' && !!pageCursor && !areAllResultsLoaded;
  const triggerButtonLabel = formatMessage(
    asyncPopupSelectMessages[`${filterType}Label`],
  );

  return (
    <FilterPopupSelect
      filterName={filterName}
      status={status}
      showLoading={isLoading}
      showHydrating={isJQLHydrating}
      isDisabled={isDisabled}
      totalCount={totalCount}
      shouldShowFooter={shouldShowFooter}
      selectedOptions={selectedOptions}
      options={popupSelectOptions}
      buttonLabel={triggerButtonLabel}
      onInputChange={handleInputChange}
      onSelectionChange={handleOptionSelection}
      onMenuOpen={handleMenuOpen}
      menuListProps={{
        filterName,
        isError,
        isEmpty,
        isLoading,
        isLoadingMore,
        handleShowMore,
        errors,
        showMore: shouldDisplayShowMoreButton,
      }}
    />
  );
};

export default AsyncPopupSelect;
