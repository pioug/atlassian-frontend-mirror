import Ajv from 'ajv';

import { readFilesSync } from '../../../../test-helpers';
import { name } from '../../../version.json';
import v1SchemaFull from '../../../../json-schema/v1/full.json';
import v1SchemaStage0 from '../../../../json-schema/v1/stage-0.json';

// TODO: We did this change when we bump ajv version 6.
// It will be refactored in this ticket: https://product-fabric.atlassian.net/browse/ED-10888.
const ajv = new Ajv({
  jsonPointers: true,
  schemaId: 'auto',
  meta: false, // optional, to prevent adding draft-06 meta-schema
  extendRefs: true, // optional, current default is to 'fail', spec behaviour is to 'ignore'
  unknownFormats: 'ignore', // optional, current default is true (fail)
});

const metaSchema = require('ajv/lib/refs/json-schema-draft-04.json');
ajv.addMetaSchema(metaSchema);
(ajv._opts as any).defaultMeta = metaSchema.id;

// optional, using unversioned URI is out of spec, see https://github.com/json-schema-org/json-schema-spec/issues/216
(ajv as any)._refs['http://json-schema.org/schema'] =
  'http://json-schema.org/draft-04/schema';

// Optionally you can also disable keywords defined in draft-06
ajv.removeKeyword('propertyNames');
ajv.removeKeyword('contains');
ajv.removeKeyword('const');

describe(`${name} json-schema v1`, () => {
  const validateFull = ajv.compile(v1SchemaFull);
  const validateStage0 = ajv.compile(v1SchemaStage0);

  const valid = readFilesSync(`${__dirname}/v1-reference/full/valid`);
  describe('full', () => {
    for (const file of valid) {
      it(`validates '${file.name}'`, () => {
        validateFull(file.data);
        expect(validateFull.errors).toEqual(null);
        // Valid `full` use cases should be valid against `stage-0` schema
        validateStage0(file.data);
        expect(validateStage0.errors).toEqual(null);
      });
    }

    const invalid = readFilesSync(`${__dirname}/v1-reference/full/invalid`);
    for (const file of invalid) {
      it(`does not validate '${file.name}'`, () => {
        expect(validateFull(file.data)).toEqual(false);
      });
    }
  });

  describe('stage-0', () => {
    const valid = readFilesSync(`${__dirname}/v1-reference/stage-0/valid`);
    for (const file of valid) {
      it(`validates '${file.name}'`, () => {
        validateStage0(file.data);
        expect(validateStage0.errors).toEqual(null);
        // Valid `stage-0` use cases should be invalid against `full` schema
        expect(validateFull(file.data)).toEqual(false);
      });
    }

    const invalid = readFilesSync(`${__dirname}/v1-reference/stage-0/invalid`);
    for (const file of invalid) {
      it(`does not validate '${file.name}'`, () => {
        expect(validateStage0(file.data)).toEqual(false);
      });
    }
  });
});
