/**
 * ------------------- Exported Icon tests -------------------
 */
export const exportedIconTests = [
	{
		name: 'Re-exported Icon',
		code: `
		import AddIcon from '@atlaskit/icon/glyph/add';

		export const NewIcon = AddIcon;
		`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateReExport',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Icon renamed and then exported',
		code: `
		import AddIcon from '@atlaskit/icon/glyph/add';
		const A = AddIcon;
		export default A;
		`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateReExport',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Re-exported Icon as default',
		code: `
		export { default as AddIcon } from '@atlaskit/icon/glyph/add';
		`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateReExport',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Export renamed icon and then used 1',
		code: `
		import AddIcon from '@atlaskit/icon/glyph/add';

		export const DefaultIcon = AddIcon;

		<DefaultIcon label="" />
		`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateReExport',
			},
			{
				messageId: 'guidance',
			},
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateReExport',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Export renamed icon and then used 2',
		code: `
		import AddIcon from '@atlaskit/icon/glyph/add';

		const DefaultIcon = AddIcon;

		export { DefaultIcon as default, AddIcon};

		<DefaultIcon label="" />
		`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateReExport',
			},
			{
				messageId: 'guidance',
			},
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateReExport',
			},
			{
				messageId: 'guidance',
			},
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateReExport',
			},
			{
				messageId: 'guidance',
			},
		],
	},
];

/**
 * ------------------- Icon Map or Array tests -------------------
 */
export const iconMapOrArray = [
	{
		name: 'Icons in a icon map',
		code: `
		import AddIcon from '@atlaskit/icon/glyph/add';
		import { token } from '@atlaskit/tokens';

		const iconMap = {
			primary: {
				icon: AddIcon,
				color: 'red',
			},
			dark: {
				icon: AddIcon,
				color: token('color.icon'),
			}
		}
	  	`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateIdentifier',
			},
			{
				messageId: 'guidance',
			},
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateIdentifier',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Icons in an exported icon array',
		code: `
		import AddIcon from '@atlaskit/icon/glyph/add';

		export const iconArray = [AddIcon];
		`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateIdentifier',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Icons in an icon array and then renamed before render',
		code: `
		import AddIcon from '@atlaskit/icon/glyph/add';

		const iconArray = [AddIcon];

		const MyIcon = iconArray[0];

		<MyIcon label="" />
		`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateIdentifier',
			},
			{
				messageId: 'guidance',
			},
		],
	},
];

/**
 * ------------------- Icons in custom component tests -------------------
 */
export const iconsInCustomComponent = [
	{
		name: 'Icon rendered in custom component',
		code: `
		import AddIcon from '@atlaskit/icon/glyph/add';
		import CustomComponent from '@atlaskit/custom';

		<CustomComponent myIcon={<AddIcon/>}/>
		`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Icon referenced in custom component',
		code: `
		import AddIcon from '@atlaskit/icon/glyph/add';
		import CustomComponent from '@atlaskit/custom';

		<CustomComponent myIcon={AddIcon}/>
		`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateFunctionUnknown',
			},
			{
				messageId: 'guidance',
			},
		],
	},
];

/**
 * ------------------- New Button tests -------------------
 */
