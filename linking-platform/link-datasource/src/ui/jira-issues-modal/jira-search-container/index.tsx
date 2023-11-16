/** @jsx jsx */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Flex, xcss } from '@atlaskit/primitives';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import type { JiraSearchMethod } from '../../../common/types';
import { BasicFilters } from '../basic-filters';
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
  minHeight: '60px',
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
    searchMethod: JiraSearchMethod,
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

  const [basicSearchTerm, setBasicSearchTerm] = useState('');

  const [currentSearchMethod, setCurrentSearchMethod] =
    useState<JiraSearchMethod>(initialSearchMethod);
  const [jql, setJql] = useState(initialJql || DEFAULT_JQL_QUERY);
  const [isComplexQuery, setIsComplexQuery] = useState(false);
  const [orderKey, setOrderKey] = useState<string | undefined>();
  const [orderDirection, setOrderDirection] = useState<string | undefined>();
  const { fireEvent } = useDatasourceAnalyticsEvents();

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
      setJql(buildJQL({ rawSearch, orderDirection, orderKey }));
    },
    [orderDirection, orderKey],
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
    onSearch({ jql }, currentSearchMethod);
    setIsComplexQuery(isQueryTooComplex(jql));

    if (currentSearchMethod === 'basic') {
      fireEvent('ui.form.submitted.basicSearch', {});
    } else if (currentSearchMethod === 'jql') {
      fireEvent('ui.jqlEditor.searched', {});
    }
  }, [currentSearchMethod, fireEvent, jql, onSearch]);

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

  useEffect(() => {
    setIsComplexQuery(isQueryTooComplex(jql));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div css={inputContainerStyles}>
      {currentSearchMethod === 'basic' && (
        <Flex alignItems="center" xcss={basicSearchInputContainerStyles}>
          <BasicSearchInput
            isSearching={isSearching}
            onChange={handleBasicSearchChange}
            onSearch={handleSearch}
            searchTerm={basicSearchTerm}
          />
          {showBasicFilters && (
            <BasicFilters jql={jql} cloudId={cloudId || ''} />
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
