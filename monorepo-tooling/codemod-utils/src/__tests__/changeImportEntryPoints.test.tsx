import { changeImportEntryPoint, createTransformer } from '../utils';

const changeImportEntryPointsForConfluenceSchema = changeImportEntryPoint(
	'@atlaskit/adf-schema',
	'confluenceSchema',
	'@atlaskit/adf-schema/schema-confluence',
);

const changeImportEntryPointsForConfluenceSchemaWithMediaSingle = changeImportEntryPoint(
	'@atlaskit/adf-schema',
	'confluenceSchemaWithMediaSingle',
	'@atlaskit/adf-schema/schema-confluence',
);

const transformer = createTransformer([
	changeImportEntryPointsForConfluenceSchema,
	changeImportEntryPointsForConfluenceSchemaWithMediaSingle,
]);

const { defineInlineTest } = require('jscodeshift/dist/testUtils');

describe('changeImportEntryPoints', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import { confluenceSchema } from "@atlaskit/adf-schema";
    `,
		`
      import { confluenceSchema } from "@atlaskit/adf-schema/schema-confluence";
    `,
		'should change entry point for importing with single import entities',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import { confluenceSchema as schema } from "@atlaskit/adf-schema";
    `,
		`
      import { confluenceSchema as schema } from "@atlaskit/adf-schema/schema-confluence";
    `,
		'should change entry point for importing with single import entities but with different imported vs local names',
	);
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import { defaultSchema } from "@atlaskit/adf-schema";
    `,
		`
      import { defaultSchema } from "@atlaskit/adf-schema";
    `,
		'should NOT change entry point for importing with single import entities that are not the correct schema',
	);
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import { bitbucketSchema, confluenceSchema } from "@atlaskit/adf-schema";
    `,
		`
      import { confluenceSchema } from "@atlaskit/adf-schema/schema-confluence";
      import { bitbucketSchema } from "@atlaskit/adf-schema";
    `,
		'should change entry point for for the correct schema when there are two input specifiers',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import { confluenceSchema, bitbucketSchema } from "@atlaskit/adf-schema";
      import { imaginarySchema } from "@atlaskit/adf-schema/schema-confluence";
    `,
		`
      import { bitbucketSchema } from "@atlaskit/adf-schema";
      import { imaginarySchema, confluenceSchema } from "@atlaskit/adf-schema/schema-confluence";
    `,
		'should add to existing entry point when importing multiple import entities',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
    import {
      bitbucketSchema,
      confluenceSchema,
      createJIRASchema,
      uuid,
    } from "@atlaskit/adf-schema";
    `,
		`
    import { confluenceSchema } from "@atlaskit/adf-schema/schema-confluence";
    import { bitbucketSchema, createJIRASchema, uuid } from "@atlaskit/adf-schema";
    `,
		'should change entry point for importing with multiple import entities',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
    import {
      bitbucketSchema,
      confluenceSchema,
      createJIRASchema,
      confluenceSchemaWithMediaSingle,
    } from "@atlaskit/adf-schema";
    `,
		`
    import { confluenceSchema, confluenceSchemaWithMediaSingle } from "@atlaskit/adf-schema/schema-confluence";
    import { bitbucketSchema, createJIRASchema } from "@atlaskit/adf-schema";
    `,
		'should change multiple entry point for importing with multiple import entities',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
    import {
      confluenceSchema as schema,
      getSchemaBasedOnStage,
      confluenceSchemaWithMediaSingle,
      defaultSchema,
    } from "@atlaskit/adf-schema";
    `,
		`
    import { confluenceSchema as schema, confluenceSchemaWithMediaSingle } from "@atlaskit/adf-schema/schema-confluence";
    import { getSchemaBasedOnStage, defaultSchema } from "@atlaskit/adf-schema";

    `,
		'should change entry point for importing with multiple import entities and as',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
    import {
      confluenceSchema as schema,
      getSchemaBasedOnStage,
      confluenceSchemaWithMediaSingle,
      defaultSchema,
    } from "@atlaskit/adf-schema";
    import { confluenceSchema } from '@anotherPackage';
    `,
		`
    import { confluenceSchema as schema, confluenceSchemaWithMediaSingle } from "@atlaskit/adf-schema/schema-confluence";
    import { getSchemaBasedOnStage, defaultSchema } from "@atlaskit/adf-schema";
    import { confluenceSchema } from '@anotherPackage';

    `,
		'should change entry point for importing with multiple import entities but not touch any from another package with the same specifier',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
    import { confluenceSchema } from "@atlaskit/adf-schema";
    import dispatchPasteEvent from "@atlaskit/editor-test-helpers/dispatch-paste-event";
    import { doc } from "@atlaskit/editor-test-helpers/doc-builder";
    import { uuid } from "@atlaskit/adf-schema";
    `,
		`
    import { confluenceSchema } from "@atlaskit/adf-schema/schema-confluence";
    import dispatchPasteEvent from "@atlaskit/editor-test-helpers/dispatch-paste-event";
    import { doc } from "@atlaskit/editor-test-helpers/doc-builder";
    import { uuid } from "@atlaskit/adf-schema";
    `,
		'should only change target specifier entrypoint when multiple imports from the same package/entrypoint exist',
	);
});
