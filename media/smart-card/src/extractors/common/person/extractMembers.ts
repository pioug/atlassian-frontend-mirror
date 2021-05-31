import { JsonLd } from 'json-ld-types';
import { extractPersonFromJsonLd } from '../utils';
import { LinkPerson } from './types';

export const extractMembers = (
  jsonLd: JsonLd.Data.Project,
): LinkPerson[] | undefined => {
  const members = jsonLd['atlassian:member'];
  if (members) {
    if (typeof members === 'string') {
      throw Error('Link[atlassian:members] must be an array or object.');
    } else if (members.hasOwnProperty('totalItems')) {
      const collection = members as JsonLd.Primitives.Collection<
        JsonLd.Primitives.Person
      >;
      if (collection.items) {
        return (collection.items as JsonLd.Primitives.Person[])
          .map((member) => extractPersonFromJsonLd(member))
          .filter((member) => !!member) as LinkPerson[];
      }
    } else {
      const memberItem = members as
        | JsonLd.Primitives.Link
        | JsonLd.Primitives.Person;
      const memberItemForLink = extractPersonFromJsonLd(memberItem);
      if (memberItemForLink) {
        return [memberItemForLink];
      }
    }
  }
};
