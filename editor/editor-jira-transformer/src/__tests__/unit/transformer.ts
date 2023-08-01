import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import createJIRASchema from '@atlaskit/adf-schema/schema-jira';
import { JIRATransformer } from '../..';

import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';

const transformer = new JSONTransformer();
const toJSON = (node: PMNode) => transformer.encode(node);

describe('Jira Transformer', () => {
  describe('encode', () => {
    const standardEmptyAdf: JSONDocNode = {
      type: 'doc',
      version: 1,
      content: [],
    };

    it('should create a standard empty adf for empty JIRA', () => {
      const schema = createJIRASchema({
        allowBlockQuote: true,
        allowLists: true,
      });
      const jiraTransformer = new JIRATransformer(schema);

      expect(toJSON(jiraTransformer.parse(''))).toEqual(standardEmptyAdf);
    });
  });
});
