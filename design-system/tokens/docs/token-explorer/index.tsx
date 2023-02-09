/** @jsx jsx */
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import { css, jsx } from '@emotion/react';
import Fuse from 'fuse.js';
import debounce from 'lodash/debounce';

import Badge from '@atlaskit/badge';
import Button from '@atlaskit/button';
import { Checkbox } from '@atlaskit/checkbox';
import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemCheckboxGroup,
  DropdownItemRadio,
  DropdownItemRadioGroup,
} from '@atlaskit/dropdown-menu';
import FocusRing from '@atlaskit/focus-ring';
import Heading from '@atlaskit/heading';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import FilterIcon from '@atlaskit/icon/glyph/filter';
import SearchIcon from '@atlaskit/icon/glyph/search';
import TextField from '@atlaskit/textfield';
import { gridSize } from '@atlaskit/theme/constants';
import ToolTip from '@atlaskit/tooltip';

// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import { useHeadings } from '../../../../../services/design-system-docs/src/__DO_NOT_ADD_TO_THIS_FOLDER__/gatsby-theme-brisk/components/local-nav/heading-context';
// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import SectionLink from '../../../../../services/design-system-docs/src/components/section-link';
import { token } from '../../src';
import TokenWizardModal from '../token-wizard';

import TokenGroups, { TokenGroupsProps } from './components/token-groups';
import TokenList from './components/token-list';
import {
  TokenNameSyntax,
  TokenNameSyntaxContext,
} from './components/token-name-syntax-context';
import groupedTokens, { TokenGroup } from './grouped-tokens';
import mergedTokens from './merged-tokens';
import type { TransformedTokenMerged } from './types';
import {
  filterGroups,
  filterTokens,
  getNumberOfTokensInGroups,
  getTokenGroupHeadings,
} from './utils';

const ALL_DESIGN_TOKENS_LIST_HEADING = {
  depth: 1,
  id: 'all-design-tokens-list',
  value: 'All design tokens list',
} as const;

const clearButtonStyles = css({
  display: 'flex',
  marginRight: gridSize(),
  padding: 0,
  alignItems: 'center',
  appearance: 'none',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  '&:hover, &:focus': {
    color: token('color.link', '#0C66E4'),
  },
  '&:active': {
    color: token('color.link.pressed', '#0055CC'),
  },
});

interface TokenExplorerProps {
  scrollOffset?: TokenGroupsProps['scrollOffset'];
  testId?: string;
}

// Filters state
const filtersInitialState = {
  state: {
    active: true,
    deprecated: false,
    deleted: false,
  },
};

type FilterState = typeof filtersInitialState;

type FilterAction = {
  type: 'state';
  payload: {
    [key in 'active' | 'deprecated' | 'deleted']?: boolean;
  };
};

const filterReducer = (state: FilterState, action: FilterAction) => ({
  ...state,
  [action.type]: {
    ...state[action.type],
    ...action.payload,
  },
});

const FilterItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    css={{
      flex: '0 0 auto',
      padding: `0 ${gridSize()}px`,
    }}
    className={className}
  >
    {children}
  </div>
);

const fuseOptions: Fuse.IFuseOptions<TransformedTokenMerged> = {
  keys: [
    {
      name: 'name',
      weight: 1,
    },
    {
      name: 'nameClean',
      weight: 1,
    },
    {
      name: 'original.value',
      weight: 1,
    },
    {
      name: 'darkToken.original.value',
      weight: 1,
    },
    {
      name: 'path',
      weight: 1,
    },
    {
      name: 'attributes.description',
      weight: 2,
    },
  ],
  useExtendedSearch: true,
  threshold: 0.05,
  ignoreLocation: true,
};

