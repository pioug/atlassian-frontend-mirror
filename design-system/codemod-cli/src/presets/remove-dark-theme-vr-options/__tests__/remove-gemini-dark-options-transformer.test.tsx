import { createCheck } from '../../../__tests__/test-utils';
import transformer from '../codemods/remove-gemini-dark-options-transformer';

const check = createCheck(transformer);

describe('Remove dark colorScheme from Gemini VR tests', () => {
	check({
		it: 'should remove dark option from VR test',
		original: `
		import { snapshot } from '@af/visual-regression';
		snapshot(ComponentName, {
			variants: [
				{
					name: 'Light',
					environment: {
						colorScheme: 'light',
					},
				},
				{
					name: 'Dark',
					environment: {
						colorScheme: 'dark',
					},
				},
			],
		});
    `,
		expected: `
		import { snapshot } from '@af/visual-regression';
		snapshot(ComponentName, {
			variants: [
				{
					name: 'Light',
					environment: {
						colorScheme: 'light',
					},
				},
			],
		});
    `,
	});

	check({
		it: 'should remove dark option from VR test, even if it is the only option',
		original: `
		import { snapshot } from '@af/visual-regression';
		snapshot(ComponentName, {
			variants: [
				{
					name: 'Dark',
					environment: {
						colorScheme: 'dark',
					},
				},
			],
		});
    `,
		expected: `
		import { snapshot } from '@af/visual-regression';
		snapshot(ComponentName, {
			variants: [
			],
		});
    `,
	});

	check({
		it: 'should keep the light colorScheme option',
		original: `
		import { snapshot } from '@af/visual-regression';
		snapshot(ComponentName, {
			variants: [
				{
					name: 'Light',
					environment: {
						colorScheme: 'light',
					},
				},
			],
		});
    `,
		expected: `
		import { snapshot } from '@af/visual-regression';
		snapshot(ComponentName, {
			variants: [
				{
					name: 'Light',
					environment: {
						colorScheme: 'light',
					},
				},
			],
		});
    `,
	});

	check({
		it: "should not modify if it's not imported from @af/visual-regression or @atlassian/jira-vr-testing",
		original: `
		import { snapshot } from '@atlaskit/visual-regression';
		import { snapshot as jiraSnapshot2 } from '@atlaskit/jira-vr-testing';
		snapshot(ComponentName, {
			variants: [
				{
					name: 'Dark',
					environment: {
						colorScheme: 'dark',
					},
				},
			],
		});
    `,
		expected: `
		import { snapshot } from '@atlaskit/visual-regression';
		import { snapshot as jiraSnapshot2 } from '@atlaskit/jira-vr-testing';
		snapshot(ComponentName, {
			variants: [
				{
					name: 'Dark',
					environment: {
						colorScheme: 'dark',
					},
				},
			],
		});
    `,
	});
});
