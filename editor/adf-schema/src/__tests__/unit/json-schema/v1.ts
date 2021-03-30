import { initialize } from '@atlaskit/editor-test-helpers/ajv';

import { readFilesSync } from '../../../../test-helpers';
import { name } from '../../../version.json';
import v1SchemaFull from '../../../../json-schema/v1/full.json';
import v1SchemaStage0 from '../../../../json-schema/v1/stage-0.json';

const ajv = initialize();

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
