import { name } from '../../../version.json';
import Ajv from 'ajv';
import { readFilesSync } from '../../../../test-helpers';

import v1schemaFull from '../../../../json-schema/v1/full.json';
import v1schemaStage0 from '../../../../json-schema/v1/stage-0.json';

const ajv = new Ajv();

const schemas = {
  full: v1schemaFull,
  'stage-0': v1schemaStage0,
};

describe(`${name} json-schema v1`, () => {
  Object.keys(schemas).map(schemaName => {
    let invalid: { name: string; data: any }[] = [];
    let valid: { name: string; data: any }[] = [];
    const schema = schemas[schemaName as keyof typeof schemas];
    const validate = ajv.compile(schema);
    valid = readFilesSync(`${__dirname}/v1-reference/${schemaName}/valid`);
    invalid = readFilesSync(`${__dirname}/v1-reference/${schemaName}/invalid`);
    describe(schemaName, () => {
      for (let file of valid) {
        it(`validates '${file.name}'`, () => {
          validate(file.data);
          expect(validate.errors).toEqual(null);
        });
      }
      for (let file of invalid) {
        it(`does not validate '${file.name}'`, () => {
          expect(validate(file.data)).toEqual(false);
        });
      }
    });
  });
});
