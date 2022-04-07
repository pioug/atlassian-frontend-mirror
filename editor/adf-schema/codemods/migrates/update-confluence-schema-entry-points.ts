import { changeImportEntryPoint } from '@atlaskit/codemod-utils';

export const updateImportEntryPointsForConfluenceSchema = [
  changeImportEntryPoint(
    '@atlaskit/adf-schema',
    'confluenceSchema',
    '@atlaskit/adf-schema/schema-confluence',
  ),
  changeImportEntryPoint(
    '@atlaskit/adf-schema',
    'confluenceSchemaWithMediaSingle',
    '@atlaskit/adf-schema/schema-confluence',
  ),
];
