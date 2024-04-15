import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Flex, xcss } from '@atlaskit/primitives';

import { BasicSearchInput } from '../../common/modal/basic-search-input';
import BasicFilters from '../basic-filters';

import { searchMessages } from './messages';

interface Props {
  cloudId?: string;
  initialSearchValue?: string;
  isSearching: boolean;
  onSearch: (searchTerm: string) => void;
}

const basicSearchInputContainerStyles = xcss({
  flexGrow: 1,
});

const ConfluenceSearchContainer = ({
  cloudId,
  initialSearchValue,
  isSearching,
  onSearch,
}: Props) => {
  const currentCloudId = useRef(cloudId);
  const [searchBarSearchString, setSearchBarSearchString] = useState(
    initialSearchValue ?? '',
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawSearch = e.currentTarget.value;
      setSearchBarSearchString(rawSearch);
    },
    [],
  );

  // TODO: further refactoring in EDM-9573
  // https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/82725/overview?commentId=6827913
  useEffect(() => {
    if (currentCloudId.current !== cloudId) {
      setSearchBarSearchString('');
      currentCloudId.current = cloudId;
    }
  }, [cloudId]);

  const showBasicFilters = useMemo(() => {
    if (
      getBooleanFF(
        'platform.linking-platform.datasource.show-clol-basic-filters',
      )
    ) {
      return true;
    }
    return false;
  }, []);

  return (
    <Flex alignItems="center" xcss={basicSearchInputContainerStyles}>
      <BasicSearchInput
        testId="confluence-search-datasource-modal"
        isSearching={isSearching}
        onChange={handleSearchChange}
        onSearch={onSearch}
        searchTerm={searchBarSearchString}
        placeholder={searchMessages.searchLabel}
        fullWidth={!showBasicFilters}
      />
      {showBasicFilters && <BasicFilters />}
    </Flex>
  );
};

export default ConfluenceSearchContainer;