const TokenExplorer = ({ scrollOffset, testId }: TokenExplorerProps) => {
  /**
   * Headings / side navigation
   *
   * Uses the headings context to add token groups to C11n side navigation.
   * This doesn't assume the component is wrapped in a context provider,
   * so the component could still be used elsewhere if needed.
   */
  const headingsContext = useHeadings();
  const setHeadingsOverride = headingsContext?.setHeadingsOverride;
  const resetHeadings = headingsContext?.resetHeadings;
  const headings = headingsContext?.headings;

  /**
   * Filters
   */
  const [filterState, dispatchFilter] = useReducer(
    filterReducer,
    filtersInitialState,
  );

  const handleFilterChange = (action: FilterAction) => {
    dispatchFilter(action);

    const newFilterState = {
      ...filterState.state,
      ...action.payload,
    };

    setFuseIndex(newFilterState);
    setFilteredTokenGroups(getFilteredTokenGroups(newFilterState));
  };

  /**
   * Search
   */
  // Re-indexes search
  const setFuseIndex = (state: FilterState['state']) => {
    const index = getFilteredTokenIndex(state);
    fuseIndex.current.setCollection(index);

    // Update search if active
    if (searchQuery !== '') {
      handleSearch(searchQuery);
    }
  };

  const getFilteredTokenIndex = (
    state: FilterState['state'],
  ): TransformedTokenMerged[] => {
    return filterTokens(mergedTokens, {
      showStates: Object.entries(state)
        .filter(([_, isSelected]) => isSelected)
        .map(([tokenState]) => tokenState),
    });
  };

  const fuseIndex = useRef<Fuse<TransformedTokenMerged>>(
    new Fuse(getFilteredTokenIndex(filterState.state), fuseOptions),
  );
  const searchField = useRef<HTMLInputElement>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedTokens, setSearchedTokens] = useState<
    Fuse.FuseResult<TransformedTokenMerged>[] | undefined
  >();

  const search = (query: string) =>
    setSearchedTokens(fuseIndex.current.search<TransformedTokenMerged>(query));
  const debouncedSearch = useMemo(() => debounce(search, 300), []);

  const handleSearch = useCallback(
    (
      query: string,
      opts: { isDebounced?: boolean } = { isDebounced: false },
    ) => {
      setSearchQuery(query);

      // Clear searched tokens to enter loading state
      setSearchedTokens(undefined);

      if (query !== '') {
        // Remove token groups from side navigation headings context
        if (headings && headings.length > 1) {
          setHeadingsOverride([ALL_DESIGN_TOKENS_LIST_HEADING]);
        }

        opts.isDebounced ? debouncedSearch(query) : search(query);
      }
    },
    [setHeadingsOverride, headings, debouncedSearch],
  );

  /**
   * Token groups
   */

  const getFilteredTokenGroups = (
    state: FilterState['state'],
  ): TokenGroup[] => {
    return filterGroups(groupedTokens, {
      showStates: Object.entries(state)
        .filter(([_, isSelected]) => isSelected)
        .map(([tokenState]) => tokenState),
    });
  };

  const [filteredTokenGroups, setFilteredTokenGroups] = useState<TokenGroup[]>(
    getFilteredTokenGroups(filterState.state),
  );

  // Update token groups in side navigation headings context when groups change
  useEffect(() => {
    if (setHeadingsOverride && searchQuery === '') {
      setHeadingsOverride([
        ALL_DESIGN_TOKENS_LIST_HEADING,
        ...getTokenGroupHeadings(filteredTokenGroups),
      ]);
    }
  }, [setHeadingsOverride, searchQuery, filteredTokenGroups]);

  // Clean-up: clear headings override on unmount
  useEffect(() => {
    return () => {
      if (resetHeadings) {
        resetHeadings();
      }
    };
  }, [resetHeadings]);

  /**
   * Exact search
   */
  const onExactSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const filteredTokens = getFilteredTokenIndex(filterState.state);

      if (e.target.checked) {
        fuseIndex.current = new Fuse(filteredTokens, {
          ...fuseOptions,
          // Don't exact-match paths e.g. 'red', 'background'
          keys: fuseOptions.keys?.filter(
            (key) =>
              typeof key === 'object' &&
              !Array.isArray(key) &&
              key.name !== 'path',
          ),
          threshold: -1,
        });
        handleSearch(searchQuery);
      } else {
        fuseIndex.current = new Fuse(filteredTokens, fuseOptions);
        handleSearch(searchQuery);
      }
    },
    [filterState, handleSearch, searchQuery],
  );

  // Prevents re-renders in TokenList due to new array being created from map
  const searchedTokensMemo = useMemo(
    () => searchedTokens?.map((result) => result.item),
    [searchedTokens],
  );

  const numberOfTokens = useMemo(
    () =>
      searchQuery === ''
        ? getNumberOfTokensInGroups(filteredTokenGroups)
        : searchedTokensMemo?.length,
    [searchQuery, searchedTokensMemo, filteredTokenGroups],
  );

  const [syntax, setSyntax] = useState<TokenNameSyntax>('default');

  return (
    <div data-testid={testId}>
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: `${gridSize() * 4}px 0 ${gridSize() * 4}px`,
        }}
      >
        <SectionLink id={ALL_DESIGN_TOKENS_LIST_HEADING.id}>
          <Heading level="h700">{ALL_DESIGN_TOKENS_LIST_HEADING.value}</Heading>
        </SectionLink>
        <TokenWizardModal />
      </div>

      <TextField
        ref={searchField}
        value={searchQuery}
        name="token-search"
        aria-label="tokens search"
        placeholder="Search for tokens"
        autoComplete="off"
        testId={testId && `${testId}-search`}
        isCompact
        css={{ marginTop: gridSize() * 4 }}
        elemBeforeInput={
          <div
            css={{
              marginLeft: gridSize(),
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <SearchIcon css={{ display: 'block' }} size="small" label="" />
          </div>
        }
        elemAfterInput={
          searchQuery && (
            <ToolTip content="Clear search" position="top">
              <FocusRing>
                <button
                  type="button"
                  css={clearButtonStyles}
                  onClick={() => {
                    if (searchField?.current?.value) {
                      searchField.current.value = '';
                    }
                    handleSearch('');
                  }}
                >
                  <CrossIcon
                    css={{ display: 'block' }}
                    size="small"
                    label="Clear search"
                  />
                </button>
              </FocusRing>
            </ToolTip>
          )
        }
        onChange={(e) =>
          handleSearch((e.target as HTMLInputElement).value, {
            isDebounced: true,
          })
        }
      />
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          marginTop: gridSize() * 2,
          marginRight: gridSize(),
          marginLeft: `-${gridSize()}px`,
        }}
      >
        <FilterItem>
          <DropdownMenu
            testId={testId && `${testId}-filters`}
            trigger={({ triggerRef, ...props }) => (
              <Button
                {...props}
                ref={triggerRef}
                iconAfter={<FilterIcon label="" />}
              >
                Filters{' '}
                <Badge appearance={props.isSelected ? 'primary' : undefined}>
                  {Object.values(filterState.state).filter((v) => v).length}
                </Badge>
              </Button>
            )}
          >
            <DropdownItemCheckboxGroup id="state" title="State">
              <DropdownItemCheckbox
                testId={testId && `${testId}-filters-active`}
                id="active"
                isSelected={filterState.state.active}
                onClick={() =>
                  handleFilterChange({
                    type: 'state',
                    payload: {
                      active: !filterState.state.active,
                    },
                  })
                }
              >
                Active
              </DropdownItemCheckbox>
              <DropdownItemCheckbox
                testId={testId && `${testId}-filters-deprecated`}
                id="deprecated"
                isSelected={filterState.state.deprecated}
                onClick={() =>
                  handleFilterChange({
                    type: 'state',
                    payload: {
                      deprecated: !filterState.state.deprecated,
                    },
                  })
                }
              >
                Deprecated
              </DropdownItemCheckbox>
              <DropdownItemCheckbox
                testId={testId && `${testId}-filters-deleted`}
                id="deleted"
                isSelected={filterState.state.deleted}
                onClick={() =>
                  handleFilterChange({
                    type: 'state',
                    payload: {
                      deleted: !filterState.state.deleted,
                    },
                  })
                }
              >
                Deleted
              </DropdownItemCheckbox>
            </DropdownItemCheckboxGroup>
          </DropdownMenu>
        </FilterItem>

        <FilterItem css={{ display: 'flex', flexDirection: 'column' }}>
          <DropdownMenu
            testId={testId && `${testId}-syntax`}
            trigger={syntax === 'default' ? 'React syntax' : 'CSS syntax'}
          >
            <DropdownItemRadioGroup id="syntax">
              <DropdownItemRadio
                id="default"
                isSelected={syntax === 'default'}
                onClick={() => setSyntax('default')}
              >
                React syntax
              </DropdownItemRadio>
              <DropdownItemRadio
                id="css-var"
                isSelected={syntax === 'css-var'}
                onClick={() => setSyntax('css-var')}
              >
                CSS syntax
              </DropdownItemRadio>
            </DropdownItemRadioGroup>
          </DropdownMenu>
        </FilterItem>

        <FilterItem>
          <Checkbox
            onChange={onExactSearchChange}
            label="Exact search"
            name="exact-search"
            testId={testId && `${testId}-exact-search`}
          />
        </FilterItem>
      </div>

      <p css={{ marginBottom: gridSize() * 3 }}>
        <small>
          {(searchQuery !== '' && searchedTokensMemo === undefined) ||
          numberOfTokens === undefined
            ? 'Loading results...'
            : `${numberOfTokens} result${
                numberOfTokens === 1 ? '' : 's'
              } below`}
        </small>
      </p>

      <TokenNameSyntaxContext.Provider value={{ syntax: syntax }}>
        {searchQuery === '' ? (
          <TokenGroups
            testId={testId}
            scrollOffset={scrollOffset}
            groups={filteredTokenGroups}
          />
        ) : (
          <TokenList
            testId={testId}
            isLoading={searchedTokensMemo === undefined}
            list={searchedTokensMemo}
            scrollOffset={scrollOffset}
          />
        )}
      </TokenNameSyntaxContext.Provider>
    </div>
  );
};

export default TokenExplorer;
