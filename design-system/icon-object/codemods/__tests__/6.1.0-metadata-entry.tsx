jest.disableAutomock();

import transformer, { packageName } from '../6.1.0-metadata-entry';

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
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import { metadata } from 'not-${packageName}';
    `,
    `
      import { metadata } from 'not-${packageName}';
    `,
    'should not affect other packages',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import { metadata } from '${packageName}/foo';
    `,
    `
      import { metadata } from '${packageName}/foo';
    `,
    'should not affect other entrypoints',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import { metadata } from '@atlaskit/icon';
      import { metadata as objectIconMetadata } from '@atlaskit/icon-object';
      import { metadata as fileTypeIconMetadata } from '@atlaskit/icon-file-type';
      import { metadata as priorityIconMetadata } from '@atlaskit/icon-priority';
    `,
    `
      import { metadata } from '@atlaskit/icon';
      import objectIconMetadata from '@atlaskit/icon-object/metadata';
      import { metadata as fileTypeIconMetadata } from '@atlaskit/icon-file-type';
      import { metadata as priorityIconMetadata } from '@atlaskit/icon-priority';
    `,
    'should work as expected on a real-world case',
  );
});
