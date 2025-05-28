import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-utility-icons', rule, {
	valid: [
		{
			name: 'Core icons',
			code: `import AddIcon from '@atlaskit/icon/core/add';
				<AddIcon label=""/>`,
		},
		{
			name: 'Migration to core icons',
			code: `import LockFilledIcon from '@atlaskit/icon/core/migration/lock-locked--lock-filled';
				<LockFilledIcon label=""/>`,
		},
	],
	invalid: [
		{
			name: 'utility import',
			options: [{ enableAutoFixer: true }],
			code: `import AddIcon from '@atlaskit/icon/utility/add';
				<AddIcon label=""/>`,
			output: `import AddIcon from '@atlaskit/icon/core/add';

				<AddIcon label="" size="small"/>`,
			errors: [
				{
					messageId: 'noUtilityIconsJSXElement',
				},
			],
		},
		{
			name: 'utility import in migration entry point',
			options: [{ enableAutoFixer: true }],
			code: `import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';
				<ChevronDownIcon label="expand" LEGACY_size="medium" spacing="spacious" />`,
			output: `import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down';

				<ChevronDownIcon label="expand" LEGACY_size="medium" spacing="spacious" size="small"/>`,
			errors: [
				{
					messageId: 'noUtilityIconsJSXElement',
				},
			],
		},
		{
			name: 'utility import spread props',
			options: [{ enableAutoFixer: true }],
			code: `import AddIcon from '@atlaskit/icon/utility/add';
				const props = {label: ''};
				<AddIcon {...props} />`,
			output: `import AddIcon from '@atlaskit/icon/core/add';

				const props = {label: ''};
				<AddIcon {...props} size="small"/>`,
			errors: [
				{
					messageId: 'noUtilityIconsJSXElement',
				},
			],
		},
		{
			name: 'new core import exists',
			options: [{ enableAutoFixer: true }],
			code: `import AddIcon from '@atlaskit/icon/utility/add';
				import AddIconLarge from '@atlaskit/icon/core/add';
				<>
					<AddIcon label=""/>
					<AddIconLarge label=""/>
				</>`,
			output: `
				import AddIconLarge from '@atlaskit/icon/core/add';
				<>
					<AddIconLarge label="" size="small"/>
					<AddIconLarge label=""/>
				</>`,
			errors: [
				{
					messageId: 'noUtilityIconsJSXElement',
				},
			],
		},
		{
			name: 'utility icons exported',
			options: [{ enableAutoFixer: true }],
			code: `import AddIcon from '@atlaskit/icon/utility/add';
				export const iconMap = {
					add: AddIcon,
				};
				export const iconArray = [AddIcon];
				export { AddIcon as AddIconExported };`,
			errors: Array(3).fill({
				messageId: 'noUtilityIconsReference',
			}),
		},
		{
			name: 'partial fix',
			options: [{ enableAutoFixer: true }],
			code: `
				import AddIcon from '@atlaskit/icon/utility/add';
				<AddIcon label=""/>
				export { AddIcon as AddIconExported };`,
			output: `import AddIconCore from '@atlaskit/icon/core/add';

				import AddIcon from '@atlaskit/icon/utility/add';
				<AddIconCore label="" size="small"/>
				export { AddIcon as AddIconExported };`,
			errors: [
				{
					messageId: 'noUtilityIconsJSXElement',
				},
				{
					messageId: 'noUtilityIconsReference',
				},
			],
		},
		{
			name: 'Icon in new Button',
			options: [{ enableAutoFixer: true }],
			code: `import AddIcon from '@atlaskit/icon/utility/add';
				import Button, { IconButton as IButton } from '@atlaskit/button/new';
				<>
					<IButton icon={AddIcon} label="" />
					<Button iconBefore={AddIcon} iconAfter={AddIcon} label="" />
				</>`,
			output: `import AddIcon from '@atlaskit/icon/core/add';

				import Button, { IconButton as IButton } from '@atlaskit/button/new';
				<>
					<IButton icon={(iconProps) => <AddIcon {...iconProps} size="small" />} label="" />
					<Button iconBefore={(iconProps) => <AddIcon {...iconProps} size="small" />} iconAfter={(iconProps) => <AddIcon {...iconProps} size="small" />} label="" />
				</>`,
			errors: [
				{
					messageId: 'noUtilityIconsReference',
				},
				{
					messageId: 'noUtilityIconsReference',
				},
				{
					messageId: 'noUtilityIconsReference',
				},
			],
		},
		{
			name: 'Icon rendered in old buttons',
			options: [{ enableAutoFixer: true }],
			code: `import AddIcon from '@atlaskit/icon/utility/add';
			import Button from '@atlaskit/button';
			import StandardButton from '@atlaskit/button/standard-button';
			import LoadingButton from '@atlaskit/button/loading-button';
			<div>
				<Button iconBefore={<AddIcon label="" />} > Add </Button>
				<StandardButton iconBefore={<AddIcon label="" />} > Add </StandardButton>
				<LoadingButton iconAfter={<AddIcon label="" />} > Add </LoadingButton>
			</div>`,
			output: `import AddIcon from '@atlaskit/icon/core/add';

			import Button from '@atlaskit/button';
			import StandardButton from '@atlaskit/button/standard-button';
			import LoadingButton from '@atlaskit/button/loading-button';
			<div>
				<Button iconBefore={<AddIcon label="" size="small"/>} > Add </Button>
				<StandardButton iconBefore={<AddIcon label="" size="small"/>} > Add </StandardButton>
				<LoadingButton iconAfter={<AddIcon label="" size="small"/>} > Add </LoadingButton>
			</div>`,
			errors: Array(3).fill({
				messageId: 'noUtilityIconsJSXElement',
			}),
		},
		{
			name: 'Icon rendered in old buttons - DO NOT FIX IF enableAutoFixer is false',
			options: [{ enableAutoFixer: false }],
			code: `import AddIcon from '@atlaskit/icon/utility/add';
			import Button from '@atlaskit/button';
			import StandardButton from '@atlaskit/button/standard-button';
			import LoadingButton from '@atlaskit/button/loading-button';
			<div>
				<Button iconBefore={<AddIcon label="" />} > Add </Button>
				<StandardButton iconBefore={<AddIcon label="" />} > Add </StandardButton>
				<LoadingButton iconAfter={<AddIcon label="" />} > Add </LoadingButton>
			</div>`,
			errors: Array(3).fill({
				messageId: 'noUtilityIconsJSXElement',
			}),
		},
		{
			name: 'Icon rendered in old buttons - DO NOT FIX IF enableAutoFixer is not passed in',
			code: `import AddIcon from '@atlaskit/icon/utility/add';
			import Button from '@atlaskit/button';
			import StandardButton from '@atlaskit/button/standard-button';
			import LoadingButton from '@atlaskit/button/loading-button';
			<div>
				<Button iconBefore={<AddIcon label="" />} > Add </Button>
				<StandardButton iconBefore={<AddIcon label="" />} > Add </StandardButton>
				<LoadingButton iconAfter={<AddIcon label="" />} > Add </LoadingButton>
			</div>`,
			errors: Array(3).fill({
				messageId: 'noUtilityIconsJSXElement',
			}),
		},
	],
});
