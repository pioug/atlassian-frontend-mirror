import upperFirst from 'lodash/upperFirst';

// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import { Heading } from '../../../../../services/design-system-docs/src/__DO_NOT_ADD_TO_THIS_FOLDER__/gatsby-theme-brisk/components/local-nav/heading-context';

import type { TokenGroup } from './grouped-tokens';
import type { TransformedTokenGrouped, TransformedTokenMerged } from './types';

export const filterTokens = <
  T extends TransformedTokenGrouped | TransformedTokenMerged,
>(
  list: Array<T>,
  filters: {
    showStates?: string[];
  },
): Array<T> =>
  list.filter(({ attributes }) => {
    const isMatchingState = filters?.showStates?.some(
      (state) => state === attributes?.state,
    );

    return isMatchingState;
  });

export const filterGroups = (
  groups: TokenGroup[],
  filters: {
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

/**
 * Generates side navigation headings from token groups
 */
const getTokenGroupHeading = (
  group: TokenGroup,
  depth: number,
  parentGroup?: TokenGroup,
): Heading => ({
  depth,
  id: `${parentGroup ? `${parentGroup.name}-` : ''}${group.name}`,
  value: `${upperFirst(group.name)}${
    group.tokens.length > 0 ? ` (${group.tokens.length})` : ''
  }`,
});
export const getTokenGroupHeadings = (groups: TokenGroup[]): Heading[] =>
  groups.flatMap((group) => [
    getTokenGroupHeading(group, 2),
    ...(group.subgroups
      ? group.subgroups.map((subgroup) =>
          getTokenGroupHeading(subgroup, 3, group),
        )
      : []),
  ]);