export const newButtonTests = [
	/**
	 * ------------------- New Button tests -------------------
	 */
	{
		name: 'Icon in IconButton',
		code: `
	   	import AddIcon from '@atlaskit/icon/glyph/add';
	   	import { IconButton } from '@atlaskit/button/new';

	   	<IconButton icon={AddIcon} />
		 `,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Icon in renamed IconButton',
		code: `
	   	import AddIcon from '@atlaskit/icon/glyph/add';
	   	import { IconButton as IButton } from '@atlaskit/button/new';

	   	const DefaultButton = IButton;
	   	const DefaultIcon = AddIcon;

	   	<DefaultButton icon={DefaultIcon} label="Add"/>
	   	`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Icons rendered in new button',
		code: `
	   	// Basic, auto-migratable new Button
	   	import AddIcon from '@atlaskit/icon/glyph/add';
		import Button from '@atlaskit/button/new';

	   	<Button iconBefore={AddIcon} iconAfter={AddIcon} > Add </Button>
	   	`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
			{
				messageId: 'guidance',
			},
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Basic, auto-migratable Button with render props',
		code: `
	   	// Basic, auto-migratable new Button (with render props)
		import AddIcon from '@atlaskit/icon/glyph/add';
	   	import Button from '@atlaskit/button/new';

	   	<Button iconBefore={(iconProps) => <AddIcon {...iconProps} />} > Add </Button>
		 `,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Basic, auto-migratable IconButton with render props',
		code: `
	   	// Basic, auto-migratable IconButton (render props)
		import AddIcon from '@atlaskit/icon/glyph/add';
	   	import { IconButton } from '@atlaskit/button/new';

	   	<IconButton icon={(iconProps) => <AddIcon {...iconProps} />} label="Add" />
		 `,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Button with UNSAFE_iconBefore_size that can be auto-migrated',
		code: `
	   	// New button requiring manual migration
	   	// We could handle this case in the future
		import AddIcon from '@atlaskit/icon/glyph/add';
	   	import Button from '@atlaskit/button/new';

	   	<Button
		   	UNSAFE_iconBefore_size={"small"}
		  	iconBefore={AddIcon}
	   	> Add </Button>
		 `,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Button with UNSAFE_iconBefore_size that requires manual migration',
		code: `
	   	// New button requiring manual migration
	   	// We could handle this case in the future
		import AddIcon from '@atlaskit/icon/glyph/add';
	   	import Button from '@atlaskit/button/new';

	   	<Button
		   	UNSAFE_iconBefore_size={"large"}
		  	iconBefore={AddIcon}
	   	> Add </Button>
		 `,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateUnsafeProp',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Button with UNSAFE_iconAfter_size that requires manual migration',
		code: `
	   	// New button requiring manual migration
	   	// We could handle this case in the future
		import AddIcon from '@atlaskit/icon/glyph/add';
	   	import Button from '@atlaskit/button/new';

	   	<Button
		   	UNSAFE_iconAfter_size={"large"}
		  	iconAfter={AddIcon}
	   	> Add </Button>
		 `,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateUnsafeProp',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Button with UNSAFE_iconAfter_size and UNSAFE_iconBefore_size that requires manual migration',
		code: `
	   	// New button requiring manual migration
	   	// We could handle this case in the future
		import AddIcon from '@atlaskit/icon/glyph/add';
	   	import Button from '@atlaskit/button/new';

	   	<Button
		   	UNSAFE_iconBefore_size={"small"}
		  	iconBefore={AddIcon}
			UNSAFE_iconAfter_size={"large"}
		  	iconAfter={AddIcon}
	   	> Add </Button>
		 `,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
			{
				messageId: 'guidance',
			},
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateUnsafeProp',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'IconButton with UNSAFE_size that requires manual migration',
		code: `
	   	// New button requiring manual migration
	   	// We could handle this case in the future
		import AddIcon from '@atlaskit/icon/glyph/add';
	   	import {IconButton} from '@atlaskit/button/new';

	   	<IconButton
		   	UNSAFE_size={"large"}
		  	icon={AddIcon}
	   	> Add </IconButton>
		 `,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateUnsafeProp',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Button with small UNSAFE_iconBefore_size and iconBefore using spread props',
		code: `
	   	// New button requiring manual migration
	   	// We could handle this case in the future
		import AddIcon from '@atlaskit/icon/glyph/add';
	   	import Button from '@atlaskit/button/new';

	   	<Button
		   	UNSAFE_iconBefore_size={"small"}
		   	iconBefore={(iconProps) => <AddIcon {...iconProps} />}
	   	> Add </Button>
		`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Button with large UNSAFE_iconBefore_size and iconBefore using spread props',
		code: `
	   	// New button requiring manual migration
	   	// We could handle this case in the future
		import AddIcon1 from '@atlaskit/icon/glyph/add';
	   	import Button from '@atlaskit/button/new';

	   	<Button
		   	UNSAFE_iconBefore_size={"xlarge"}
		   	iconBefore={(iconProps) => <AddIcon1 {...iconProps} />}
	   	> Add </Button>
		`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateUnsafeProp',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Button with large UNSAFE_iconBefore_size and iconBefore using spread props and then overwriting size',
		code: `
	   	// New button requiring manual migration
	   	// We could handle this case in the future
		import AddIcon from '@atlaskit/icon/glyph/add';
	   	import Button from '@atlaskit/button/new';

	   	<Button
		   	UNSAFE_iconBefore_size={"xlarge"}
		   	iconBefore={(iconProps) => <AddIcon {...iconProps} size="small"/>}
	   	> Add </Button>
		`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateUnsafeProp',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Basic, auto-migratable IconButton',
		code: `
	   	// Basic, auto-migratable IconButton
		import AddIcon from '@atlaskit/icon/glyph/add';
	   	import { IconButton } from '@atlaskit/button/new';

	   	<IconButton icon={AddIcon} label="Add" />
		 `,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
			{
				messageId: 'guidance',
			},
		],
	},
];

/**
 * ------------------- Old Button tests -------------------
 */
