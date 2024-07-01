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
