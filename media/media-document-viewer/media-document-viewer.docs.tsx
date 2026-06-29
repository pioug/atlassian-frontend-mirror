import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'DocumentViewer',
			description:
				'A specialized viewer for document types like PDF, Word, and Excel, providing paginated navigation and zooming.',
			status: 'general-availability',
			import: {
				name: 'DocumentViewer',
				package: '@atlaskit/media-document-viewer',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use DocumentViewer for high-fidelity previews of documents.',
				'Supports multi-page navigation and zoom controls.',
				'Ideal for embedding document previews within a page or modal.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Standard document viewer example.',
					source: path.resolve(packagePath, './examples/basic.tsx'),
				},
			],
			keywords: ['media', 'document', 'viewer', 'pdf', 'word', 'excel', 'preview'],
			categories: ['media'],
		},
	],
};

export default documentation;