export const oldButtonTests = [
	{
		name: 'Icon rendered in old button',
		code: `
		import AddIcon from '@atlaskit/icon/glyph/add';
		import Button from '@atlaskit/button';

		<Button iconBefore={<AddIcon label="" />} > Add </Button>
		`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
			{
				messageId: 'guidance',
			},
		],
	},
];

/**
 * ------------------- Spread Props tests -------------------
 */
export const spreadPropsTests = [
	{
		name: 'Spread props onto icon, manual migration required',
		code: `
		import AddIcon from '@atlaskit/icon/glyph/add';

		(iconProps) => <AddIcon {...iconProps} label="" />
		`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateSpreadProps',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Spread Props on Icon but all required props are re-assigned',
		code: `
		// Spread props, but migratable
		import { IconTile } from '@atlaskit/icon';
		import { token } from '@atlaskit/tokens';
		import AddIcon from '@atlaskit/icon/glyph/add';

		<Component
			icon={ (iconProps) =>
				<AddIcon
					label=""
					{...iconProps}
					primaryColor={token('color.link')}
					secondaryColor={token('color.icon.inverse')}
					size="medium"
				>
					Add
				</AddIcon>
			}
		/>
		`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Spread props twice',
		code: `
		// Spread props, not migratable Tile usage
		import { IconTile } from '@atlaskit/icon';
		import AddIcon from '@atlaskit/icon/glyph/add';
		import { token } from '@atlaskit/tokens';

		const iconPropsTwo = {};

		<Component
			icon={ (iconProps) =>
				<AddIcon
					label=""
					{...iconProps}
					primaryColor={token('color.icon')}
					secondaryColor={token('color.icon.inverse')}
					{...iconPropsTwo}
					size="medium"
				>
					Add
				</AddIcon>
			}
		/>
		`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateSpreadProps',
			},
			{
				messageId: 'guidance',
			},
		],
	},
];

/**
 * ------------------- Size tests -------------------
 */
export const sizeTests = [
	{
		name: 'Size on icon is not deterministic - function call',
		code: `
	 	import AddIcon from '@atlaskit/icon/glyph/add';

		// Size is not deterministic
		(iconProps) => <AddIcon size={getSize()} label="" />
	 	`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateSizeUnknown',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Size on icon is not deterministic - variable',
		code: `
	 	import AddIcon from '@atlaskit/icon/glyph/add';

   		const size = "medium";

		// Size is not deterministic
		(iconProps) => <AddIcon size={size} label="" />
	 	`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateSizeUnknown',
			},
			{
				messageId: 'guidance',
			},
		],
	},
];

/**
 * ------------------- Color tests -------------------
 */
export const colorTests = [
	{
		name: 'Color on icon is unsupported',
		code: `
	  import AddIcon from '@atlaskit/icon/glyph/add';

		// Color is using unsupported string color - can't set 'color' via codemod
		(iconProps) => <AddIcon primaryColor='red' label="" />
	  	`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateColor',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Color on icon is unsupported variable',
		code: `
	  import AddIcon from '@atlaskit/icon/glyph/add';

		const color = "currentColor";
		// Color is using unsupported variable color - can't set 'color' via codemod
		(iconProps) => <AddIcon primaryColor={color} label="" />
	  	`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateColor',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Color on icon is unsupported function',
		code: `
	  import AddIcon from '@atlaskit/icon/glyph/add';

		function currentColor() {return "currentColor"};

		// Color is using unsupported variable color - can't set 'color' via codemod
		(iconProps) => <AddIcon primaryColor={getColor()} label="" />
	  	`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateColor',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Color on icon is unsupported - in JSX template',
		code: `
	  import AddIcon from '@atlaskit/icon/glyph/add';

		// Color is using unsupported string color in JSX template - can't set 'color' via codemod
		(iconProps) => <AddIcon primaryColor={'pink'} label="" />
	  	`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateColor',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Color on icon is unsupported - incorrect token',
		code: `
	  import AddIcon from '@atlaskit/icon/glyph/add';
		import { token } from '@atlaskit/tokens';

		// Color is using unsupported token - can't set 'color' via codemod
		(iconProps) => <AddIcon primaryColor={token('color.text.brand')} label="" />
	  	`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateColor',
			},
			{
				messageId: 'guidance',
			},
		],
	},
	{
		name: 'Color on icon is unsupported - incorrect token and token function renamed',
		code: `
		import AddIcon from '@atlaskit/icon/glyph/add';
		import { token as customToken } from '@atlaskit/tokens';

		// Color is using unsupported token - can't set 'color' via token
		(iconProps) => <AddIcon primaryColor={customToken('color.text.brand')} label="" />
	  	`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateColor',
			},
			{
				messageId: 'guidance',
			},
		],
	},
];
