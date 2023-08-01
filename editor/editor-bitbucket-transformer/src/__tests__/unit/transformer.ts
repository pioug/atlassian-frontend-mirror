import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { bitbucketSchema } from '@atlaskit/adf-schema/schema-bitbucket';
import { BitbucketTransformer } from '../..';

import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';

const transformer = new JSONTransformer();
const toJSON = (node: PMNode) => transformer.encode(node);

describe('Bitbucket Transformer', () => {
  describe('encode', () => {
    const standardEmptyAdf: JSONDocNode = {
      type: 'doc',
      version: 1,
      content: [],
    };

    it('should create a standard empty adf for empty Bitbucket', () => {
      const bitbucketTransformer = new BitbucketTransformer(bitbucketSchema);
      expect(toJSON(bitbucketTransformer.parse(''))).toEqual(standardEmptyAdf);
    });
  });
});
