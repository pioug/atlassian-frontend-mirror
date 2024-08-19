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
				messageId: 'cantMigrateIdentifier',
			},
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
				messageId: 'cantMigrateReExport',
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
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateReExport',
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
				messageId: 'cantMigrateIdentifier',
			},
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
				messageId: 'cantMigrateReExport',
			},
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateReExport',
			},
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateReExport',
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
				messageId: 'cantMigrateIdentifierMapOrArray',
			},
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateIdentifierMapOrArray',
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
				messageId: 'cantMigrateIdentifierMapOrArray',
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
				messageId: 'cantMigrateIdentifierMapOrArray',
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
		output: `
		import AddIcon from '@atlaskit/icon/core/migration/add';
		import CustomComponent from '@atlaskit/custom';

		<CustomComponent myIcon={<AddIcon color="currentColor" spacing="spacious"/>}/>
		`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
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
		output: `
	   	import AddIcon from '@atlaskit/icon/core/migration/add';
	   	import { IconButton } from '@atlaskit/button/new';

	   	<IconButton icon={AddIcon} />
		 `,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
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
		name: 'Icons rendered in new button',
		code: `
	   	// Basic, auto-migratable new Button
	   	import AddIcon from '@atlaskit/icon/glyph/add';
		import ChevronDown from '@atlaskit/icon/glyph/chevron-down';
		import Button from '@atlaskit/button/new';

	   	<Button iconBefore={AddIcon} iconAfter={ChevronDown}>Add</Button>
	   	`,
		output: `
	   	// Basic, auto-migratable new Button
	   	import AddIcon from '@atlaskit/icon/core/migration/add';
		import ChevronDown from '@atlaskit/icon/utility/migration/chevron-down';
		import Button from '@atlaskit/button/new';

	   	<Button iconBefore={AddIcon} iconAfter={ChevronDown}>Add</Button>
	   	`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
		],
	},
	{
		name: 'Icons rendered in new button with medium size',
		code: `
	   	import AddIcon from '@atlaskit/icon/glyph/add';
		import Button from '@atlaskit/button/new';

	   	<Button iconBefore={(iconProps) => <AddIcon {...iconProps} size="medium" />}>Add</Button>
	   	`,
		output: `
	   	import AddIcon from '@atlaskit/icon/core/migration/add';
		import Button from '@atlaskit/button/new';

	   	<Button iconBefore={(iconProps) => <AddIcon {...iconProps} LEGACY_size="medium" />}>Add</Button>
	   	`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
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
		output: `
	   	// Basic, auto-migratable new Button (with render props)
		import AddIcon from '@atlaskit/icon/core/migration/add';
	   	import Button from '@atlaskit/button/new';

	   	<Button iconBefore={(iconProps) => <AddIcon {...iconProps} />} > Add </Button>
		 `,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
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
		output: `
	   	// Basic, auto-migratable IconButton (render props)
		import AddIcon from '@atlaskit/icon/core/migration/add';
	   	import { IconButton } from '@atlaskit/button/new';

	   	<IconButton icon={(iconProps) => <AddIcon {...iconProps} />} label="Add" />
		 `,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
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
		output: `
	   	// Basic, auto-migratable IconButton
		import AddIcon from '@atlaskit/icon/core/migration/add';
	   	import { IconButton } from '@atlaskit/button/new';

	   	<IconButton icon={AddIcon} label="Add" />
		 `,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
		],
	},
];

/**
 * ------------------- Old Button tests -------------------
 */
