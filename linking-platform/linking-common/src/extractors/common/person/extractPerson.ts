import { JsonLd } from 'json-ld-types';
import { LinkPerson } from './types';
import { extractUrlFromIconJsonLd } from '../url';
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export const extractPersonFromJsonLd = (
  person: JsonLd.Primitives.Object | JsonLd.Primitives.Link,
): LinkPerson | undefined => {
  if (typeof person === 'string') {
    throw Error('Link.person needs to be an object.');
  } else if (person['@type'] === 'Link') {
    if (person.name) {
      return { name: person.name };
    }
  } else {
    if (person.name) {
      return {
        name: person.name,
        src: person.icon && extractUrlFromIconJsonLd(person.icon),
      };
    }
  }
};
