import type { Node as PMNode } from 'prosemirror-model';

import { ConfluenceTransformer } from '..';
import { confluenceSchema } from '@atlaskit/adf-schema/schema-confluence';

import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';

const transformer = new JSONTransformer();
const toJSON = (node: PMNode) => transformer.encode(node);

describe('Confluence Transformer', () => {
  describe('encode', () => {
    const standardEmptyAdf: JSONDocNode = {
      type: 'doc',
      version: 1,
      content: [],
    };

    it('should create a standard empty adf for empty Confluence', () => {
      const confluenceTransformer = new ConfluenceTransformer(confluenceSchema);

      expect(toJSON(confluenceTransformer.parse('<p />'))).toEqual(
        standardEmptyAdf,
      );
    });
  });
});
