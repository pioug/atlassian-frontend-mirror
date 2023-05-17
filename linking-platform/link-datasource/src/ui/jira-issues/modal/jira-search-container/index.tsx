/** @jsx jsx */
import React, { useState } from 'react';

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { token } from '@atlaskit/tokens';

import { JiraIssueDatasourceParameters } from '../../types';
import { BasicSearchInput } from '../basic-search-input';
import { JiraJQLEditor } from '../jql-editor';
import { ModeSwitcher } from '../mode-switcher';

import { buildJQL } from './buildJQL';
import { modeSwitcherMessages } from './messages';

const inputContainerStyles = css({
  alignItems: 'baseline',
  display: 'flex',
  gap: token('space.250', '20px'),
  minHeight: '60px',
});

export interface SearchContainerProps {
  onSearch: (query: Omit<JiraIssueDatasourceParameters, 'cloudId'>) => void;
  parameters?: JiraIssueDatasourceParameters;
}

export const JiraSearchContainer = (props: SearchContainerProps) => {
  const { parameters, onSearch } = props;
  const { cloudId, value: initialJql } = parameters || {};

  const { formatMessage } = useIntl();

  const basicModeValue = 'basic';
  const jqlModeValue = 'jql';

  const [basicSearchTerm, setBasicSearchTerm] = useState('');
  const [currentSearchMode, setCurrentSearchMode] = useState<string>(
    initialJql ? jqlModeValue : basicModeValue,
  );
  const [jql, setJql] = useState(initialJql || '');
  const [orderKey, setOrderKey] = useState<string | undefined>();
  const [orderDirection, setOrderDirection] = useState<string | undefined>();

  const onSearchModeChange = (searchMode: string) => {
    setCurrentSearchMode(searchMode);
  };

  const handleBasicSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawSearch = e.currentTarget.value;
    setBasicSearchTerm(rawSearch);
    setJql(buildJQL({ rawSearch, orderDirection, orderKey }));
  };

  const onQueryChange = (query: string) => {
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
    if (key && ['key', 'summary', 'assignee', 'status'].includes(key)) {
      setOrderKey(key);
      setOrderDirection(order);
    }

    setJql(query);
  };

  const handleSearch = () => {
    onSearch({ value: jql, type: 'jql' });
  };

  return (
    <div css={inputContainerStyles}>
      {currentSearchMode === basicModeValue && (
        <BasicSearchInput
          onChange={handleBasicSearchChange}
          onSearch={handleSearch}
          searchTerm={basicSearchTerm}
        />
      )}
      {currentSearchMode === jqlModeValue && (
        <JiraJQLEditor
          cloudId={cloudId || ''}
          onChange={onQueryChange}
          onSearch={handleSearch}
          query={jql}
        />
      )}
      <ModeSwitcher
        onOptionValueChange={onSearchModeChange}
        selectedOptionValue={currentSearchMode}
        options={[
          {
            label: formatMessage(modeSwitcherMessages.basicTextSearchLabel),
            value: basicModeValue,
          },
          { label: 'JQL', value: jqlModeValue },
        ]}
      />
    </div>
  );
};
