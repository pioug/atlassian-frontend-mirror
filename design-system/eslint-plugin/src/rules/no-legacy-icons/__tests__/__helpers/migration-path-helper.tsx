/**
 * ------------------- Exported Icon tests -------------------
 */
export const migrationPathTests = [
	{
		options: [{ shouldUseMigrationPath: false }],
		name: 'Icon that imported from the core migration path, with LEGACY_color prop',
		code: `
		import AddIcon from '@atlaskit/icon/core/migration/add';

		<AddIcon label="" LEGACY_size="medium" />
		`,
		output: `
		import AddIcon from '@atlaskit/icon/core/add';

		<AddIcon label=""  />
		`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
		],
	},
	{
		options: [{ shouldUseMigrationPath: false }],
		name: 'Icon that imported from the core migration path, new and legacy icon names are different',
		code: `
		import DocumentIcon from '@atlaskit/icon/core/migration/page--document';

		<DocumentIcon label="" />
		`,
		output: `
		import DocumentIcon from '@atlaskit/icon/core/page';

		<DocumentIcon label="" />
		`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
		],
	},
	{
		options: [{ shouldUseMigrationPath: false }],
		name: 'Icon that imported from the core migration path, with color override',
		code: `
		import AddIcon from '@atlaskit/icon/core/migration/add';

		<AddIcon label="" color={token("color.icon")} LEGACY_size="small" />
		`,
		output: `
		import AddIcon from '@atlaskit/icon/core/add';

		<AddIcon label="" color={token("color.icon")}  />
		`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
		],
	},
	{
		options: [{ shouldUseMigrationPath: false }],
		name: 'Icon that imported from the utility migration path, with LEGACY_secondaryColor prop',
		code: `
		import ErrorIcon from '@atlaskit/icon/utility/migration/error';

		<ErrorIcon label="" LEGACY_secondaryColor={token("color.icon")} />
		`,
		output: `
		import ErrorIcon from '@atlaskit/icon/utility/error';

		<ErrorIcon label=""  />
		`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
		],
	},
];
