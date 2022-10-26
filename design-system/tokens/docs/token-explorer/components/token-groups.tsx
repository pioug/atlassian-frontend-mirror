/** @jsx jsx */
import { Fragment } from 'react';

import { jsx } from '@emotion/react';
import upperFirst from 'lodash/upperFirst';

import Heading from '@atlaskit/heading';
import { gridSize } from '@atlaskit/theme/constants';

// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import SectionLink from '../../../../../../services/design-system-docs/src/components/section-link';
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
            <div css={{ marginTop: `${gridSize() * 6}px` }}>
              <SectionLink id={group.name}>
                <Heading level="h700">{upperFirst(group.name)}</Heading>
              </SectionLink>
            </div>
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
                  <div
                    css={{
                      margin: `${gridSize() * 6}px 0 ${gridSize() * 3}px`,
                    }}
                  >
                    <SectionLink id={`${group.name}-${subgroup.name}`}>
                      <Heading level="h700">
                        {upperFirst(subgroup.name)}
                      </Heading>
                    </SectionLink>
                  </div>
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
