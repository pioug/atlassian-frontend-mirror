import { Identifier } from '@atlaskit/media-client';

let lastKey = 1;
const identifiersMap: Map<Promise<string>, string> = new Map();

// Returns the same key given the same Card Identifier.
// This is needed to keep a consistent react element key for lists
// when given different types of objects
export const generateIdentifierKey = (identifier: Identifier): string => {
  switch (identifier.mediaItemType) {
    case 'external-image':
      return identifier.dataURI;
    case 'file':
      if (typeof identifier.id === 'string') {
        return identifier.id;
      } else {
        const currentKey = identifiersMap.get(identifier.id);
        if (currentKey) {
          return currentKey;
        }
        // We want to increment the key before using it
        lastKey++;
        const newKey = `${lastKey}`;
        identifiersMap.set(identifier.id, newKey);
        return newKey;
      }
  }
};
