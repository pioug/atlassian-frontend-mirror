import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'LinkPicker',
			description:
				'Standalone link picker UI that lets users search and select links to insert. Supports plugins for different data sources (recents, search, Jira, Confluence, etc.) and can be used in modals, popups, or inline.',
			status: 'general-availability',
			import: {
				name: 'LinkPicker',
				package: '@atlaskit/link-picker/link-picker',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use to choose a URL and optional display text. Save the choice in the app when handling onSubmit, or close the picker from onCancel.',
				'Pass plugins to search sources supported by the app. Without plugins, people can only enter URLs manually. Use @atlassian/link-picker-plugins for its authenticated recent-item and search integration.',
				'Render within SmartCardProvider when selected links need previews. Configure that provider client and access checks in the app.',
				'Set disableManualUrlInsert when people must choose a search result. Otherwise, check manually entered URLs against the app allowed destinations before using them.',
			],
			contentGuidelines: [
				'Label the action and surrounding context with product language such as “Insert link” or “Add a project link”; avoid implying that a link is saved before the host confirms it.',
			],
			accessibilityGuidelines: [
				'When opening the picker in a popup or dialog, give the trigger a clear accessible name and ensure the owning overlay returns focus to it when dismissed. The picker provides its own form and search announcements; do not wrap it in another form that submits on the same Enter key.',
				'Keep an explicit cancel or close route when the picker is part of a larger flow, and announce the host’s success or error after handling the submitted link.',
			],
			keywords: ['link-picker', 'link', 'picker', 'search', 'insert link', 'plugins'],
			categories: ['linking', 'interaction', 'forms'],
			examples: [
				{
					name: 'Manual URL entry',
					description:
						'A small controlled picker for manual URL entry; the host displays a local confirmation after submission.',
					source: `${packagePath}/examples/docs/manual-link.tsx`,
				},
				{
					name: 'Search with a local plugin',
					description:
						'Adds a deterministic in-memory search source to show how a host plugin supplies results without a backend fixture.',
					source: `${packagePath}/examples/docs/local-search-plugin.tsx`,
				},
			],
		},
		{
			name: 'LoaderFallback',
			description:
				'A loading fallback for a lazily rendered LinkPicker. Estimates the picker height from its URL, display-text, and plugin state to reduce layout shifts.',
			status: 'general-availability',
			import: {
				name: 'LoaderFallback',
				package: '@atlaskit/link-picker/loader-fallback',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Render `LoaderFallback` while a lazy LinkPicker is loading, and pass the same URL, display-text visibility, and plugin-loading state that the eventual picker will use so the estimated height stays close.',
				'Use `isLoadingPlugins` while plugin definitions are still loading; pass the actual plugin list once it is available so the fallback can estimate whether tabs will appear.',
			],
			contentGuidelines: [
				'The fallback is intentionally visual and does not explain why loading is taking time. Add host-owned status text when users need more context or the wait may be prolonged.',
			],
			accessibilityGuidelines: [
				'Keep the containing picker region busy while it is replaced by the lazy component, and provide host-owned text if the spinner alone does not communicate the pending task. Do not make the decorative sizing container separately focusable.',
			],
			keywords: ['link-picker', 'loader', 'fallback', 'lazy'],
			categories: ['linking', 'loading'],
			examples: [
				{
					name: 'Loading plugin-backed picker',
					description:
						'Estimates the loading height while plugin definitions are still being resolved.',
					source: `${packagePath}/examples/docs/loader-fallback.tsx`,
				},
			],
		},
	],
};

export default documentation;
