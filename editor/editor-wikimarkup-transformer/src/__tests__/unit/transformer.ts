import type { Node as PMNode } from 'prosemirror-model';

import { WikiMarkupTransformer } from '../..';

import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';

const transformer = new JSONTransformer();
const toJSON = (node: PMNode) => transformer.encode(node);

describe('WikiMarkup Transformer', () => {
  describe('encode', () => {
    const standardEmptyAdf: JSONDocNode = {
      type: 'doc',
      version: 1,
      content: [],
    };

    it('should create a standard empty adf for empty WikiMarkup', () => {
      const wikiMarkupTransformer = new WikiMarkupTransformer();

      expect(toJSON(wikiMarkupTransformer.parse(''))).toEqual(standardEmptyAdf);
    });
  });
});
