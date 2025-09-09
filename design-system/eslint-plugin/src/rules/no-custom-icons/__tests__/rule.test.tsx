import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-custom-icons', rule, {
	valid: [
		{
			name: 'New icon from @atlaskit/icon/core',
			code: `
				import Icon from '@atlaskit/icon/core/add';
				<AddIcon label=""/>
			`,
		},
		{
			name: 'Icon from @atlaskit/icon without glyph prop',
			code: `
				import Icon from '@atlaskit/icon';
				<Icon label=""/>
			`,
		},
	],
	invalid: [],
});

describe('no-custom-icons', () => {
	tester.run(`import from @atlaskit/icon/svg`, rule, {
		valid: [],
		invalid: [
			{
				name: 'Import custom SVG icon',
				code: `
					import SVG from '@atlaskit/icon/svg';
					<SVG primaryColor={primaryColor} size={size} label={label}>
						<path
							fill="currentColor"
							d="M8.1926 18.5576c-.27 0-.55-.11-.76-.32-.42-.42-.42-1.1 0-1.52l4.71-4.71-4.75-4.74c-.42-.42-.42-1.1 0-1.52.42-.42 1.1-.42 1.52 0l5.51 5.51c.2.2.32.48.32.76s-.11.56-.32.76l-5.47 5.47c-.21.21-.49.32-.76.32v-.01Z"
						/>
					</SVG>
				`,
				errors: [
					{
						messageId: 'noCustomIcons',
					},
				],
			},
		],
	});

	['@atlaskit/icon', '@atlaskit/icon/base'].forEach((l) => {
		tester.run(`import from ${l}`, rule, {
			valid: [],
			invalid: [
				{
					name: 'Import default icon',
					code: `
						import Icon from '${l}';
						<Icon glyph="..." />
					`,
					errors: [
						{
							messageId: 'noCustomIcons',
						},
					],
				},
				{
					name: 'Import default as Icon icon',
					code: `
					  import { default as Icon } from '${l}';
					  <Icon glyph="..." />
					`,
					errors: [
						{
							messageId: 'noCustomIcons',
						},
					],
				},
				{
					name: 'Import default as CustomIcon icon',
					code: `
					  import { default as CustomIcon } from '${l}';
					  <CustomIcon glyph="..." />
					`,
					errors: [
						{
							messageId: 'noCustomIcons',
						},
					],
				},
				{
					name: 'Check message for Base Icon',
					code: `
						import Icon from '${l}';
						<Icon glyph="..." />
					`,
					errors: [
						{
							message: /'@atlaskit\/\(icon-labs|icon\/core|icon\/utility\)'\./,
						},
					],
				},
				{
					name: 'Check message for Base Icon with central location',
					options: [{ centralLocation: '@atlassian/jira-icons' }],
					code: `
						import Icon from '${l}';
						<Icon glyph="..." />
					`,
					errors: [
						{
							message:
								/'@atlaskit\/\(icon-labs|icon\/core|icon\/utility\)' or move the icon to '@atlassian\/jira-icons\'\./,
						},
					],
				},
			],
		});
	});
});
