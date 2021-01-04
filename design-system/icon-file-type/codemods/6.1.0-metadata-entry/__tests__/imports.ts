jest.disableAutomock();

import transformer, { packageName } from '../';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Update imports', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import { metadata } from '${packageName}';
      console.log(metadata);
    `,
    `
      import metadata from '${packageName}/metadata';
      console.log(metadata);
    `,
    'should replace named metadata import from main entry point with default import from dedicated entry point',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import { metadata as data } from '${packageName}';
      console.log(data);
    `,
    `
      import data from '${packageName}/metadata';
      console.log(data);
    `,
    'should preserve renaming when converting from named import to default import',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import { a, metadata, b } from '${packageName}';
      console.log(metadata);
    `,
    `
      import metadata from '${packageName}/metadata';
      import { a, b } from '${packageName}';
      console.log(metadata);
    `,
    'should preserve other named imports',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import { a, metadata as data, b } from '${packageName}';
      console.log(data);
    `,
    `
      import data from '${packageName}/metadata';
      import { a, b } from '${packageName}';
      console.log(data);
    `,
    'should preserve other named imports, as well as metadata renaming',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import Icon, { a, metadata as data, b } from '${packageName}';
      console.log(a, data, b);
    `,
    `
      import data from '${packageName}/metadata';
      import Icon, { a, b } from '${packageName}';
      console.log(a, data, b);
    `,
    'should preserve other named imports and default import, as well as metadata renaming',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import metadata from '${packageName}/metadata';
      console.log(metadata);
    `,
    `
      import metadata from '${packageName}/metadata';
      console.log(metadata);
    `,
    'should not affect existing good imports',
  );
});
