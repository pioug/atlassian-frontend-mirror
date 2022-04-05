import { JsonLd } from 'json-ld-types';
import { extractUrlFromLinkJsonLd } from '@atlaskit/linking-common';
import { LinkPerson } from './person/types';

export const extractUrlFromIconJsonLd = (
  icon: JsonLd.Primitives.Link | JsonLd.Primitives.Image,
): string | undefined => {
  if (typeof icon === 'string') {
    return icon;
  } else if (icon['@type'] === 'Link') {
    return extractUrlFromLinkJsonLd(icon);
  } else {
    if (icon.url) {
      return extractUrlFromLinkJsonLd(icon.url);
    }
  }
};

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
