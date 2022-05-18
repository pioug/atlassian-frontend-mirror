/** @jsx jsx */
import { Fragment } from 'react';

import { jsx } from '@emotion/core';
import upperFirst from 'lodash/upperFirst';

import EmptyState from '@atlaskit/empty-state';

// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import SectionLink from '../../../../../../services/website-constellation/src/__DO_NOT_ADD_TO_THIS_FOLDER__/gatsby-theme-brisk/components/section-link';
import type { TokenGroup } from '../grouped-tokens';
import noResultsImg from '../images/no-results.png';

import TokenList from './token-list';

export interface TokenGroupsProps {
  /**
   * Offset the sticky table header to avoid overlapping existing fixed elements.
   */
  scrollOffset?: number;
  groups: TokenGroup[];
  searchQuery?: string;
  hasDescription?: boolean;
  hasLifecycle?: boolean;
}

const TokenGroups = ({
  groups,
  scrollOffset = 0,
  searchQuery,
}: TokenGroupsProps) => (
  <Fragment>
    {groups.length > 0 ? (
      groups.map((group) => {
        const hasTokens = group.tokens.length > 0;

        const hasSubgroupTokens = group.subgroups?.some(
          (subgroup) => subgroup.tokens.length > 0,
        );

        return hasTokens || hasSubgroupTokens ? (
          <Fragment key={group.name}>
            <SectionLink level={2} id={group.name}>
              {upperFirst(group.name)}
            </SectionLink>
            {hasTokens && (
              <TokenList
                list={group.tokens}
                scrollOffset={scrollOffset}
                searchQuery={searchQuery}
              />
            )}

            {group.subgroups?.map((subgroup) =>
              subgroup.tokens.length > 0 ? (
                <Fragment key={`${group.name}-${subgroup.name}`}>
                  <SectionLink level={3} id={`${group.name}-${subgroup.name}`}>
                    {upperFirst(subgroup.name)}
                  </SectionLink>
                  <TokenList
                    list={subgroup.tokens}
                    scrollOffset={scrollOffset}
                    searchQuery={searchQuery}
                  />
                </Fragment>
              ) : null,
            )}
          </Fragment>
        ) : null;
      })
    ) : (
      <EmptyState
        header="No results found"
        description={
          <Fragment>
            If you can't find what you're looking for, try using the token
            wizard, visiting the{' '}
            <a href="https://atlassian.design/components/tokens/usage">
              usage guidelines
            </a>
            , or{' '}
            <a href="https://atlassian.design/components/tokens/examples">
              example guidelines
            </a>
          </Fragment>
        }
        imageUrl={noResultsImg}
      />
    )}
  </Fragment>
);

export default TokenGroups;
