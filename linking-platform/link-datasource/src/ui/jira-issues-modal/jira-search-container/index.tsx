/** @jsx jsx */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';
import { useDebouncedCallback } from 'use-debounce';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Flex, xcss } from '@atlaskit/primitives';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import type { JiraSearchMethod } from '../../../common/types';
import { BasicFilters } from '../basic-filters';
import { useHydrateJqlQuery } from '../basic-filters/hooks/useHydrateJqlQuery';
import {
  BasicFilterFieldType,
  SelectedOptionsMap,
  SelectOption,
} from '../basic-filters/types';
import { SEARCH_DEBOUNCE_MS } from '../basic-filters/ui/async-popup-select';
import { isQueryTooComplex } from '../basic-filters/utils/isQueryTooComplex';
import { BasicSearchInput } from '../basic-search-input';
import { JiraJQLEditor } from '../jql-editor';
import { ModeSwitcher } from '../mode-switcher';
import {
  JiraIssueDatasourceParameters,
  JiraIssueDatasourceParametersQuery,
} from '../types';

import { buildJQL } from './buildJQL';
import { modeSwitcherMessages } from './messages';

const inputContainerStyles = css({
  alignItems: 'baseline',
  display: 'flex',
  minHeight: '72px',
});

const basicSearchInputContainerStyles = xcss({
  flexGrow: 1,
});

const DEFAULT_JQL_QUERY = 'created >= -30d order by created DESC';
export const ALLOWED_ORDER_BY_KEYS = [
  'key',
  'summary',
  'assignee',
  'status',
  'created',
];

const JiraSearchMethodSwitcher = ModeSwitcher<JiraSearchMethod>;
export interface SearchContainerProps {
  isSearching?: boolean;
  onSearch: (
    query: JiraIssueDatasourceParametersQuery,
    {
      searchMethod,
      basicFilterSelections,
    }: {
      searchMethod: JiraSearchMethod;
      basicFilterSelections: SelectedOptionsMap;
      isQueryComplex: boolean;
    },
  ) => void;
  initialSearchMethod: JiraSearchMethod;
  onSearchMethodChange: (searchMethod: JiraSearchMethod) => void;
  parameters?: JiraIssueDatasourceParameters;
}

