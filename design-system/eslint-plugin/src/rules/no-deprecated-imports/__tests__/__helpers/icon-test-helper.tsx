/**
 * ------------------- Deprecated Icon tests -------------------
 */
export const invalidDeprecatedIconTests: {
	name: string;
	code: string;
	output?: string;
	errors: { messageId: string }[];
	options: {
		deprecatedConfig?: Record<string, { message: string; unfixable?: boolean }>;
		turnOffAutoFixer?: boolean;
	}[];
}[] = [
	{
		name: 'Deprecated core icon from @atlaskit/icon with replacement',
		code: `import ActivityIcon from '@atlaskit/icon/core/activity';

		<ActivityIcon spacing="spacious" color="currentColor" />
		`,
		output: `import DashboardIcon from '@atlaskit/icon/core/dashboard';

		<DashboardIcon spacing="spacious" color="currentColor" />
		`,
		errors: [{ messageId: 'pathWithCustomMessage' }],
		options: [
			{
				deprecatedConfig: {
					'@atlaskit/icon/core/activity': {
						message:
							'The icon "activity" is deprecated in favour of "dashboard" from "@atlaskit/icon/core"',
					},
				},
			},
		],
	},
	{
		name: 'Deprecated core icon from @atlaskit/icon without replacement',
		code: `import AddOnIcon from '@atlaskit/icon/core/addon';

		<AddOnIcon spacing="spacious" color="currentColor" />
		`,
		errors: [{ messageId: 'pathWithCustomMessage' }],
		options: [
			{
				deprecatedConfig: {
					'@atlaskit/icon/core/addon': {
						message:
							'The icon "addon" is deprecated, Please refer to the changelog for guidance on how to migrate. https://atlassian.design/components/icon/changelog',
					},
				},
			},
		],
	},
	{
		name: 'Deprecated core icon from @atlaskit/icon-lab with replacement',
		code: `import ActivityIcon from '@atlaskit/icon-lab/core/activity';

		<ActivityIcon spacing="spacious" color="currentColor" />`,
		output: `import DashboardIcon from '@atlaskit/icon-lab/core/dashboard';

		<DashboardIcon spacing="spacious" color="currentColor" />`,
		errors: [{ messageId: 'pathWithCustomMessage' }],
		options: [
			{
				deprecatedConfig: {
					'@atlaskit/icon-lab/core/activity': {
						message:
							'The icon "activity" is deprecated in favour of "dashboard" from "@atlaskit/icon-lab/core"',
					},
				},
			},
		],
	},
	{
		name: 'Deprecated core icon from @atlaskit/icon-lab without replacement',
		code: `import AddOnIcon from '@atlaskit/icon-lab/core/addon';`,
		errors: [{ messageId: 'pathWithCustomMessage' }],
		options: [
			{
				deprecatedConfig: {
					'@atlaskit/icon-lab/core/addon': {
						message:
							'The icon "addon" is deprecated, Please refer to the changelog for guidance on how to migrate. https://atlassian.design/components/icon/changelog',
					},
				},
			},
		],
	},
	{
		name: 'Re-export deprecated core icon from @atlaskit/icon',
		code: `export { default as ActivityIcon } from '@atlaskit/icon/core/activity';`,
		errors: [{ messageId: 'pathWithCustomMessage' }],
		options: [
			{
				deprecatedConfig: {
					'@atlaskit/icon/core/activity': {
						message:
							'The icon "activity" is deprecated in favour of "dashboard" from "@atlaskit/icon/core"',
					},
				},
			},
		],
	},
	{
		name: 'Deprecated core icon used in icon button component',
		code: `
		import { IconButton } from '@atlaskit/button/new';
		import ActivityIcon from '@atlaskit/icon/core/activity';
		import AddIcon from '@atlaskit/icon/core/add';

		<>
			<IconButton icon={ActivityIcon} label="activity" />;
			<IconButton icon={AddIcon} label="add" />;
		</>
		`,
		output: `
		import { IconButton } from '@atlaskit/button/new';
		import DashboardIcon from '@atlaskit/icon/core/dashboard';
		import AddIcon from '@atlaskit/icon/core/add';

		<>
			<IconButton icon={DashboardIcon} label="activity" />;
			<IconButton icon={AddIcon} label="add" />;
		</>
		`,
		errors: [{ messageId: 'pathWithCustomMessage' }],
		options: [
			{
				deprecatedConfig: {
					'@atlaskit/icon/core/activity': {
						message:
							'The icon "activity" is deprecated in favour of "dashboard" from "@atlaskit/icon/core"',
					},
				},
			},
		],
	},
	{
		name: 'Deprecated core icon used in icon button component passing in props',
		code: `
		import { IconButton } from '@atlaskit/button/new';
		import ActivityIcon from '@atlaskit/icon/core/activity';
		import AddIcon from '@atlaskit/icon/core/add';

		<>
			<IconButton icon={(iconProps) => <ActivityIcon {...iconProps} />} label="activity" />
			<IconButton icon={(iconProps) => <AddIcon {...iconProps} />} label="add" />
		</>
		`,
		output: `
		import { IconButton } from '@atlaskit/button/new';
		import DashboardIcon from '@atlaskit/icon/core/dashboard';
		import AddIcon from '@atlaskit/icon/core/add';

		<>
			<IconButton icon={(iconProps) => <DashboardIcon {...iconProps} />} label="activity" />
			<IconButton icon={(iconProps) => <AddIcon {...iconProps} />} label="add" />
		</>
		`,
		errors: [{ messageId: 'pathWithCustomMessage' }],
		options: [
			{
				deprecatedConfig: {
					'@atlaskit/icon/core/activity': {
						message:
							'The icon "activity" is deprecated in favour of "dashboard" from "@atlaskit/icon/core"',
					},
				},
			},
		],
	},
	{
		name: 'Deprecated core icon used in iconBefore prop in button component',
		code: `
		import Button from '@atlaskit/button/new';
		import ActivityIcon from '@atlaskit/icon/core/activity';
		import AddIcon from '@atlaskit/icon/core/add';

		<>
			<Button iconBefore={ActivityIcon} label="activity" />;
			<Button iconBefore={AddIcon} label="add" />;
		</>
		`,
		output: `
		import Button from '@atlaskit/button/new';
		import DashboardIcon from '@atlaskit/icon/core/dashboard';
		import AddIcon from '@atlaskit/icon/core/add';

		<>
			<Button iconBefore={DashboardIcon} label="activity" />;
			<Button iconBefore={AddIcon} label="add" />;
		</>
		`,
		errors: [{ messageId: 'pathWithCustomMessage' }],
		options: [
			{
				deprecatedConfig: {
					'@atlaskit/icon/core/activity': {
						message:
							'The icon "activity" is deprecated in favour of "dashboard" from "@atlaskit/icon/core"',
					},
				},
			},
		],
	},
	{
		name: 'Deprecated core icon used in iconBefore prop in button component passing in props',
		code: `
		import Button from '@atlaskit/button/new';
		import ActivityIcon from '@atlaskit/icon/core/activity';
		import AddIcon from '@atlaskit/icon/core/add';

		<>
			<Button iconBefore={<ActivityIcon />} label="activity" />;
			<Button iconBefore={<AddIcon />} label="add" />;
		</>
		`,
		output: `
		import Button from '@atlaskit/button/new';
		import DashboardIcon from '@atlaskit/icon/core/dashboard';
		import AddIcon from '@atlaskit/icon/core/add';

		<>
			<Button iconBefore={<DashboardIcon />} label="activity" />;
			<Button iconBefore={<AddIcon />} label="add" />;
		</>
		`,
		errors: [{ messageId: 'pathWithCustomMessage' }],
		options: [
			{
				deprecatedConfig: {
					'@atlaskit/icon/core/activity': {
						message:
							'The icon "activity" is deprecated in favour of "dashboard" from "@atlaskit/icon/core"',
					},
				},
			},
		],
	},
	{
		name: 'Deprecated core icon used in legacy button component',
		code: `
		import Button from '@atlaskit/button';
		import ActivityIcon from '@atlaskit/icon/core/activity';
		import AddIcon from '@atlaskit/icon/core/add';

		<>
			<Button iconBefore={<ActivityIcon {...iconProps} />} label="activity" />
			<Button iconBefore={<AddIcon {...iconProps} />} label="add" />
		</>
		`,
		output: `
		import Button from '@atlaskit/button';
		import DashboardIcon from '@atlaskit/icon/core/dashboard';
		import AddIcon from '@atlaskit/icon/core/add';

		<>
			<Button iconBefore={<DashboardIcon {...iconProps} />} label="activity" />
			<Button iconBefore={<AddIcon {...iconProps} />} label="add" />
		</>
		`,
		errors: [{ messageId: 'pathWithCustomMessage' }],
		options: [
			{
				deprecatedConfig: {
					'@atlaskit/icon/core/activity': {
						message:
							'The icon "activity" is deprecated in favour of "dashboard" from "@atlaskit/icon/core"',
					},
				},
			},
		],
	},
	{
		name: 'Deprecated core migration icon from @atlaskit/icon with replacement',
		code: `import BulletedListIcon from '@atlaskit/icon/core/migration/bulleted-list--bullet-list';

		<BulletedListIcon spacing="spacious" color="currentColor" />
		`,
		output: `import ListBulletedIcon from '@atlaskit/icon/core/migration/list-bulleted--bullet-list';

		<ListBulletedIcon spacing="spacious" color="currentColor" />
		`,
		errors: [{ messageId: 'pathWithCustomMessage' }],
		options: [
			{
				deprecatedConfig: {
					'@atlaskit/icon/core/migration/bulleted-list--bullet-list': {
						message:
							'The icon "bulleted-list--bullet-list" is deprecated in favour of "list-bulleted--bullet-list" from “@atlaskit/icon/core/migration”',
					},
				},
			},
		],
	},
	{
		name: 'Deprecated core migration icon from @atlaskit/icon with no replacement',
		code: `import PageIcon from '@atlaskit/icon/core/migration/page--document';

		<PageIcon spacing="spacious" color="currentColor" />
		`,
		errors: [{ messageId: 'pathWithCustomMessage' }],
		options: [
			{
				deprecatedConfig: {
					'@atlaskit/icon/core/migration/page--document': {
						message:
							'The icon "page--document" is deprecated, Please refer to the changelog for guidance on how to migrate. https://atlassian.design/components/icon/changelog',
					},
				},
			},
		],
	},
	{
		name: 'Deprecated core migration icon from @atlaskit/icon with replacement but does not match migration map new icon',
		code: `import ImageResizeIcon from '@atlaskit/icon/core/migration/expand--image-resize';

		<ImageResizeIcon spacing="spacious" color="currentColor" />
		`,
		errors: [{ messageId: 'pathWithCustomMessage' }],
		options: [
			{
				deprecatedConfig: {
					'@atlaskit/icon/core/migration/expand--image-resize': {
						message:
							'The icon "expand--image-resize" is deprecated, Please refer to the changelog for guidance on how to migrate. https://atlassian.design/components/icon/changelog',
						unfixable: true,
					},
				},
			},
		],
	},
];
