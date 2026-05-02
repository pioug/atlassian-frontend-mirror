/**
 * Testing structured MCP docs for review — ignore this file.
 * Contact #dst-structured-content in Slack with questions.
 */

import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'LinkCreate',
		description:
			'The driver component of the link creation (meta create) flow. Renders a modal with plugin tabs (e.g. Jira issue, Confluence page); each plugin provides a form that returns a URL and metadata on success. Use for "create and link" experiences.',
		status: 'general-availability',
		import: {
			name: 'LinkCreate',
			package: '@atlaskit/link-create',
			type: 'default',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when the user should create a new resource (issue, page, etc.) and insert its link in one flow. Supply plugins (e.g. from link-create-jira, link-create-confluence); control visibility with active/onCancel.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the modal has an accessible title and focus is trapped; ensure plugin forms have proper labels and error messages announced.',
		],
		keywords: ['link-create', 'create', 'modal', 'meta create', 'plugins'],
		categories: ['linking', 'forms', 'interaction'],
		examples: [],
	},
	{
		name: 'InlineCreate',
		description:
			'Inline (non-modal) link creation experience. Renders plugin forms inline so users can create a resource and get a link without opening a modal.',
		status: 'general-availability',
		import: {
			name: 'InlineCreate',
			package: '@atlaskit/link-create',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when you want "create and link" inline (e.g. in a dropdown or panel) instead of a modal. Supply the same plugin structure as LinkCreate.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the inline form has an accessible name and that focus moves logically through fields.',
		],
		keywords: ['link-create', 'inline', 'create', 'plugins'],
		categories: ['linking', 'forms', 'interaction'],
		examples: [],
	},
	{
		name: 'CreateForm',
		description:
			'Form container for a single link-create plugin. Renders the plugin form UI and handles submit, validation, and success callback. Used inside plugin form implementations.',
		status: 'general-availability',
		import: {
			name: 'CreateForm',
			package: '@atlaskit/link-create',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when building a custom LinkCreatePlugin form; wrap your fields in CreateForm and use onSubmit to return CreatePayload on success.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-create', 'form', 'CreateForm', 'plugin'],
		categories: ['linking', 'forms'],
		examples: [],
	},
	{
		name: 'CreateFormLoader',
		description:
			'Loader wrapper for CreateForm that shows a loading state until form data or context is ready.',
		status: 'general-availability',
		import: {
			name: 'CreateFormLoader',
			package: '@atlaskit/link-create',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when the create form depends on async data (e.g. site list, field config); show loading until ready then render CreateForm.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: ['Ensure loading state is announced (e.g. aria-busy or live region).'],
		keywords: ['link-create', 'form', 'loader', 'CreateFormLoader'],
		categories: ['linking', 'forms'],
		examples: [],
	},
	{
		name: 'FormSpy',
		description:
			'Component that subscribes to form state (values, errors, submitting) from react-final-form. Used to build custom UI that reacts to form state.',
		status: 'general-availability',
		import: {
			name: 'FormSpy',
			package: '@atlaskit/link-create',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when you need to read or react to create form state (e.g. to enable/disable a submit button or show a summary) without controlling the form.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-create', 'form', 'FormSpy', 'react-final-form'],
		categories: ['linking', 'forms'],
		examples: [],
	},
	{
		name: 'AsyncSelect',
		description:
			'Async-capable select component used in link-create forms for fields that load options from an API (e.g. project, type).',
		status: 'general-availability',
		import: {
			name: 'AsyncSelect',
			package: '@atlaskit/link-create',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use inside a create form when the dropdown options are loaded asynchronously (e.g. Jira projects, issue types).',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the select has a label and that options are announced to screen readers.',
		],
		keywords: ['link-create', 'select', 'async', 'form'],
		categories: ['linking', 'forms'],
		examples: [],
	},
	{
		name: 'Select',
		description: 'Select component for link-create forms. Use for static or sync option lists.',
		status: 'general-availability',
		import: {
			name: 'Select',
			package: '@atlaskit/link-create',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use inside a create form for dropdowns with static or synchronously available options.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: ['Ensure the select has an accessible label.'],
		keywords: ['link-create', 'select', 'form'],
		categories: ['linking', 'forms'],
		examples: [],
	},
	{
		name: 'SiteSelect',
		description:
			'Site/product picker used in link-create forms when the user must choose a site or product (e.g. Jira site, Confluence space) before other fields.',
		status: 'general-availability',
		import: {
			name: 'SiteSelect',
			package: '@atlaskit/link-create',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when the create flow requires picking a site or product first; follow with form fields that depend on that selection.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the site picker has an accessible name and that selected site is announced.',
		],
		keywords: ['link-create', 'site', 'select', 'picker', 'form'],
		categories: ['linking', 'forms'],
		examples: [],
	},
	{
		name: 'TextField',
		description: 'Text input component for link-create forms. Wired for validation and final-form.',
		status: 'general-availability',
		import: {
			name: 'TextField',
			package: '@atlaskit/link-create',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use inside a create form for single-line text fields (e.g. title, summary).',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure each field has a visible or aria-label and that validation errors are announced.',
		],
		keywords: ['link-create', 'textfield', 'input', 'form'],
		categories: ['linking', 'forms'],
		examples: [],
	},
	{
		name: 'UserPicker',
		description:
			'User picker component for link-create forms. Used for assignee, reporter, or other user fields.',
		status: 'general-availability',
		import: {
			name: 'UserPicker',
			package: '@atlaskit/link-create',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use inside a create form when the user must select a person (e.g. assignee, creator).',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the picker has an accessible name and that the selected user is announced.',
		],
		keywords: ['link-create', 'user', 'picker', 'form'],
		categories: ['linking', 'forms'],
		examples: [],
	},
	{
		name: 'LinkCreateCallbackProvider',
		description:
			'Context provider that supplies a callback (e.g. on success) to link-create. Used so plugins or parents can react to create completion.',
		status: 'general-availability',
		import: {
			name: 'LinkCreateCallbackProvider',
			package: '@atlaskit/link-create',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Wrap LinkCreate or InlineCreate when you need to run custom logic (e.g. insert link, close picker) when create succeeds; consume with useLinkCreateCallback.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-create', 'callback', 'context', 'provider'],
		categories: ['linking', 'forms'],
		examples: [],
	},
	{
		name: 'useLinkCreateCallback',
		description:
			'Hook that returns the link-create callback from LinkCreateCallbackProvider. Use to trigger or react to create success from child components.',
		status: 'general-availability',
		import: {
			name: 'useLinkCreateCallback',
			package: '@atlaskit/link-create',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use inside a plugin or child of LinkCreateCallbackProvider when you need access to the create-success callback.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-create', 'hooks', 'callback', 'useLinkCreateCallback'],
		categories: ['linking', 'forms'],
		examples: [],
	},
	{
		name: 'LinkCreateExitWarningProvider',
		description:
			'Provider that enables an exit-confirmation when the user tries to leave the create flow with unsaved changes. Uses ExitWarningModalProvider internally.',
		status: 'general-availability',
		import: {
			name: 'LinkCreateExitWarningProvider',
			package: '@atlaskit/link-create',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Wrap the create flow when you want to warn users before closing or navigating away with unsaved form data.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the exit warning modal is focusable and has an accessible title and actions.',
		],
		keywords: ['link-create', 'exit', 'warning', 'provider', 'unsaved'],
		categories: ['linking', 'forms', 'interaction'],
		examples: [],
	},
	{
		name: 'useWithExitWarning',
		description:
			'Hook that wires the current form or flow into the exit-warning behavior. Use when building custom create UI that should trigger the exit warning.',
		status: 'general-availability',
		import: {
			name: 'useWithExitWarning',
			package: '@atlaskit/link-create',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use inside a component wrapped by LinkCreateExitWarningProvider when you need to register dirty state or trigger the exit warning modal.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-create', 'hooks', 'exit', 'warning', 'useWithExitWarning'],
		categories: ['linking', 'forms'],
		examples: [],
	},
	{
		name: 'CreateField',
		description:
			'Controller component that connects a form field to the create form state (name, validation, value). Use to build custom fields that participate in CreateForm.',
		status: 'general-availability',
		import: {
			name: 'CreateField',
			package: '@atlaskit/link-create',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when building a custom form field (e.g. custom select, date picker) that must be part of the create form validation and submit payload.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the rendered control has an accessible name and that validation errors are associated (e.g. aria-describedby).',
		],
		keywords: ['link-create', 'form', 'field', 'CreateField'],
		categories: ['linking', 'forms'],
		examples: [],
	},
];

export default documentation;
