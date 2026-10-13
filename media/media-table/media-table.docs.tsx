import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'MediaTable',
			description:
				'A table component specifically designed for displaying lists of media files with metadata like name, size, and upload date.',
			status: 'general-availability',
			import: {
				name: 'MediaTable',
				package: '@atlaskit/media-table',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use MediaTable when people need to compare or manage a page of media files; use a simple attachment list when sorting and paging are unnecessary.',
				'Use meaningful column headings and keep row actions understandable without relying on an unlabeled icon alone.',
			],
			accessibilityGuidelines: [
				'Provide a useful accessible table caption in the surrounding experience; MediaTable currently renders an empty caption.',
				'Give row actions clear accessible names, and ensure row activation or preview is also available from the keyboard.',
			],
			contentGuidelines: [
				'Use concise, specific column headings such as “File name” and “Last updated”; include units in size headings when shown.',
			],
			examples: [
				{
					name: 'Basic',
					description:
						'Render one host-provided page of files; the host supplies the authorized Media configuration and current rows.',
					source: `${packagePath}/examples/ai/media-table.tsx`,
				},
			],
			keywords: ['media', 'table', 'files', 'list', 'metadata'],
			categories: ['media', 'data-display'],
		},
		{
			name: 'NameCell',
			description:
				'A media-table cell for displaying a file name with truncation and a tooltip containing its full text.',
			status: 'general-availability',
			import: {
				name: 'NameCell',
				package: '@atlaskit/media-table/name-cell',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use NameCell in a constrained file-name column where long names would otherwise push metadata out of view.',
				'Keep the surrounding column wide enough to expose a useful part of the name; truncation should be a fallback for long filenames, not the default for every row.',
			],
			contentGuidelines: [
				'Pass the actual file name, including its extension, so people can distinguish similarly named files and identify the file type.',
			],
			accessibilityGuidelines: [
				'Keep the full file name available as text; do not replace it with an abbreviation that only the tooltip can explain.',
			],
			examples: [
				{
					name: 'Truncated file name',
					description:
						'Fit a long document name into a constrained table column while retaining the full text in the tooltip.',
					source: `${packagePath}/examples/ai/name-cell.tsx`,
				},
			],
			keywords: ['media', 'file name', 'filename', 'truncate', 'tooltip'],
			categories: ['media', 'data-display'],
		},
	],
};

export default documentation;
