import { generateADFDocument } from '@atlassian/adf-sample';
import type { JsonSchemaV4Object } from '@atlassian/adf-sample/types';
import {
  buildJSONSchema,
  isEnum,
  isString,
  isNumber,
  isArray,
} from '@atlassian/adf-sample/json-schema';
import { traverse } from '@atlaskit/adf-utils/traverse';

import * as fullSchema from '../../../../json-schema/v1/full.json';
import * as stageZeroSchema from '../../../../json-schema/v1/stage-0.json';
import { getSchemaBasedOnStage } from '../../../schema/default-schema';
import { DocNode } from '../../../schema/nodes/doc';

type JsonSchemaV4Attrs = JsonSchemaV4Object & {
  required?: string[];
  additionalProperties?: boolean;
};

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

const STAGE_ADF_MAP = [
  { name: 'final', adf: fullSchema },
  { name: 'stage0', adf: stageZeroSchema },
];

/**
 * typeAheadQuery, unsupportedMark and unsupportedNodeAttribute are
 * ephemeral marks and we don’t store them in ADF.
 *
 * We will need to deprecate and remove support for
 * confluenceInlineComment will need to be removed some time in the
 * future as we've moved onto annotations.
 */
const IGNORE_KNOWN_MARKS = [
  'confluenceInlineComment',
  'typeAheadQuery',
  'unsupportedMark',
  'unsupportedNodeAttribute',
];

const isPrivateVariable = (name: string) => name.startsWith('_');

// Temporary, will be removed in https://product-fabric.atlassian.net/servicedesk/customer/portal/99/DTR-169?created=true
// Docs with link marks currently fail test as schemas needed to diverge in following ticket
// https://product-fabric.atlassian.net/browse/ED-14043
// link mark only valid on children of paragraph and mediaSingle
const removeInvalidLinkMarks = (doc: DocNode) =>
  (traverse(doc, {
    paragraph: (node) => node,
    media: (node) => node,
    mediaGroup: (node) => {
      node.content = node.content?.map((childNode) => {
        if (childNode?.type === 'media') {
          childNode.marks = childNode.marks?.filter(
            (mark) => mark.type !== 'link',
          );
        }
        return childNode;
      });
      return node;
    },
    any: (node) => {
      node.marks = node.marks?.filter((mark) => mark.type !== 'link');
      return node;
    },
  }) as DocNode) || doc;

describe('Full JSON Schema', () => {
  /**
   * We run the test 25 times, because even if the document contains any valid path,
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
        const fullSchema = getSchemaBasedOnStage('final');
        expect(() => fullSchema.nodeFromJSON(doc).check()).not.toThrow(
          excludedNodesRegex,
        );

        // TODO: anything from full schema should be compatible with stage0 schema
      });
    },
  );
});

describe('Stage0 JSON Schema', () => {
  /**
   * We run the test 25 times, because even if the document contains any valid path,
   * the internal nodes attributes, etc are generated in a random approach, that will not cover some scenarios.
   */
  describe.each(Array.from({ length: 25 }))(
    'Stage0 Document Generated %#',
    () => {
      let doc: DocNode;
      beforeEach(() => {
        doc = removeInvalidLinkMarks(generateADFDocument(stageZeroSchema));
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

describe('check validity of default mark attributes', () => {
  // Do this for both final and stage0 schemas
  STAGE_ADF_MAP.forEach((stage) => {
    const schema = getSchemaBasedOnStage(stage.name);

    Object.keys(schema.marks)
      .filter((markName) => {
        if (isPrivateVariable(markName)) {
          return false;
        }
        return !IGNORE_KNOWN_MARKS.includes(markName);
      })
      .forEach((markName) => {
        /**
         * We need to manually check marks because node.check()
         * does NOT seem to validate attrs against the allowed
         * values in the schema.
         *
         * ie.
         * const content = schema.text('Test', [mark]);
         * content.check(); // <-- this does not throw
         */
        const markDef = stage.adf.definitions?.[
          `${markName}_mark`
        ] as JsonSchemaV4Object;
        expect(markDef).not.toBeUndefined();

        const attrsDef = markDef.properties.attrs as
          | JsonSchemaV4Attrs
          | undefined;

        if (!attrsDef) {
          return;
        }

        it(`for ${stage.name} ADF: mark ${markName}`, () => {
          // Create based off required (faked) and let ProseMirror
          // schema fill in the optional fields so we can verify the result
          const fakeDefAttrs = buildJSONSchema(stage.adf, markDef).attrs;
          const requiredAttrs = attrsDef.required?.reduce<Record<string, any>>(
            (accumulate, attrName) => {
              accumulate[attrName] = fakeDefAttrs[attrName];
              return accumulate;
            },
            {},
          );
          const mark = schema.marks[markName].create(requiredAttrs);

          // Check if any required fields are missing
          if (attrsDef.required) {
            attrsDef.required.forEach((attrName) => {
              expect(mark.attrs[attrName]).toBeDefined();
            });
          }

          // additionalProperties is allowed by default in JsonSchema
          // https://json-schema.org/understanding-json-schema/reference/object.html#additional-properties
          // However we explicitly turn it off by default when we
          // generate the ADF schema.
          if (attrsDef.additionalProperties === false) {
            const definedAttrs = Object.keys(attrsDef.properties);
            const extraAttrs = Object.keys(mark.attrs).filter(
              // We can ignore private attributes with leading _
              (key) => !isPrivateVariable(key) && !definedAttrs.includes(key),
            );
            expect(extraAttrs).toHaveLength(0);
          }

          // check if schema values satisfy type specified in ADF
          Object.keys(attrsDef.properties).forEach((attrName) => {
            const isRequired =
              attrsDef.required && attrsDef.required.includes(attrName);
            const value = mark.attrs[attrName];

            // Check if this attribute is required and has a value at all
            if (isRequired) {
              expect(value).not.toBeUndefined();
            }
            // If the attribute is optional and value isn't set, skip validation
            else if (value === undefined || value === null) {
              return;
            }

            const attrDef = attrsDef.properties[attrName];

            // Note: this is NOT an exhaustive list
            if (isString(attrDef)) {
              expect(typeof value).toEqual('string');
            } else if (isEnum(attrDef)) {
              expect(attrDef.enum).toContain(value);
            } else if (isNumber(attrDef)) {
              if (attrDef.minimum !== undefined) {
                expect(value).toBeGreaterThanOrEqual(attrDef.minimum);
              }
              if (attrDef.maximum !== undefined) {
                expect(value).toBeLessThanOrEqual(attrDef.maximum);
              }
            } else if (isArray(attrDef)) {
              if (attrDef.minItems) {
                expect(value.length).toBeGreaterThanOrEqual(attrDef.minItems);
              }
              if (attrDef.maxItems) {
                expect(value.length).toBeLessThanOrEqual(attrDef.maxItems);
              }

              if (attrDef.items) {
                const attrDefItems = attrDef.items;
                // Fortunately we don't really use anything other than string
                if (isString(attrDefItems)) {
                  const valueArray = value as any[];

                  valueArray.forEach((val) => {
                    expect(typeof val).toEqual(attrDefItems.type);
                  });
                } else {
                  throw Error(
                    `Unexpected attribute.items definition: ${JSON.stringify(
                      attrDef,
                    )}`,
                  );
                }
              }
            } else {
              throw Error(
                `Unexpected attribute definition: ${JSON.stringify(attrDef)}`,
              );
            }
          });
        });
      });
  });
});
