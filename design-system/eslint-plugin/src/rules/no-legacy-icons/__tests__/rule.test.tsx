import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

import { migrationPathTests } from './__helpers/migration-path-helper';
import {
	colorTests,
	exportedIconTests,
	iconMapOrArray,
	iconsInCustomComponent,
	newButtonTests,
	oldButtonTests,
	sizeTests,
	spreadPropsTests,
} from './__helpers/test-helper';

/**
 * Run the tests
 */

describe('no-legacy-icons', () => {
	tester.run('basic cases', rule, {
		valid: [
			{
				name: 'New Icon being used',
				code: `
				import AddIcon from '@atlaskit/icon/core/add';
				<AddIcon label=""/>
				`,
			},
			{
				name: 'New Icon being rendered in a component',
				code: `
				import AddIcon from '@atlaskit/icon/core/add';
				()=> {
					<AddIcon label=""/>
				}
			`,
			},
			{
				name: 'New Icon being used with Legacy fallback',
				code: `
				import AddIcon from '@atlaskit/icon/core/add';
				import AddIconOld from '@atlaskit/icon/glyph/add';
				<AddIcon label="" LEGACY_fallbackIcon={AddIconOld}/>
				`,
			},
			{
				name: 'New Icon being used with Legacy fallback and other unused legacy imports',
				code: `
				import AddIcon from '@atlaskit/icon/glyph/add';
				import AddIconNew from '@atlaskit/icon/core/add';
				import Branch16Icon from '@atlaskit/icon-object/glyph/branch/16';
				<AddIconNew label="" />
				`,
			},
			{
				name: 'New Icon being used with Legacy fallback in new button',
				code: `
				import AddIconLegacy from '@atlaskit/icon/glyph/add';
				import AddIcon from '@atlaskit/icon/core/add';
				import Button from '@atlaskit/button/new';
				<Button icon={<AddIcon LEGACY_fallbackIcon={AddIconLegacy} label="" />}> Add </Button>
				`,
			},
			{
				name: 'New Icon being used with Legacy fallback in new icon button',
				code: `
				import AddIconLegacy from '@atlaskit/icon/glyph/add';
				import AddIcon from '@atlaskit/icon/core/add';
				import { IconButton } from '@atlaskit/button/new';
				<IconButton icon={<AddIcon LEGACY_fallbackIcon={AddIconLegacy} label="" />}> Add </IconButton>
				`,
			},
			{
				name: 'New Icon being used with Legacy fallback in new renamed icon button. Rendered as a function',
				code: `
				import AddIconLegacy from '@atlaskit/icon/glyph/add';
				import AddIcon from '@atlaskit/icon/core/add';
				import { IconButton as IButton } from '@atlaskit/button/new';
				<IButton label="" icon={ (iconProps) => <AddIcon LEGACY_fallbackIcon={AddIconLegacy} {...iconProps}/>}> Add </IButton>
				`,
			},
			{
				name: 'New Icon being used with Legacy fallback in new renamed icon button. Rendered as a reference',
				code: `
				import AddIcon from '@atlaskit/icon/core/add';
				import { IconButton as IButton } from '@atlaskit/button/new';
				<IButton icon={AddIcon} label=""> Add </IButton>
				`,
			},
			{
				name: 'New Icon being renamed and then used',
				code: `
				import AddIcon from '@atlaskit/icon/core/add';
				const DefaultIcon = AddIcon;
				<DefaultIcon label="" />
				`,
			},
			{
				name: 'New Icon being renamed and used in renamed icon button',
				code: `
				import AddIcon from '@atlaskit/icon/core/add';
				import { IconButton as IButton } from '@atlaskit/button/new';
				const DefaultButton = IButton;
				const DefaultIcon = AddIcon;
				<DefaultButton icon={DefaultIcon} label=""> Add </DefaultButton>
				`,
			},
			{
				name: 'Renamed new icon being used in custom component',
				code: `
				import AddIcon from '@atlaskit/icon/core/add';
				import { IconButton as IButton } from '@atlaskit/button/new';
				const DefaultIcon = AddIcon;
				const DefaultButton = (icon) => <IButton icon={icon} label=""> Add </IButton>;
				<div>{DefaultButton(DefaultIcon)}</div>
				`,
			},
			{
				name: 'New Icon passed in to custom component by reference',
				code: `
				import AddIcon from '@atlaskit/icon/core/add';
				import CustomComponent from '../src';
				<CustomComponent icon={AddIcon} label=""> Add </CustomComponent>
				`,
			},
			{
				name: 'New Icon being with Legacy falllback that is spreading props',
				code: `
				// Spread props inside LEGACY_fallbackIcon
				import AddIcon from '@atlaskit/icon/glyph/add';
				import Icon from '@atlaskit/icon/core/add';
				<Icon LEGACY_fallbackIcon={(props) => <AddIcon {...props}/>} label="" />
				`,
			},
			{
				name: 'New Icon in icon tile',
				code: `
				// Icon Tile usage
				import { IconTile } from '@atlaskit/icon';
				import AddIcon from '@atlaskit/icon/core/add';

				<IconTile icon={AddIcon} size="small" color="gray" label="" />
				`,
			},
		],
		invalid: [
			{
				name: 'Basic, auto-migratable icon',
				code: `
				import AddIcon from '@atlaskit/icon/glyph/add';

				<AddIcon label="" size="medium" />
				`,
				output: `
				import AddIcon from '@atlaskit/icon/core/migration/add';

				<AddIcon color="currentColor" label="" LEGACY_size="medium" spacing="spacious" />
				`,
				errors: [
					{
						messageId: 'noLegacyIconsAutoMigration',
					},
				],
			},
			{
				options: [{ shouldUseMigrationPath: false }],
				name: 'Basic, auto-migratable small icon, import from the final core path',
				code: `
				import AddIcon from '@atlaskit/icon/glyph/add';

				<AddIcon label="" size="small" />
				`,
				output: `
				import AddIcon from '@atlaskit/icon/core/add';

				<AddIcon color="currentColor" label=""  />
				`,
				errors: [
					{
						messageId: 'noLegacyIconsAutoMigration',
					},
				],
			},
			{
				options: [{ shouldUseMigrationPath: false }],
				name: 'Basic, auto-migratable medium icon, import from the final core path',
				code: `
				import AddIcon from '@atlaskit/icon/glyph/add';

				<AddIcon label="" size="medium" />
				`,
				output: `
				import AddIcon from '@atlaskit/icon/core/add';

				<AddIcon color="currentColor" label=""  spacing="spacious" />
				`,
				errors: [
					{
						messageId: 'noLegacyIconsAutoMigration',
					},
				],
			},
			{
				options: [{ shouldUseMigrationPath: false }],
				name: 'Basic, auto-migratable icon, import from the final utility path',
				code: `
				import ChevronLeftIcon from '@atlaskit/icon/glyph/chevron-left';

				<ChevronLeftIcon label="" size="medium" />
				`,
				output: `
				import ChevronLeftIcon from '@atlaskit/icon/utility/chevron-left';

				<ChevronLeftIcon color="currentColor" label=""  />
				`,
				errors: [
					{
						messageId: 'noLegacyIconsAutoMigration',
					},
				],
			},
			{
				name: 'Basic, auto-migratable icon, import from migration path, the new icon name has been changed',
				code: `
				import DocumentIcon from '@atlaskit/icon/glyph/document';

				<DocumentIcon label="" />
				`,
				output: `
				import DocumentIcon from '@atlaskit/icon/core/migration/page--document';

				<DocumentIcon color="currentColor" spacing="spacious" label="" />
				`,
				errors: [
					{
						messageId: 'noLegacyIconsAutoMigration',
					},
				],
			},
			{
				name: 'Basic, auto-migratable medium size icon',
				code: `
				import AddIcon from '@atlaskit/icon/glyph/add';

				<AddIcon label="" size="medium" />
				`,
				output: `
				import AddIcon from '@atlaskit/icon/core/migration/add';

				<AddIcon color="currentColor" label="" LEGACY_size="medium" spacing="spacious" />
				`,
				errors: [
					{
						messageId: 'noLegacyIconsAutoMigration',
					},
				],
			},
			{
				name: 'Upcoming Icons small size',
				code: `
				// Icon Tile usage
				import { IconTile } from '@atlaskit/icon';
				import ReposIcon from '@atlaskit/icon/glyph/bitbucket/repos';

				<ReposIcon size="small" label="" />
				`,
				output: `
				// Icon Tile usage
				import { IconTile } from '@atlaskit/icon';
				import ReposIcon from '@atlaskit/icon/core/migration/angle-brackets--bitbucket-repos';

				<ReposIcon color="currentColor" LEGACY_size="small" label="" />
				`,
				errors: [
					{
						messageId: 'noLegacyIconsAutoMigration',
					},
				],
			},
			{
				name: 'Upcoming Icons large size',
				code: `
				// Icon Tile usage
				import { IconTile } from '@atlaskit/icon';
				import ReposIcon from '@atlaskit/icon/glyph/bitbucket/repos';

				<ReposIcon size="large" label="" />
				`,
				errors: [
					{
						messageId: 'noLegacyIconsManualMigration',
					},
					{
						messageId: 'cantFindSuitableReplacement',
					},
				],
			},
			{
				name: 'Basic, auto-migratable icon - renamed import',
				code: `
				import {default as ChevronDownIcon} from '@atlaskit/icon/glyph/chevron-down';

				<ChevronDownIcon label="" />
				`,
				output: `
				import {default as ChevronDownIcon} from '@atlaskit/icon/utility/migration/chevron-down';

				<ChevronDownIcon color="currentColor" label="" />
				`,
				errors: [
					{
						messageId: 'noLegacyIconsAutoMigration',
					},
				],
			},
			{
				name: 'Basic, auto-migratable icon - renamed import 2',
				code: `
				import AddIcon, {default as AddIcon2} from '@atlaskit/icon/glyph/add';

				<div>
					<AddIcon label="" />
					<AddIcon2 label="" />
				</div>
				`,
				output: `
				import AddIcon, {default as AddIcon2} from '@atlaskit/icon/core/migration/add';

				<div>
					<AddIcon color="currentColor" spacing="spacious" label="" />
					<AddIcon2 color="currentColor" spacing="spacious" label="" />
				</div>
				`,
				errors: Array(4).fill({
					messageId: 'noLegacyIconsAutoMigration',
				}),
			},
			{
				name: 'Icon object with no migration advice',
				code: `
				import Branch16Icon from '@atlaskit/icon-object/glyph/branch/16';

				<Branch16Icon label="" />
				//No migration advice given in migration map and thus this is a manual migration
				`,
				errors: [
					{
						messageId: 'noLegacyIconsManualMigration',
					},
					{
						messageId: 'cantFindSuitableReplacement',
					},
				],
			},
			{
				name: 'Renamed icon by reference',
				code: `
				import AddIcon from '@atlaskit/icon/glyph/add';

				const DefaultIcon = AddIcon;

				<DefaultIcon label="" />
				`,
				errors: [
					{
						messageId: 'noLegacyIconsManualMigration',
					},
					{
						messageId: 'cantMigrateIdentifier',
					},
					{
						messageId: 'noLegacyIconsManualMigration',
					},
					{
						messageId: 'cantMigrateIdentifier',
					},
					{
						messageId: 'noLegacyIconsAutoMigration',
					},
				],
			},
			{
				name: 'Icon as a function parameter',
				code: `
				import AddIcon from '@atlaskit/icon/glyph/add';
				import CustomComponent from '@atlaskit/custom';

				const DefaultIcon = (icon) => <CustomComponent icon={icon} >something...</CustomComponent>;

				<div>{DefaultIcon(AddIcon)}</div>
			  `,
				errors: [
					{
						messageId: 'noLegacyIconsManualMigration',
					},
					{
						messageId: 'cantMigrateFunctionUnknown',
					},
				],
			},
			{
				name: 'Icon renamed and used via function/ternary',
				code: `
				import AddIcon from '@atlaskit/icon/glyph/add';

				const value = true;
				const getAddIcon = ()=>{ return AddIcon; }

				const DefaultIcon = value ? AddIcon : <div/>;
				const DefaultIcon2 = getAddIcon();

				<>
					<DefaultIcon label="" />
					<DefaultIcon2 label="" />
				</>
				`,
				errors: [
					{
						messageId: 'noLegacyIconsManualMigration',
					},
					{
						messageId: 'cantMigrateIdentifier',
					},
					{
						messageId: 'noLegacyIconsManualMigration',
					},
					{
						messageId: 'cantMigrateIdentifier',
					},
				],
			},
		],
	});
	tester.run('exported icons', rule, {
		valid: [],
		invalid: [...exportedIconTests],
	});
	tester.run('Icon map or array', rule, {
		valid: [],
		invalid: [...iconMapOrArray],
	});
	tester.run('Icons in custom components', rule, {
		valid: [],
		invalid: [...iconsInCustomComponent],
	});
	tester.run('Icons in new buttons', rule, {
		valid: [],
		invalid: [...newButtonTests],
	});
	tester.run('Icons in old buttons', rule, {
		valid: [],
		invalid: [...oldButtonTests],
	});
	tester.run('Icons with spread props', rule, {
		valid: [],
		invalid: [...spreadPropsTests],
	});
	tester.run('Icons with size props', rule, {
		valid: [],
		invalid: [...sizeTests],
	});
	tester.run('Icons with color props', rule, {
		valid: [],
		invalid: [...colorTests],
	});
	tester.run('Icons imported from migration paths and with shouldUseMigrationPath=false', rule, {
		valid: [],
		invalid: [...migrationPathTests],
	});
});
