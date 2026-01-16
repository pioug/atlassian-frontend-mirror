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

        <CustomComponent myIcon={<AddIcon spacing="spacious"/>}/>
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

           <IconButton icon={AddIcon} label="" />
         `,
		output: `
           import AddIcon from '@atlaskit/icon/core/migration/add';
           import { IconButton } from '@atlaskit/button/new';

           <IconButton icon={AddIcon} label="" />
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
<DefaultButton icon={DefaultIcon} label="Add"/>`,
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
				suggestions: [
					{
						desc: 'Rename icon import, import from the new package, and update props.',
						output: `
import AddIconNew from '@atlaskit/icon/core/migration/add';
import AddIcon from '@atlaskit/icon/glyph/add';
import { IconButton as IButton } from '@atlaskit/button/new';
const DefaultButton = IButton;
const DefaultIcon = AddIcon;
<DefaultButton icon={AddIconNew} label=\"Add\"/>`,
					},
				],
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
        import ChevronDown from '@atlaskit/icon/core/migration/chevron-down';
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
export const oldButtonTests: (
	| {
			name: string;
			code: string;
			output: string;
			errors: any[];
	  }
	| {
			name: string;
			code: string;
			errors: {
				messageId: string;
				suggestions: {
					desc: string;
					output: string;
				}[];
			}[];
			output?: undefined;
	  }
)[] = [
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
	        <LoadingButton iconAfter={<AddIcon label="" />} > Add </LoadingButton>
	        <CustomThemeButton iconAfter={<AddIcon label="" />} > Add </CustomThemeButton>
	    </div>
	    `,
		output: `
	    import AddIcon from '@atlaskit/icon/core/migration/add';
	    import Button from '@atlaskit/button';
	    import StandardButton from '@atlaskit/button/standard-button';
	    import LoadingButton from '@atlaskit/button/loading-button';
	    import CustomThemeButton from '@atlaskit/button/custom-theme-button';

	    <div>
	        <Button iconBefore={<AddIcon label="" />} > Add </Button>
	        <StandardButton iconBefore={<AddIcon label="" />} > Add </StandardButton>
	        <LoadingButton iconAfter={<AddIcon label="" />} > Add </LoadingButton>
	        <CustomThemeButton iconAfter={<AddIcon label="" />} > Add </CustomThemeButton>
	    </div>
	    `,
		errors: Array(4).fill({
			messageId: 'noLegacyIconsAutoMigration',
		}),
	},
	{
		name: 'Icon rendered in legacy icon-only buttons',
		code: `
	    import AddIcon from '@atlaskit/icon/glyph/add';
	    import Button from '@atlaskit/button';

	    <div>
	        <Button iconBefore={<AddIcon label="" />} />
	        <Button iconAfter={<AddIcon size="medium" label="" />} />
	        <Button>
	            <AddIcon label="" />
	        </Button>
	        <Button iconBefore={<AddIcon label="" />} iconAfter={<AddIcon label="" />} />
	        <Button iconBefore={<AddIcon label="" />} > Add </Button>
	    </div>
	    `,
		output: `
	    import AddIcon from '@atlaskit/icon/core/migration/add';
	    import Button from '@atlaskit/button';

	    <div>
	        <Button iconBefore={<AddIcon spacing="spacious" label="" />} />
	        <Button iconAfter={<AddIcon LEGACY_size="medium" spacing="spacious" label="" />} />
	        <Button>
	            <AddIcon spacing="spacious" label="" />
	        </Button>
	        <Button iconBefore={<AddIcon label="" />} iconAfter={<AddIcon label="" />} />
	        <Button iconBefore={<AddIcon label="" />} > Add </Button>
	    </div>
	    `,
		errors: Array(6).fill({
			messageId: 'noLegacyIconsAutoMigration',
		}),
	},
	{
		name: 'Chevron rendered in legacy icon-only buttons',
		code: `
	    import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
	    import Button from '@atlaskit/button';

	    <div>
	        <Button iconAfter={<ChevronDownIcon size="medium" label="" />} />
	    </div>
	    `,
		output: `
	    import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down';
	    import Button from '@atlaskit/button';

	    <div>
	        <Button iconAfter={<ChevronDownIcon LEGACY_size="medium" size="small" spacing="spacious" label="" />} />
	    </div>
	    `,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
		],
	},
	{
		name: 'Chevron small size rendered in legacy icon-only buttons, suggestions only - no fix',
		code: `
	    import AddIcon from '@atlaskit/icon/glyph/add';
	    import Button from '@atlaskit/button';

	    <div>
	        <Button iconBefore={<AddIcon size="small" label="" />} />
	    </div>
	    `,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
				suggestions: [
					{
						desc: 'Replace with medium core icon and no spacing (Recommended)',
						output: `
	    import AddIcon from '@atlaskit/icon/core/migration/add';
	    import Button from '@atlaskit/button';

	    <div>
	        <Button iconBefore={<AddIcon LEGACY_size="small" label="" />} />
	    </div>
	    `,
					},
					{
						desc: 'Replace with small core icon and compact spacing',
						output: `
	    import AddIcon from '@atlaskit/icon/core/migration/add';
	    import Button from '@atlaskit/button';

	    <div>
	        <Button iconBefore={<AddIcon LEGACY_size="small" size="small" spacing="compact" label="" />} />
	    </div>
	    `,
					},
				],
			},
		],
	},
	{
		name: 'Icon multiple sizes rendered in legacy icon-only buttons',
		code: `
import AddIcon from '@atlaskit/icon/glyph/add';
import Button from '@atlaskit/button';

<div>
		<Button iconBefore={<AddIcon size="small" label="" />} />
		<Button iconAfter={<AddIcon size="medium" label="" />} />
</div>
`,
		output: `
import AddIconNew from '@atlaskit/icon/core/migration/add';
import AddIcon from '@atlaskit/icon/glyph/add';
import Button from '@atlaskit/button';

<div>
		<Button iconBefore={<AddIcon size="small" label="" />} />
		<Button iconAfter={<AddIconNew LEGACY_size="medium" spacing="spacious" label="" />} />
</div>
`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
				suggestions: [
					{
						desc: 'Replace with medium core icon and no spacing (Recommended)',
						output: `
import AddIconNew from '@atlaskit/icon/core/migration/add';
import AddIcon from '@atlaskit/icon/glyph/add';
import Button from '@atlaskit/button';

<div>
		<Button iconBefore={<AddIconNew LEGACY_size="small" label="" />} />
		<Button iconAfter={<AddIcon size="medium" label="" />} />
</div>
`,
					},
					{
						desc: 'Replace with small core icon and compact spacing',
						output: `
import AddIconNew from '@atlaskit/icon/core/migration/add';
import AddIcon from '@atlaskit/icon/glyph/add';
import Button from '@atlaskit/button';

<div>
		<Button iconBefore={<AddIconNew LEGACY_size="small" size="small" spacing="compact" label="" />} />
		<Button iconAfter={<AddIcon size="medium" label="" />} />
</div>
`,
					},
				],
			},
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
		],
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

	    <Button iconBefore={<AddIcon label="" LEGACY_size="medium" />}>Add</Button>
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
export const sizeTests: (
	| {
			name: string;
			code: string;
			errors: {
				messageId: string;
			}[];
			output?: undefined;
	  }
	| {
			name: string;
			code: string;
			output: string;
			errors: any[];
	  }
	| {
			name: string;
			code: string;
			errors: {
				messageId: string;
				suggestions: {
					desc: string;
					output: string;
				}[];
			}[];
			output?: undefined;
	  }
)[] = [
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
	{
		name: 'Different auto migratable sizes for core icon',
		code: `
        import AddIcon from '@atlaskit/icon/glyph/add';
        () =>
            <div>
                <AddIcon label="" />
                <AddIcon size="medium" label="" />
            </div>
          `,
		output: `
        import AddIcon from '@atlaskit/icon/core/migration/add';
        () =>
            <div>
                <AddIcon spacing="spacious" label="" />
                <AddIcon LEGACY_size="medium" spacing="spacious" label="" />
            </div>
          `,
		errors: Array(2).fill({
			messageId: 'noLegacyIconsAutoMigration',
		}),
	},
	{
		name: 'Provides suggestions for small size icons',
		code: `
import AddIcon from '@atlaskit/icon/glyph/add';
() =>
		<div>
				<AddIcon size="small" label="" />
		</div>
`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
				suggestions: [
					{
						desc: 'Replace with medium core icon and no spacing (Recommended)',
						output: `
import AddIcon from '@atlaskit/icon/core/migration/add';
() =>
		<div>
				<AddIcon LEGACY_size="small" label="" />
		</div>
`,
					},
					{
						desc: 'Replace with small core icon and compact spacing',
						output: `
import AddIcon from '@atlaskit/icon/core/migration/add';
() =>
		<div>
				<AddIcon LEGACY_size="small" size="small" spacing="compact" label="" />
		</div>
`,
					},
				],
			},
		],
	},
	{
		name: 'Fixes medium chevrons to small',
		code: `
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
() =>
		<div>
				<ChevronDownIcon label="" />
		</div>
`,
		output: `
import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down';
() =>
		<div>
				<ChevronDownIcon size="small" spacing="spacious" label="" />
		</div>
`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
		],
	},
	{
		name: 'Keeps small chevrons small, provides no suggestions for medium',
		code: `
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
() =>
		<div>
				<ChevronDownIcon size="small" label="" />
		</div>
`,
		output: `
import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down';
() =>
		<div>
				<ChevronDownIcon LEGACY_size="small" size="small" label="" />
		</div>
`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
		],
	},
	{
		name: 'Fixes medium chevron circles to small chevrons',
		code: `
import ChevronLeftCircleIcon from '@atlaskit/icon/glyph/chevron-left-circle';
() =>
		<div>
				<ChevronLeftCircleIcon label="" />
		</div>
`,
		output: `
import ChevronLeftCircleIcon from '@atlaskit/icon/core/migration/chevron-left--chevron-left-circle';
() =>
		<div>
				<ChevronLeftCircleIcon size="small" spacing="spacious" label="" />
		</div>
`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
		],
	},
	{
		name: 'Different icon sizes for icon. Fixes medium icons, provides suggestions for small icons',
		code: `
import AddIcon from '@atlaskit/icon/glyph/add';
() =>
		<div>
				<AddIcon size="small" label="" />
				<AddIcon label="" />
		</div>
`,
		output: `
import AddIconNew from '@atlaskit/icon/core/migration/add';
import AddIcon from '@atlaskit/icon/glyph/add';
() =>
		<div>
				<AddIcon size="small" label="" />
				<AddIconNew spacing="spacious" label="" />
		</div>
`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
				suggestions: [
					{
						desc: 'Replace with medium core icon and no spacing (Recommended)',
						output: `
import AddIconNew from '@atlaskit/icon/core/migration/add';
import AddIcon from '@atlaskit/icon/glyph/add';
() =>
		<div>
				<AddIconNew LEGACY_size="small" label="" />
				<AddIcon label="" />
		</div>
`,
					},
					{
						desc: 'Replace with small core icon and compact spacing',
						output: `
import AddIconNew from '@atlaskit/icon/core/migration/add';
import AddIcon from '@atlaskit/icon/glyph/add';
() =>
		<div>
				<AddIconNew LEGACY_size="small" size="small" spacing="compact" label="" />
				<AddIcon label="" />
		</div>
`,
					},
				],
			},
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
		],
	},
	{
		name: 'Different auto migratable sizes for chevrons',
		code: `
        import ChevronDown from '@atlaskit/icon/glyph/chevron-down';
        () =>
            <div>
                <ChevronDown label="" />
                <ChevronDown size="medium" label="" />
            </div>
          `,
		output: `
        import ChevronDown from '@atlaskit/icon/core/migration/chevron-down';
        () =>
            <div>
                <ChevronDown size="small" spacing="spacious" label="" />
                <ChevronDown LEGACY_size="medium" size="small" spacing="spacious" label="" />
            </div>
          `,
		errors: Array(2).fill({
			messageId: 'noLegacyIconsAutoMigration',
		}),
	},
];

/**
 * ------------------- Color tests -------------------
 */
export const colorTests: (
	| {
			name: string;
			code: string;
			output: string;
			errors: any[];
	  }
	| {
			name: string;
			code: string;
			errors: {
				messageId: string;
			}[];
			output?: undefined;
	  }
)[] = [
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
		errors: Array(3).fill({
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

/**
 * ----- Combination of Auto and Manual tests -----------
 */
export const combinationOfAutoAndManualTests = [
	{
		name: 'Same icon used in two places - one auto, one manual - only suggestions presented - no fix',
		code: `
import AddIconCombination from '@atlaskit/icon/glyph/add';
import {token} from '@atlaskit/tokens';
const iconProps = {};
<div>
   <AddIconCombination
        label=""
        {...iconProps}
        primaryColor={token('color.link')}
        secondaryColor={token('color.icon.inverse')}
        size="medium"
   />
   <AddIconCombination
        label=""
        {...iconProps}git
        primaryColor={token('color.link')}
        secondaryColor={token('color.icon.inverse')}
        size="medium"
        {...iconProps}
   />
</div>`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
				suggestions: [
					{
						desc: 'Rename icon import, import from the new package, and update props.',
						output: `
import AddIcon from '@atlaskit/icon/core/migration/add';
import AddIconCombination from '@atlaskit/icon/glyph/add';
import {token} from '@atlaskit/tokens';
const iconProps = {};
<div>
   <AddIcon
        label=""
        {...iconProps}
        color={token('color.link')}
        LEGACY_secondaryColor={token('color.icon.inverse')}
        LEGACY_size="medium" spacing="spacious"
   />
   <AddIconCombination
        label=""
        {...iconProps}git
        primaryColor={token('color.link')}
        secondaryColor={token('color.icon.inverse')}
        size="medium"
        {...iconProps}
   />
</div>`,
					},
				],
			},
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateSpreadProps',
			},
		],
	},
	{
		name: 'Different icons used in combination - 2 auto, one manual',
		code: `
import AddIconCombination from '@atlaskit/icon/glyph/add';
import ActivityIcon from '@atlaskit/icon/glyph/activity';
import {token} from '@atlaskit/tokens';
const iconProps = {};
<div>
    <ActivityIcon label="" />
    <AddIconCombination
        label=""
        {...iconProps}
        primaryColor={token('color.link')}
        secondaryColor={token('color.icon.inverse')}
        size="medium"
    />
    <AddIconCombination
        label=""
        {...iconProps}
        primaryColor={token('color.link')}
        secondaryColor={token('color.icon.inverse')}
        size="medium"
        {...iconProps}
    />
</div>`,
		output: `
import AddIconCombination from '@atlaskit/icon/glyph/add';
import ActivityIcon from '@atlaskit/icon/core/migration/dashboard--activity';
import {token} from '@atlaskit/tokens';
const iconProps = {};
<div>
    <ActivityIcon spacing="spacious" label="" />
    <AddIconCombination
        label=""
        {...iconProps}
        primaryColor={token('color.link')}
        secondaryColor={token('color.icon.inverse')}
        size="medium"
    />
    <AddIconCombination
        label=""
        {...iconProps}
        primaryColor={token('color.link')}
        secondaryColor={token('color.icon.inverse')}
        size="medium"
        {...iconProps}
    />
</div>`,
		errors: [
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
			{
				messageId: 'noLegacyIconsAutoMigration',
				suggestions: [
					{
						desc: 'Rename icon import, import from the new package, and update props.',
						output: `
import AddIcon from '@atlaskit/icon/core/migration/add';
import AddIconCombination from '@atlaskit/icon/glyph/add';
import ActivityIcon from '@atlaskit/icon/glyph/activity';
import {token} from '@atlaskit/tokens';
const iconProps = {};
<div>
    <ActivityIcon label="" />
    <AddIcon
        label=""
        {...iconProps}
        color={token('color.link')}
        LEGACY_secondaryColor={token('color.icon.inverse')}
        LEGACY_size="medium" spacing="spacious"
    />
    <AddIconCombination
        label=""
        {...iconProps}
        primaryColor={token('color.link')}
        secondaryColor={token('color.icon.inverse')}
        size="medium"
        {...iconProps}
    />
</div>`,
					},
				],
			},
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantMigrateSpreadProps',
			},
		],
	},
	{
		name: 'Complex multiple icon usage',
		code: `
import Button from '@atlaskit/button';
import CustomThemeButton from '@atlaskit/button/custom-theme-button';
import LoadingButton from '@atlaskit/button/loading-button';
import StandardButton from '@atlaskit/button/standard-button';
import ActivityIcon from '@atlaskit/icon/glyph/activity';
import AddIconNew from '@atlaskit/icon/core/migration/add';
import AddIcon from '@atlaskit/icon/glyph/add';
const DefaultIcon = AddIcon;
const App = () => (
    <div>
        <Button iconBefore={<AddIcon label="" />}> Add </Button>
        <StandardButton iconBefore={<AddIcon label="" />}> Add </StandardButton>
        <LoadingButton iconBefore={<AddIcon label="" />}> Add </LoadingButton>
        <CustomThemeButton iconBefore={<AddIcon label="" size="large" />}> Add </CustomThemeButton>
        <DefaultIcon label="" />
        <ActivityIcon label="" />
    </div>
);`,
		output: `
import Button from '@atlaskit/button';
import CustomThemeButton from '@atlaskit/button/custom-theme-button';
import LoadingButton from '@atlaskit/button/loading-button';
import StandardButton from '@atlaskit/button/standard-button';
import ActivityIcon from '@atlaskit/icon/core/migration/dashboard--activity';
import AddIconNew from '@atlaskit/icon/core/migration/add';
import AddIcon from '@atlaskit/icon/glyph/add';
const DefaultIcon = AddIcon;
const App = () => (
    <div>
        <Button iconBefore={<AddIcon label="" />}> Add </Button>
        <StandardButton iconBefore={<AddIcon label="" />}> Add </StandardButton>
        <LoadingButton iconBefore={<AddIcon label="" />}> Add </LoadingButton>
        <CustomThemeButton iconBefore={<AddIcon label="" size="large" />}> Add </CustomThemeButton>
        <DefaultIcon label="" />
        <ActivityIcon spacing="spacious" label="" />
    </div>
);`,
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
				suggestions: [
					{
						desc: 'Rename icon import, import from the new package, and update props.',
						output: `
import Button from '@atlaskit/button';
import CustomThemeButton from '@atlaskit/button/custom-theme-button';
import LoadingButton from '@atlaskit/button/loading-button';
import StandardButton from '@atlaskit/button/standard-button';
import ActivityIcon from '@atlaskit/icon/glyph/activity';
import AddIconNew from '@atlaskit/icon/core/migration/add';
import AddIcon from '@atlaskit/icon/glyph/add';
const DefaultIcon = AddIcon;
const App = () => (
    <div>
        <Button iconBefore={<AddIconNew label="" />}> Add </Button>
        <StandardButton iconBefore={<AddIcon label="" />}> Add </StandardButton>
        <LoadingButton iconBefore={<AddIcon label="" />}> Add </LoadingButton>
        <CustomThemeButton iconBefore={<AddIcon label="" size="large" />}> Add </CustomThemeButton>
        <DefaultIcon label="" />
        <ActivityIcon label="" />
    </div>
);`,
					},
				],
			},
			{
				messageId: 'noLegacyIconsAutoMigration',
				suggestions: [
					{
						desc: 'Rename icon import, import from the new package, and update props.',
						output: `
import Button from '@atlaskit/button';
import CustomThemeButton from '@atlaskit/button/custom-theme-button';
import LoadingButton from '@atlaskit/button/loading-button';
import StandardButton from '@atlaskit/button/standard-button';
import ActivityIcon from '@atlaskit/icon/glyph/activity';
import AddIconNew from '@atlaskit/icon/core/migration/add';
import AddIcon from '@atlaskit/icon/glyph/add';
const DefaultIcon = AddIcon;
const App = () => (
    <div>
        <Button iconBefore={<AddIcon label="" />}> Add </Button>
        <StandardButton iconBefore={<AddIconNew label="" />}> Add </StandardButton>
        <LoadingButton iconBefore={<AddIcon label="" />}> Add </LoadingButton>
        <CustomThemeButton iconBefore={<AddIcon label="" size="large" />}> Add </CustomThemeButton>
        <DefaultIcon label="" />
        <ActivityIcon label="" />
    </div>
);`,
					},
				],
			},
			{
				messageId: 'noLegacyIconsAutoMigration',
				suggestions: [
					{
						desc: 'Rename icon import, import from the new package, and update props.',
						output: `
import Button from '@atlaskit/button';
import CustomThemeButton from '@atlaskit/button/custom-theme-button';
import LoadingButton from '@atlaskit/button/loading-button';
import StandardButton from '@atlaskit/button/standard-button';
import ActivityIcon from '@atlaskit/icon/glyph/activity';
import AddIconNew from '@atlaskit/icon/core/migration/add';
import AddIcon from '@atlaskit/icon/glyph/add';
const DefaultIcon = AddIcon;
const App = () => (
    <div>
        <Button iconBefore={<AddIcon label="" />}> Add </Button>
        <StandardButton iconBefore={<AddIcon label="" />}> Add </StandardButton>
        <LoadingButton iconBefore={<AddIconNew label="" />}> Add </LoadingButton>
        <CustomThemeButton iconBefore={<AddIcon label="" size="large" />}> Add </CustomThemeButton>
        <DefaultIcon label="" />
        <ActivityIcon label="" />
    </div>
);`,
					},
				],
			},
			{
				messageId: 'noLegacyIconsManualMigration',
			},
			{
				messageId: 'cantFindSuitableReplacement',
			},
			{
				messageId: 'noLegacyIconsAutoMigration',
				suggestions: [
					{
						desc: 'Rename icon import, import from the new package, and update props.',
						output: `
import Button from '@atlaskit/button';
import CustomThemeButton from '@atlaskit/button/custom-theme-button';
import LoadingButton from '@atlaskit/button/loading-button';
import StandardButton from '@atlaskit/button/standard-button';
import ActivityIcon from '@atlaskit/icon/glyph/activity';
import AddIconNew from '@atlaskit/icon/core/migration/add';
import AddIcon from '@atlaskit/icon/glyph/add';
const DefaultIcon = AddIcon;
const App = () => (
    <div>
        <Button iconBefore={<AddIcon label="" />}> Add </Button>
        <StandardButton iconBefore={<AddIcon label="" />}> Add </StandardButton>
        <LoadingButton iconBefore={<AddIcon label="" />}> Add </LoadingButton>
        <CustomThemeButton iconBefore={<AddIcon label="" size="large" />}> Add </CustomThemeButton>
        <AddIconNew spacing="spacious" label="" />
        <ActivityIcon label="" />
    </div>
);`,
					},
				],
			},
			{
				messageId: 'noLegacyIconsAutoMigration',
			},
		],
	},
];

/**
 * ----- Safe mode -----------
 */
export const safeModeTests = [
	{
		name: 'Should not migrate activity icon',
		options: [
			{
				shouldUseSafeMigrationMode: true,
			},
		],
		code: `
            import ActivityIcon from '@atlaskit/icon/glyph/activity';
            const App = () => (
                <ActivityIcon label='' />
            );`,
		errors: [
			{ messageId: 'noLegacyIconsManualMigration' },
			{ messageId: 'cantFindSuitableReplacement' },
		],
	},
	{
		name: 'Should migrate add icon',
		options: [
			{
				shouldUseSafeMigrationMode: true,
			},
		],
		code: `
                import AddIcon from '@atlaskit/icon/glyph/add';
                const App = () => (
                    <AddIcon label='Add to list' />
                );
            `,
		output: `
                import AddIcon from '@atlaskit/icon/core/migration/add';
                const App = () => (
                    <AddIcon spacing="spacious" label='Add to list' />
                );
            `,
		errors: [{ messageId: 'noLegacyIconsAutoMigration' }],
	},
	{
		name: 'Should not migrate with secondary color',
		options: [
			{
				shouldUseSafeMigrationMode: true,
			},
		],
		code: `
            import AddIcon from '@atlaskit/icon/glyph/add';
            const App = () => (
                <AddIcon label='Add to list' secondaryColor='green' />
            );`,
		errors: [
			{ messageId: 'noLegacyIconsManualMigration' },
			{ messageId: 'cantFindSuitableReplacement' },
		],
	},
];
