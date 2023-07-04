import React from 'react';

import { LINK_PICKER_WIDTH_IN_PX } from '../../../common/constants';

import { SearchResults, SearchResultsProps } from './index';

const NOOP = () => {};

const tabs = [
  {
    tabTitle: 'Confluence',
  },
  {
    tabTitle: 'Jira',
  },
  {
    tabTitle: 'Atlas',
  },
];

const createExample = (
  props: Partial<SearchResultsProps> = {},
): React.ComponentType => {
  return function Example() {
    return (
      <div
        style={{
          border: '1px solid red',
          width: `${LINK_PICKER_WIDTH_IN_PX}px`,
        }}
      >
        <SearchResults
          linkSearchListId="search-list-id"
          activeTab={0}
          activePlugin={{ resolve: () => Promise.resolve({ data: [] }) }}
          tabs={[]}
          isLoadingResults={false}
          isLoadingPlugins={false}
          selectedIndex={-1}
          activeIndex={-1}
          items={null}
          queryState={{ query: 'atlassian' }}
          handleKeyDown={NOOP}
          handleSelected={NOOP}
          handleTabChange={NOOP}
          handleSearchListOnChange={NOOP}
          retry={NOOP}
          {...props}
        />
      </div>
    );
  };
};

export const DefaultExample = createExample();

export const LoadingPlugins = createExample({
  isLoadingPlugins: true,
});

export const LoadingResultsWithTabs = createExample({
  isLoadingResults: true,
  tabs,
});

export const NoResults = createExample({
  tabs,
  items: [],
});

export const ErrorExample = createExample({
  error: new Error('Some error!'),
});

export const ShowingResultsWhileLoadingResults = () => {
  const exampleComponents = [1, 2, 3, 4, 5].reduce<React.ComponentType[]>(
    (acc, cur) => {
      const items = new Array(cur)
        .fill({
          objectId: 'id',
          name: 'Some Suggested Link',
          url: 'https://atlassian.com',
          container: 'Some Space',
          lastViewedDate: new Date(Date.now() - 60 * 1000 * 60 * 24 * 5),
          icon: '',
          iconAlt: '',
        })
        .map((item, index) => ({
          ...item,
          objectId: `id-${index}`,
        }));

      return [
        ...acc,
        createExample({
          isLoadingResults: true,
          items,
        }),
        createExample({
          isLoadingResults: true,
          items,
          tabs,
        }),
      ];
    },
    [],
  );

  return (
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {exampleComponents.map((Component, i) => (
        <div key={`item-${i}`}>
          <Component />
        </div>
      ))}
    </div>
  );
};
