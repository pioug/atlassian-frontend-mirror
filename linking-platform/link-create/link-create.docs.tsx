import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	config: {
		componentPages: true,
		packageTabs: {
			examples: true,
			usage: true,
		},
	},
	components: [
		{
			name: 'LinkCreate',
			description:
				'The modal driver for a create-and-link flow. Each plugin supplies its own form and reports the created resource URL and metadata through callbacks.',
			status: 'general-availability',
			import: {
				name: 'default',
				package: '@atlaskit/link-create/modal-create',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use to create an item and insert its link in one step. Control visibility with active and close the modal from onCancel or onComplete.',
				'Call the product creation API from onSubmit. After saving succeeds, pass the saved item URL, ID, and type to onCreate so the link opens that item.',
			],
			contentGuidelines: [
				'Use a specific modal title and keep plugin and field labels consistent with the resource being created.',
			],
			accessibilityGuidelines: [
				'The modal manages focus containment. Keep the open and close actions connected so focus returns to the control that launched creation.',
				'Give every plugin field a programmatic label and associate returned validation errors with that field.',
			],
			examples: [
				{
					name: 'Basic modal create',
					description:
						'Runs a local callback simulation with a placeholder resource URL; it does not persist a work item.',
					source: `${packagePath}/examples/docs/modal-create-basic.tsx`,
				},
				{
					name: 'Inline create',
					description:
						'Runs a local callback simulation with a placeholder page URL; it does not persist a page.',
					source: `${packagePath}/examples/docs/inline-create.tsx`,
				},
			],
			keywords: ['link-create', 'linkcreate'],
			categories: ['linking', 'forms'],
		},

		{
			name: 'InlineCreate',
			description:
				'An inline create-and-link flow that renders plugin forms in the surrounding page or panel.',
			status: 'general-availability',
			import: {
				name: 'InlineCreate',
				package: '@atlaskit/link-create/inline-create',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when the form belongs in the current page or panel context and should not open a modal.',
				'The plugin and submit callback contract matches LinkCreate, so share plugin form logic when only the presentation differs.',
			],
			contentGuidelines: [
				'Keep the section heading and plugin label clear about what will be created.',
			],
			accessibilityGuidelines: [
				'Place the form under a meaningful heading and keep keyboard focus order consistent with the surrounding page.',
				'Provide visible labels and announced validation errors for every plugin field.',
			],
			examples: [
				{
					name: 'Inline page creation',
					description: 'Keeps the create form in the page beside its contextual heading.',
					source: `${packagePath}/examples/docs/inline-create.tsx`,
				},
			],
			keywords: ['link-create', 'inlinecreate'],
			categories: ['linking', 'forms'],
		},

		{
			name: 'CreateForm',
			description:
				'The form container for one LinkCreate plugin. It manages field state, validation, submission, cancel behavior, and its action footer.',
			status: 'general-availability',
			import: {
				name: 'CreateForm',
				package: '@atlaskit/link-create/create-form',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use inside a LinkCreate plugin to connect fields to shared submit, cancel, validation, and footer behavior. Return field-keyed errors from `onSubmit` when the server rejects specific values.',
			],
			contentGuidelines: [
				'Use concise field labels and helper text for constraints users need before submitting. Return field-specific errors with actionable language.',
			],
			accessibilityGuidelines: [
				'Keep errors associated with the field that failed and preserve entered values after a submission error.',
			],
			examples: [
				{
					name: 'Basic modal create',
					description: 'Connects fields, form values, submit, and cancel callbacks.',
					source: `${packagePath}/examples/docs/modal-create-basic.tsx`,
				},
				{
					name: 'Loading before fields are ready',
					description: 'Replaces a loading state with a configured form.',
					source: `${packagePath}/examples/docs/loading-form.tsx`,
				},
			],
			keywords: ['link-create', 'createform'],
			categories: ['linking', 'forms'],
		},

		{
			name: 'CreateFormLoader',
			description:
				'A centered loading indicator for a plugin form whose required configuration or data is not ready.',
			status: 'general-availability',
			import: {
				name: 'CreateFormLoader',
				package: '@atlaskit/link-create/form-loader',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Render while a plugin is waiting for field configuration or tenant data, then replace it with the ready form. Do not use it for an in-progress submit; CreateForm owns that state.',
			],
			contentGuidelines: [
				'If loading takes noticeable time, say which fields or context are being prepared rather than showing an unexplained spinner.',
			],
			accessibilityGuidelines: [
				'Pair the visual loader with an announced status when its purpose is unclear, and mark the form region busy.',
			],
			examples: [
				{
					name: 'Loading before fields are ready',
					description: 'Shows the loader while the plugin prepares its form.',
					source: `${packagePath}/examples/docs/loading-form.tsx`,
				},
			],
			keywords: ['link-create', 'createformloader'],
			categories: ['linking', 'forms'],
		},

		{
			name: 'FormSpy',
			description: 'A lightweight subscription to the current values in a LinkCreate form.',
			status: 'general-availability',
			import: {
				name: 'FormSpy',
				package: '@atlaskit/link-create/form-spy',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Read only the values needed for dependent UI, such as a short summary of a selected work type. Keep validation and submission in CreateForm rather than duplicating form state.',
			],
			contentGuidelines: [
				'Keep summaries short and supplementary; do not repeat every field value as the user types.',
			],
			accessibilityGuidelines: [
				'Avoid announcing transient changes continuously. Use a live region only when the changed summary is needed to understand the next step.',
			],
			examples: [
				{
					name: 'Dependent form summary',
					description: 'Reflects the selected work type without owning form state.',
					source: `${packagePath}/examples/docs/modal-create-basic.tsx`,
				},
			],
			keywords: ['link-create', 'formspy'],
			categories: ['linking', 'forms'],
		},

		{
			name: 'AsyncSelect',
			description: 'A form select whose options are loaded from an asynchronous source.',
			status: 'general-availability',
			import: {
				name: 'AsyncSelect',
				package: '@atlaskit/link-create/async-select',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when choices depend on a search query or remote product data. Keep `loadOptions` stable between renders and return the option objects expected by the select.',
			],
			contentGuidelines: [
				'Label the field by the resource being selected and distinguish loading, no-results, and error states.',
			],
			accessibilityGuidelines: [
				'Provide a visible label and ensure keyboard users can search and select options; expose loading and no-results feedback.',
			],
			examples: [
				{
					name: 'Searchable async project field',
					description: 'Filters project options as the user searches.',
					source: `${packagePath}/examples/docs/async-fields.tsx`,
				},
			],
			keywords: ['link-create', 'asyncselect'],
			categories: ['linking', 'forms'],
		},

		{
			name: 'Select',
			description: 'A form select for static or already-loaded choices.',
			status: 'general-availability',
			import: {
				name: 'Select',
				package: '@atlaskit/link-create/select',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use for a short list of choices already available to the form. Prefer AsyncSelect for searchable remote results and SiteSelect for the standard product-site option format.',
			],
			contentGuidelines: [
				'Use visible option names that remain distinct without relying on icons or color.',
			],
			accessibilityGuidelines: [
				'Provide a visible label and ensure option names communicate each choice without color or icon alone.',
			],
			examples: [
				{
					name: 'Basic modal create',
					description: 'Offers a short, preloaded list of work types.',
					source: `${packagePath}/examples/docs/modal-create-basic.tsx`,
				},
				{
					name: 'Site and assignee fields',
					description: 'Uses the site-specific select for tenant selection.',
					source: `${packagePath}/examples/docs/site-and-assignee.tsx`,
				},
			],
			keywords: ['link-create', 'select'],
			categories: ['linking', 'forms'],
		},

		{
			name: 'SiteSelect',
			description:
				'A site and product picker with the standard site option presentation for create forms.',
			status: 'general-availability',
			import: {
				name: 'SiteSelect',
				package: '@atlaskit/link-create/select',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when changing the site changes the available records or creation fields. Pass site options from the app configuration.',
			],
			contentGuidelines: [
				'Use product and site names users recognize, not raw cloud IDs or host URLs as option labels.',
			],
			accessibilityGuidelines: [
				'Keep the picker label and selected site name available to assistive technology; do not encode the site only in its avatar.',
			],
			examples: [
				{
					name: 'Site and assignee fields',
					description: 'Combines a host-provided site choice with tenant-scoped people search.',
					source: `${packagePath}/examples/docs/site-and-assignee.tsx`,
				},
			],
			keywords: ['link-create', 'siteselect'],
			categories: ['linking', 'forms'],
		},

		{
			name: 'TextField',
			description: 'A single-line text control connected to LinkCreate validation and form state.',
			status: 'general-availability',
			import: {
				name: 'TextField',
				package: '@atlaskit/link-create/text-field',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use for short values such as a title or summary. Set an explicit label and a relevant maximum length when the receiving product has a limit.',
			],
			contentGuidelines: [
				'Use a visible label rather than placeholder text as the only instruction; explain formatting constraints before submission.',
			],
			accessibilityGuidelines: [
				'Associate helper text and errors with the input, and do not use a placeholder as its sole label.',
			],
			examples: [
				{
					name: 'Basic modal create',
					description: 'Collects a required work-item summary.',
					source: `${packagePath}/examples/docs/modal-create-basic.tsx`,
				},
			],
			keywords: ['link-create', 'textfield'],
			categories: ['linking', 'forms'],
		},

		{
			name: 'UserPicker',
			description:
				'A tenant-scoped person picker for create-form fields such as assignee or reporter.',
			status: 'general-availability',
			import: {
				name: 'UserPicker',
				package: '@atlaskit/link-create/user-picker',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when creation needs a person from the selected site. Set siteId from the site selected in the form, and pass its product key so search uses that directory.',
			],
			contentGuidelines: [
				'Use a familiar field label such as “Assignee” and distinguish people with similar names.',
			],
			accessibilityGuidelines: [
				'Keep keyboard access to search and results; identify the selected person by name, not avatar alone.',
			],
			examples: [
				{
					name: 'Site and assignee fields',
					description:
						'Derives the search tenant from the selected site; replace the fixture with a real host-provided site and user-search integration.',
					source: `${packagePath}/examples/docs/site-and-assignee.tsx`,
				},
			],
			keywords: ['link-create', 'userpicker'],
			categories: ['linking', 'forms'],
		},

		{
			name: 'LinkCreateCallbackProvider',
			description:
				'A context provider for success, failure, and cancel callbacks consumed by plugin forms.',
			status: 'general-availability',
			import: {
				name: 'LinkCreateCallbackProvider',
				package: '@atlaskit/link-create/callback-context',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'LinkCreate and InlineCreate already provide this context to their plugin forms. Use the provider directly for a custom form rendered outside those components.',
			],
			contentGuidelines: [
				'Report create results and failures in the host experience; do not expose internal ARIs as user-facing copy.',
			],
			accessibilityGuidelines: [
				'This provider does not render announcements. Make success and failure feedback available through the host UI.',
			],
			examples: [
				{
					name: 'Create callback context',
					description:
						'Reports a placeholder payload through a local callback simulation; it does not persist a resource.',
					source: `${packagePath}/examples/docs/callback-provider.tsx`,
				},
			],
			keywords: ['link-create', 'linkcreatecallbackprovider'],
			categories: ['linking', 'forms'],
		},

		{
			name: 'LinkCreateExitWarningProvider',
			description:
				'Context for tracking dirty create forms; pair it with InlineCreate, which renders the exit confirmation dialog.',
			status: 'general-availability',
			import: {
				name: 'LinkCreateExitWarningProvider',
				package: '@atlaskit/link-create/exit-warning-modal',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Wrap InlineCreate when leaving the page should warn about unsaved changes. InlineCreate shows the confirmation dialog, and CreateForm reports whether there are unsaved edits.',
				'LinkCreate already manages this provider for its modal.',
			],
			contentGuidelines: [
				'Name the unsaved work and give clear choices to keep editing or discard it.',
			],
			accessibilityGuidelines: [
				'Give the confirmation dialog an accessible title and clear actions; restore focus to the form or its trigger after the choice.',
			],
			examples: [
				{
					name: 'Unsaved form with InlineCreate',
					description:
						'Wraps InlineCreate in the public provider; edit the summary, then use the guarded leave action to see the confirmation dialog.',
					source: `${packagePath}/examples/docs/unsaved-form-warning.tsx`,
				},
			],
			keywords: ['link-create', 'linkcreateexitwarningprovider'],
			categories: ['linking', 'forms'],
		},

		{
			name: 'CreateField',
			description:
				'A controller that connects a custom control to LinkCreate form values and validation.',
			status: 'general-availability',
			import: {
				name: 'CreateField',
				package: '@atlaskit/link-create/create-field',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when building a custom control that must participate in CreateForm validation and submission. Forward the field ID, required state, invalid state, and helper/error relationships to the rendered control.',
			],
			contentGuidelines: [
				'Use the same visible label for the control and validation feedback so an error is easy to connect to its field.',
			],
			accessibilityGuidelines: [
				'Forward the generated ID, `aria-invalid`, `aria-describedby`, and `aria-errormessage` values to the rendered control.',
			],
			examples: [
				{
					name: 'Custom validated field',
					description: 'Connects a custom control to create-form state and validation.',
					source: `${packagePath}/examples/docs/custom-field.tsx`,
				},
			],
			keywords: ['link-create', 'createfield'],
			categories: ['linking', 'forms'],
		},
	],
	hooks: [
		{
			name: 'useLinkCreateCallback',
			description:
				'Hook that returns the link-create callback from LinkCreateCallbackProvider. Use to trigger or react to create success from child components.',
			status: 'general-availability',
			import: {
				name: 'useLinkCreateCallback',
				package: '@atlaskit/link-create/callback-context',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use inside a plugin or child of LinkCreateCallbackProvider when you need access to the create-success callback.',
			],
			accessibilityGuidelines: [],
			keywords: ['link-create', 'hooks', 'callback', 'useLinkCreateCallback'],
			categories: ['linking', 'forms'],
			examples: [],
		},
		{
			name: 'useWithExitWarning',
			description:
				'Hook that wires the current form or flow into the exit-warning behavior. Use when building custom create UI that should trigger the exit warning.',
			status: 'general-availability',
			import: {
				name: 'useWithExitWarning',
				package: '@atlaskit/link-create/exit-warning-modal',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use inside a component wrapped by LinkCreateExitWarningProvider when you need to register dirty state or trigger the exit warning modal.',
			],
			accessibilityGuidelines: [],
			keywords: ['link-create', 'hooks', 'exit', 'warning', 'useWithExitWarning'],
			categories: ['linking', 'forms'],
			examples: [],
		},
	],
};

export default documentation;
