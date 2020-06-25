import { JsonLd } from 'json-ld-types';
import { extractorPriorityMap } from '../icon/priority';
import { R500 } from '@atlaskit/theme/colors';

export const extractTitleTextColor = (
  jsonLd: JsonLd.Primitives.Object,
): string | undefined => {
  const type = jsonLd['@type'];
  if (Array.isArray(type)) {
    const highestPriorityType = type.sort(
      (a, b) => extractorPriorityMap[b] - extractorPriorityMap[a],
    )[0];
    switch (highestPriorityType) {
      case 'atlassian:UndefinedLink':
        return R500;
      default:
        return undefined;
    }
  }
};
