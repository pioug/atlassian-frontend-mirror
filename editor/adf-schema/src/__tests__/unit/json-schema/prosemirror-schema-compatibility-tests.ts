import { generateADFDocument } from '@atlassian/adf-sample';

import * as fullSchema from '../../../../json-schema/v1/full.json';
import * as stageZeroSchema from '../../../../json-schema/v1/stage-0.json';
import { getSchemaBasedOnStage } from '../../../schema/default-schema';
import { DocNode } from '../../../schema/nodes/doc';

const TMP_EXCLUDED_NODES = ['tableCell', 'tableHeader'];
/**
 * This is temporary fix, to be able to merge this tests until:
 *  * https://product-fabric.atlassian.net/browse/ED-12889
 *
 *  are fixed.
 *
 *  The last one on fixing these errors should remove this regex from the below tests.
 */
const excludedNodesRegex = new RegExp(
  `^Invalid content for node (?!${TMP_EXCLUDED_NODES.join('|')}).*`,
);

describe('Full JSON Schema', () => {
  /**
   * We run the test 10 times, because even if the document contains any valid path,
   * the internal nodes attributes, etc are generated in a random approach, that will not cover some scenarios.
   */
  describe.each(Array.from({ length: 25 }))(
    'Full Document Generated %#',
    () => {
      let doc: DocNode;
      beforeEach(() => {
        doc = generateADFDocument(fullSchema);
      });

      it(`should be compatible with full prosemirror schema `, () => {
        const schema = getSchemaBasedOnStage('final');
        expect(() => schema.nodeFromJSON(doc).check()).not.toThrow(
          excludedNodesRegex,
        );
      });
    },
  );
});

describe('Stage0 JSON Schema', () => {
  /**
   * We run the test 10 times, because even if the document contains any valid path,
   * the internal nodes attributes, etc are generated in a random approach, that will not cover some scenarios.
   */
  describe.each(Array.from({ length: 25 }))(
    'Stage0 Document Generated %#',
    () => {
      let doc: DocNode;
      beforeEach(() => {
        doc = generateADFDocument(stageZeroSchema);
      });

      it(`should be compatible with stage0 prosemirror schema `, () => {
        const schema = getSchemaBasedOnStage('stage0');
        expect(() => schema.nodeFromJSON(doc).check()).not.toThrow(
          excludedNodesRegex,
        );
      });
    },
  );
});