export const oldButtonTests = [
	{
		name: 'Icon rendered in legacy buttons',
		code: `
		import AddIcon from '@atlaskit/icon/glyph/add';
		import Button from '@atlaskit/button';
		import StandardButton from '@atlaskit/button/standard-button';
		import LoadingButton from '@atlaskit/button/loading-button';
		import CustomThemeButton from '@atlaskit/button/custom-theme-button';

		<div>
			<Button iconBefore={<AddIcon label="" />} > Add </Button>
			<StandardButton iconBefore={<AddIcon label="" />} > Add </StandardButton>
			<LoadingButton iconBefore={<AddIcon label="" />} > Add </LoadingButton>
			<CustomThemeButton iconBefore={<AddIcon label="" />} > Add </CustomThemeButton>
		</div>
		`,
		output: `
		import AddIcon from '@atlaskit/icon/core/migration/add';
		import Button from '@atlaskit/button';
		import StandardButton from '@atlaskit/button/standard-button';
		import LoadingButton from '@atlaskit/button/loading-button';
		import CustomThemeButton from '@atlaskit/button/custom-theme-button';

		<div>
			<Button iconBefore={<AddIcon color="currentColor" label="" />} > Add </Button>
			<StandardButton iconBefore={<AddIcon color="currentColor" label="" />} > Add </StandardButton>
			<LoadingButton iconBefore={<AddIcon color="currentColor" label="" />} > Add </LoadingButton>
			<CustomThemeButton iconBefore={<AddIcon color="currentColor" label="" />} > Add </CustomThemeButton>
		</div>
		`,
		errors: Array(8).fill({
			messageId: 'noLegacyIconsAutoMigration',
		}),
	},
	{
		name: 'Icon rendered in old button with medium size',
		code: `
		import AddIcon from '@atlaskit/icon/glyph/add';
		import Button from '@atlaskit/button';

		<Button iconBefore={<AddIcon label="" size="medium" />}>Add</Button>
		`,
		output: `
		import AddIcon from '@atlaskit/icon/core/migration/add';
		import Button from '@atlaskit/button';

		<Button iconBefore={<AddIcon color="currentColor" label="" LEGACY_size="medium" />}>Add</Button>
		`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
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
		],
	},
	{
		name: 'Spread Props on Icon but all required props are re-assigned',
		code: `
		// Spread props, but migratable
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
		output: `
		// Spread props, but migratable
		import { token } from '@atlaskit/tokens';
		import AddIcon from '@atlaskit/icon/core/migration/add';

		<Component
			icon={ (iconProps) =>
				<AddIcon
					label=""
					{...iconProps}
					color={token('color.link')}
					LEGACY_secondaryColor={token('color.icon.inverse')}
					LEGACY_size="medium" spacing="spacious"
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
		],
	},
];

/**
 * ------------------- Color tests -------------------
 */
export const colorTests = [
	{
		name: 'Color on icon is supported',
		code: `
	    import AddIcon from '@atlaskit/icon/glyph/add';
		import { token } from '@atlaskit/tokens';

		// Color is using supported string color - can migrate to 'color' via codemod
		() =>
			<div>
				<AddIcon primaryColor={token('color.text.danger')} label="" />
				<AddIcon primaryColor={token('color.text')} label="" />
				<AddIcon primaryColor={token('color.link')} label="" />
			</div>
	  	`,
		output: `
	    import AddIcon from '@atlaskit/icon/core/migration/add';
		import { token } from '@atlaskit/tokens';

		// Color is using supported string color - can migrate to 'color' via codemod
		() =>
			<div>
				<AddIcon spacing="spacious" color={token('color.text.danger')} label="" />
				<AddIcon spacing="spacious" color={token('color.text')} label="" />
				<AddIcon spacing="spacious" color={token('color.link')} label="" />
			</div>
	  	`,
		errors: Array(6).fill({
			messageId: 'noLegacyIconsAutoMigration',
		}),
	},
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
		],
	},
	{
		name: 'Color on icon is unsupported - incorrect token',
		code: `
	  import AddIcon from '@atlaskit/icon/glyph/add';
		import { token } from '@atlaskit/tokens';

		// Color is using unsupported token - can't set 'color' via codemod
		(iconProps) => <AddIcon primaryColor={token('color.background.danger')} label="" />
	  	`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateColor',
			},
		],
	},
	{
		name: 'Color on icon is unsupported - incorrect token and token function renamed',
		code: `
		import AddIcon from '@atlaskit/icon/glyph/add';
		import { token as customToken } from '@atlaskit/tokens';

		// Color is using unsupported token - can't set 'color' via token
		(iconProps) => <AddIcon primaryColor={customToken('color.background.danger')} label="" />
	  	`,
		errors: [
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateColor',
			},
		],
	},
];
