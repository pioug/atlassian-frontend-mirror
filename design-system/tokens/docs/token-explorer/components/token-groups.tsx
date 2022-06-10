/** @jsx jsx */
import { Fragment } from 'react';

import { jsx } from '@emotion/core';
import upperFirst from 'lodash/upperFirst';

// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import SectionLink from '../../../../../../services/website-constellation/src/__DO_NOT_ADD_TO_THIS_FOLDER__/gatsby-theme-brisk/components/section-link';
import type { TokenGroup } from '../grouped-tokens';

import NoResults from './no-results';
import TokenList from './token-list';

export interface TokenGroupsProps {
  /**
   * Offset the sticky table header to avoid overlapping existing fixed elements.
   */
  scrollOffset?: number;
  groups: TokenGroup[];
  hasDescription?: boolean;
  hasLifecycle?: boolean;
  testId?: string;
}

const TokenGroups = ({
  groups,
  scrollOffset = 0,
  testId,
}: TokenGroupsProps) => (
  <div data-testid={testId && `${testId}-token-groups`}>
    {groups.length > 0 ? (
      groups.map((group) => {
        const hasTokens = group.tokens.length > 0;

        const hasSubgroupTokens = group.subgroups?.some(
          (subgroup) => subgroup.tokens.length > 0,
        );

        return hasTokens || hasSubgroupTokens ? (
          <div key={group.name} data-testid={testId && `${testId}-token-group`}>
            <SectionLink level={2} id={group.name}>
              {upperFirst(group.name)}
            </SectionLink>
            {hasTokens && (
              <TokenList
                list={group.tokens}
                scrollOffset={scrollOffset}
                testId={testId}
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
                  />
                </Fragment>
              ) : null,
            )}
          </div>
        ) : null;
      })
    ) : (
      <NoResults />
    )}
  </div>
);

export default TokenGroups;
