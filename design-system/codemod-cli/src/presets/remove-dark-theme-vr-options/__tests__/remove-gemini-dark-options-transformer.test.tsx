import { createCheck } from '../../../__tests__/test-utils';
import transformer from '../codemods/remove-gemini-dark-options-transformer';

const check = createCheck(transformer);

describe('Remove dark colorScheme from Gemini VR tests', () => {
	describe('when imported from @af/visual-regression', () => {
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
	});

	describe('when imported from @atlassian/jira-vr-testing', () => {
		check({
			it: 'should remove dark option from VR test',
			original: `
		import { snapshot } from '@atlassian/jira-vr-testing';
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
		import { snapshot } from '@atlassian/jira-vr-testing';
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
		import { snapshot } from '@atlassian/jira-vr-testing';
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
		import { snapshot } from '@atlassian/jira-vr-testing';
		snapshot(ComponentName, {
			variants: [
			],
		});
    `,
		});

		check({
			it: 'should keep the light colorScheme option',
			original: `
		import { snapshot } from '@atlassian/jira-vr-testing';
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
		import { snapshot } from '@atlassian/jira-vr-testing';
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
	});

	describe('when imported from @atlassian/gemini', () => {
		check({
			it: 'should remove dark option from VR test',
			original: `
		import { snapshot } from '@atlassian/gemini';
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
		import { snapshot } from '@atlassian/gemini';
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
		import { snapshot } from '@atlassian/gemini';
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
		import { snapshot } from '@atlassian/gemini';
		snapshot(ComponentName, {
			variants: [
			],
		});
    `,
		});

		check({
			it: 'should keep the light colorScheme option',
			original: `
		import { snapshot } from '@atlassian/gemini';
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
		import { snapshot } from '@atlassian/gemini';
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
	});

	check({
		it: "should not modify if it's not imported from @af/visual-regression, @atlassian/jira-vr-testing or @atlassian/gemini",
		original: `
		import { snapshot } from '@atlaskit/visual-regression';
		import { snapshot as jiraSnapshot2 } from '@atlaskit/jira-vr-testing';
		import { snapshot as geminiSnapshot } from '@atlaskit/gemini';
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
		import { snapshot as geminiSnapshot } from '@atlaskit/gemini';
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
