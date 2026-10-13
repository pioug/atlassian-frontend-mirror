import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'DocumentViewer',
			description:
				'A document preview that renders paginated pages from host-provided structured content and page images at a host-controlled zoom level. The host owns any page-navigation or zoom controls.',
			status: 'general-availability',
			import: {
				name: 'DocumentViewer',
				package: '@atlaskit/media-document-viewer',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Provide structured content and a rendered image for each document page requested by the viewer.',
				'Show loading and errors in the app. The viewer reports first-page success but has no error-state prop.',
				'Add page navigation and zoom controls when needed and pass the selected zoom value to the viewer.',
				'For large documents, enable lazy rendering to add pages as people scroll.',
			],
			contentGuidelines: [
				'Identify the document with its name outside the page canvas and keep the host loading or error message specific to that document.',
				'When document processing fails, offer a clear next step such as retrying or opening the original file.',
			],
			accessibilityGuidelines: [
				'Keep the document name and host loading/error feedback available as text; page raster images are rendered with empty alternative text.',
				'Provide access to the original document or an equivalent text representation when users need content beyond the selectable text layer.',
			],
			examples: [
				{
					name: 'Preview a host document',
					description:
						'Connects a host-provided MediaClient and file identifier to the viewer, with text feedback for loading and a host-owned failure state.',
					source: `${packagePath}/examples/ai/document-viewer.tsx`,
				},
			],
			keywords: ['media', 'document', 'viewer', 'pdf', 'word', 'excel', 'preview'],
			categories: ['media'],
		},
	],
};

export default documentation;
