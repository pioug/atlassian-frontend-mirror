/** @jsx jsx */
import { Fragment, useReducer, useRef, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Badge from '@atlaskit/badge';
import Button from '@atlaskit/button';
import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemCheckboxGroup,
} from '@atlaskit/dropdown-menu';
import FocusRing from '@atlaskit/focus-ring';
import SectionLink from '@atlaskit/gatsby-theme-brisk/src/components/section-link';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import FilterIcon from '@atlaskit/icon/glyph/filter';
import SearchIcon from '@atlaskit/icon/glyph/search';
import TextField from '@atlaskit/textfield';
import { gridSize } from '@atlaskit/theme/constants';
import ToolTip from '@atlaskit/tooltip';

import { token } from '../../src';
import TokenWizardModal from '../token-wizard';

import TokenGroups, { TokenGroupsProps } from './components/token-groups';
import groupedTokens, {
  TokenGroup,
  TransformedTokenExtended,
} from './grouped-tokens';

export const filterTokens = (
  list: TransformedTokenExtended[],
  filters: {
    searchQuery?: string;
    showStates?: string[];
  },
): TransformedTokenExtended[] =>
  list.filter(({ name, attributes, extensions }) => {
    const matchesState = filters?.showStates?.some(
      (state) => state === attributes?.state,
    );

    const filteredSearchQuery = filters?.searchQuery?.replace(
      /[-[\]{}()*+?.,\\^$|]/g,
      '\\$&',
    );

    const matchesSearch =
      filters?.searchQuery === '' ||
      (filters?.searchQuery &&
        filteredSearchQuery &&
        (name.search(filteredSearchQuery) !== -1 ||
          extensions?.some(
            (extension) => extension.name.search(filteredSearchQuery) !== -1,
          )));

    return matchesState && matchesSearch;
  });

export const filterGroups = (
  groups: TokenGroup[],
  filters: {
    searchQuery?: string;
    showStates?: string[];
  },
): TokenGroup[] =>
  groups.reduce((newGroups: TokenGroup[], currentGroup) => {
    const newGroup = {
      ...currentGroup,
      tokens: filterTokens(currentGroup.tokens, filters),
      subgroups: currentGroup.subgroups?.reduce(
        (newSubgroups: TokenGroup[], currentSubgroup) => {
          const newSubgroup = {
            ...currentSubgroup,
            tokens: filterTokens(currentSubgroup.tokens, filters),
          };

          if (newSubgroup.tokens.length > 0) {
            newSubgroups.push(newSubgroup);
          }

          return newSubgroups;
        },
        [],
      ),
    };

    if (
      newGroup.tokens.length > 0 ||
      (newGroup?.subgroups && newGroup.subgroups.length > 0)
    ) {
      newGroups.push(newGroup);
    }

    return newGroups;
  }, []);

/**
 * A reducer that finds how many tokens are in a collection of groups 🥲 very silly
 */
export const getNumberOfTokensInGroups = (groups: TokenGroup[]) =>
  groups.reduce((count, group) => {
    const topLevel = group.tokens.length;

    const topLevelExtensions = group.tokens.reduce((extensionCount, token) => {
      const inExtensions = token.extensions ? token.extensions.length : 0;

      return extensionCount + inExtensions;
    }, 0);

    const inSubgroups = group.subgroups
      ? group.subgroups.reduce((subgroupCount, subgroup) => {
          const subgroupExtensions = subgroup.tokens.reduce(
            (extensionCount, token) => {
              const inExtensions = token.extensions
                ? token.extensions.length
                : 0;

              return extensionCount + inExtensions;
            },
            0,
          );

          return subgroupCount + subgroup.tokens.length + subgroupExtensions;
        }, 0)
      : 0;

    return count + topLevel + topLevelExtensions + inSubgroups;
  }, 0);

const clearButtonStyles = css({
  marginRight: gridSize(),
  cursor: 'pointer',
  appearance: 'none',
  border: 'none',
  background: 'none',
  padding: 0,

  '&:hover, &:focus': {
    color: token('color.link', '#0C66E4'),
  },

  '&:active': {
    color: token('color.link.pressed', '#0055CC'),
  },
});

interface TokenExplorerProps {
  scrollOffset: TokenGroupsProps['scrollOffset'];
}

// Filters state
const filtersInitialState = {
  state: {
    active: true,
    deprecated: false,
    deleted: false,
  },
};

type FilterAction = {
  type: 'state';
  payload: {
    [key in 'active' | 'deprecated' | 'deleted']?: boolean;
  };
};

const filterReducer = (
  state: typeof filtersInitialState,
  action: FilterAction,
) => ({
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

const TokenExplorer = ({ scrollOffset }: TokenExplorerProps) => {
  const [filterState, dispatchFilter] = useReducer(
    filterReducer,
    filtersInitialState,
  );
  const [searchQuery, setSearchQuery] = useState('');

  const searchField = useRef<HTMLInputElement>();

  const filteredTokenGroups = filterGroups(groupedTokens, {
    searchQuery,
    showStates: Object.entries(filterState.state)
      .filter(([_, isSelected]) => isSelected)
      .map(([tokenState]) => tokenState),
  });

  const numberOfTokens = getNumberOfTokensInGroups(filteredTokenGroups);

  return (
    <Fragment>
      <SectionLink level={2} id="all-design-tokens-list">
        All design tokens list
      </SectionLink>
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div
          css={{
            flex: '1 1 auto',
            display: 'flex',
            alignItems: 'flex-start',
            marginLeft: `-${gridSize()}px`,
            marginRight: gridSize(),
          }}
        >
          <FilterItem css={{ maxWidth: 360, flexGrow: 1 }}>
            <TextField
              ref={searchField}
              name="token-search"
              aria-label="tokens search"
              placeholder="Search for tokens"
              autoComplete="off"
              isCompact
              elemBeforeInput={
                <div css={{ marginLeft: gridSize() }}>
                  <SearchIcon
                    css={{ display: 'block' }}
                    size="small"
                    label=""
                  />
                </div>
              }
              elemAfterInput={
                searchQuery && (
                  <ToolTip content="Clear search">
                    <FocusRing>
                      <button
                        type="button"
                        css={clearButtonStyles}
                        onClick={() => {
                          if (searchField?.current?.value) {
                            searchField.current.value = '';
                          }
                          setSearchQuery('');
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
                setSearchQuery((e.target as HTMLInputElement).value)
              }
            />
          </FilterItem>

          <FilterItem>
            <DropdownMenu
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
                  id="active"
                  isSelected={filterState.state.active}
                  onClick={() =>
                    dispatchFilter({
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
                  id="deprecated"
                  isSelected={filterState.state.deprecated}
                  onClick={() =>
                    dispatchFilter({
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
                  id="deleted"
                  isSelected={filterState.state.deleted}
                  onClick={() =>
                    dispatchFilter({
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
        </div>
        <div>
          <TokenWizardModal />
        </div>
      </div>

      <p>
        <small>{numberOfTokens} results below</small>
      </p>

      <TokenGroups
        scrollOffset={scrollOffset}
        groups={filteredTokenGroups}
        searchQuery={searchQuery}
      />
    </Fragment>
  );
};

export default TokenExplorer;
