import { JsonLd } from 'json-ld-types';
import { LinkLozenge } from './types';
import { isValidAppearance } from './utils';

export const extractTag = (
  jsonLd: JsonLd.Data.Task,
): LinkLozenge | undefined => {
  const tag = jsonLd.tag;
  if (tag) {
    if (typeof tag === 'string') {
      return { text: tag, appearance: 'default' };
    } else if (Array.isArray(tag)) {
      const tags = tag.map(extractTagItem).filter((item) => !!item);
      if (tags.length > 0) {
        return tags.shift();
      }
    } else {
      return extractTagItem(tag);
    }
  }
};

const extractTagItem = (
  tag: JsonLd.Primitives.Object | JsonLd.Primitives.Link,
): LinkLozenge | undefined => {
  if (typeof tag === 'string') {
    return { text: tag, appearance: 'default' };
  } else if (tag['@type'] === 'Link') {
    if (tag.name) {
      return { text: tag.name, appearance: 'default' };
    }
  } else {
    if (tag.name) {
      const appearance = (tag as any).appearance;
      return {
        text: tag.name,
        // Jira currently uses tag.appearance to set the lozenge color. Remove this
        // once we migrate them away from using this old spec.
        appearance: (isValidAppearance(appearance) && appearance) || 'default',
      };
    }
  }
};
