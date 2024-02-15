import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

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

  describe('should parse jira issue node', () => {
    const html =
      '<ac:structured-macro ac:name="JIRA"><ac:parameter ac:name="key">testKey123</ac:parameter></ac:structured-macro>';

    it('should be parsed as text', () => {
      const expectedADF: JSONDocNode = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'testKey123',
              },
            ],
          },
        ],
      };
      const confluenceTransformer = new ConfluenceTransformer(confluenceSchema);

      expect(toJSON(confluenceTransformer.parse(html))).toEqual(expectedADF);
    });
  });
});