export const JiraSearchContainer = (props: SearchContainerProps) => {
  const {
    isSearching,
    parameters,
    onSearch,
    onSearchMethodChange: onSearchMethodChangeCallback,
    initialSearchMethod,
  } = props;
  const { cloudId, jql: initialJql } = parameters || {};

  const { formatMessage } = useIntl();
  const { fireEvent } = useDatasourceAnalyticsEvents();

  const [basicSearchTerm, setBasicSearchTerm] = useState('');
  const [currentSearchMethod, setCurrentSearchMethod] =
    useState<JiraSearchMethod>(initialSearchMethod);
  const [jql, setJql] = useState(initialJql || DEFAULT_JQL_QUERY);
  const [isComplexQuery, setIsComplexQuery] = useState(false);
  const [orderKey, setOrderKey] = useState<string | undefined>();
  const [orderDirection, setOrderDirection] = useState<string | undefined>();
  const [filterSelections, setFilterSelections] = useState<SelectedOptionsMap>(
    {},
  );

  const showBasicFilters = useMemo(() => {
    if (
      getBooleanFF(
        'platform.linking-platform.datasource.show-jlol-basic-filters',
      )
    ) {
      return true;
    }
    return false;
  }, []);

  const {
    hydratedOptions,
    fetchHydratedJqlOptions,
    status: basicFilterHydrationStatus,
  } = useHydrateJqlQuery(cloudId || '', jql);
  const onSearchMethodChange = useCallback(
    (searchMethod: JiraSearchMethod) => {
      onSearchMethodChangeCallback(searchMethod);
      setCurrentSearchMethod(searchMethod);
    },
    [onSearchMethodChangeCallback],
  );

  const handleBasicSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawSearch = e.currentTarget.value;
      setBasicSearchTerm(rawSearch);
      setJql(
        buildJQL({
          rawSearch,
          filterValues: filterSelections,
          orderDirection,
          orderKey,
        }),
      );
    },
    [filterSelections, orderDirection, orderKey],
  );

  const onQueryChange = useCallback((query: string) => {
    // determine if order keys have been set so they can be saved and persisted when changes occur in basic search
    const fragments =
      query
        ?.split(/(^| )(order by)( |$)/i)
        .map(item => item.trim())
        .filter(Boolean) ?? [];

    const hasOrder = fragments.at(-2)?.toLowerCase() === 'order by';
    const key = hasOrder ? fragments.at(-1)?.split(' ').at(-2) : undefined;
    const order = hasOrder ? fragments.at(-1)?.split(' ').at(-1) : undefined;

    // TODO: confirm if these are the only order keys we want to preserve - existing whiteboard logic
    if (key && ALLOWED_ORDER_BY_KEYS.includes(key)) {
      setOrderKey(key);
      setOrderDirection(order);
    }

    setJql(query);
  }, []);

  const handleSearch = useCallback(() => {
    const isCurrentQueryComplex = isQueryTooComplex(jql);

    onSearch(
      { jql },
      {
        searchMethod: currentSearchMethod,
        basicFilterSelections: filterSelections,
        isQueryComplex: isCurrentQueryComplex,
      },
    );

    if (currentSearchMethod === 'basic') {
      fireEvent('ui.form.submitted.basicSearch', {});
    } else if (currentSearchMethod === 'jql') {
      fireEvent('ui.jqlEditor.searched', {
        isQueryComplex: isCurrentQueryComplex,
      });

      setIsComplexQuery(isCurrentQueryComplex);

      if (showBasicFilters && !isCurrentQueryComplex) {
        fetchHydratedJqlOptions();
      }
    }
  }, [
    currentSearchMethod,
    fetchHydratedJqlOptions,
    filterSelections,
    fireEvent,
    jql,
    onSearch,
    showBasicFilters,
  ]);

  const [debouncedBasicFilterSelectionChange] = useDebouncedCallback(
    (filterValues: SelectedOptionsMap) => {
      const jqlWithFilterValues = buildJQL({
        rawSearch: basicSearchTerm,
        filterValues,
        orderDirection,
        orderKey,
      });

      setJql(jqlWithFilterValues);
      const isCurrentQueryComplex = isQueryTooComplex(jqlWithFilterValues);

      onSearch(
        {
          jql: jqlWithFilterValues,
        },
        {
          searchMethod: currentSearchMethod,
          basicFilterSelections: filterSelections,
          isQueryComplex: isCurrentQueryComplex,
        },
      );
    },
    SEARCH_DEBOUNCE_MS,
  );

  const handleBasicFilterSelectionChange = useCallback(
    (filterValues: SelectedOptionsMap) => {
      setFilterSelections(filterValues);
      debouncedBasicFilterSelectionChange(filterValues);
    },
    [debouncedBasicFilterSelectionChange],
  );

  useEffect(() => {
    const isCurrentQueryComplex = isQueryTooComplex(jql);

    setIsComplexQuery(isCurrentQueryComplex);

    if (
      showBasicFilters &&
      !isCurrentQueryComplex &&
      jql !== DEFAULT_JQL_QUERY
    ) {
      fetchHydratedJqlOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (basicFilterHydrationStatus === 'resolved') {
      const { basicInputTextValue, ...hydratedFilterOptions } = hydratedOptions;

      setFilterSelections(hydratedFilterOptions);
      if (basicInputTextValue) {
        setBasicSearchTerm(basicInputTextValue);
      }
    }
  }, [hydratedOptions, basicFilterHydrationStatus]);

  const handleSelectionChange = useCallback(
    (filterType: BasicFilterFieldType, options: SelectOption[]) => {
      const updatedSelection: SelectedOptionsMap = {
        ...filterSelections,
        [filterType]: options,
      };
      setFilterSelections(updatedSelection);
      handleBasicFilterSelectionChange(updatedSelection);
    },
    [handleBasicFilterSelectionChange, filterSelections],
  );

  const handleBasicFiltersReset = useCallback(() => {
    if (Object.keys(filterSelections).length > 0) {
      setFilterSelections({});
    }
  }, [filterSelections]);

  return (
    <div css={inputContainerStyles} data-testid="jira-search-container">
      {currentSearchMethod === 'basic' && (
        <Flex alignItems="center" xcss={basicSearchInputContainerStyles}>
          <BasicSearchInput
            isSearching={isSearching}
            onChange={handleBasicSearchChange}
            onSearch={handleSearch}
            searchTerm={basicSearchTerm}
          />
          {showBasicFilters && (
            <BasicFilters
              cloudId={cloudId || ''}
              onChange={handleSelectionChange}
              selections={filterSelections}
              onReset={handleBasicFiltersReset}
              isJQLHydrating={basicFilterHydrationStatus === 'loading'}
            />
          )}
        </Flex>
      )}
      {currentSearchMethod === 'jql' && (
        <JiraJQLEditor
          cloudId={cloudId || ''}
          isSearching={isSearching}
          onChange={onQueryChange}
          onSearch={handleSearch}
          query={jql}
        />
      )}
      <JiraSearchMethodSwitcher
        onOptionValueChange={onSearchMethodChange}
        selectedOptionValue={currentSearchMethod}
        options={[
          { label: 'JQL', value: 'jql' },
          {
            label: formatMessage(modeSwitcherMessages.basicTextSearchLabel),
            value: 'basic',
            disabled: isComplexQuery,
            tooltipText: isComplexQuery
              ? formatMessage(
                  modeSwitcherMessages.basicModeSwitchDisabledTooltipText,
                )
              : '',
          },
        ]}
      />
    </div>
  );
};
