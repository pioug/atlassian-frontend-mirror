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
		name: 'JsonLdTypes',
		description:
			'Types for the Atlassian Object Vocabulary (JSON-LD). Used by Smart Link resolver responses and link extractors to type document and entity structures. No runtime components; import types when working with JSON-LD from the resolver or link metadata.',
		status: 'general-availability',
		import: {
			name: 'defaults',
			package: '@atlaskit/json-ld-types',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when you need to type JSON-LD payloads (e.g. from the Smart Link resolver) or when building extractors or UI that consume link metadata. Complements link-extractors and linking-types.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['json-ld-types', 'json-ld', 'types', 'atlassian object vocabulary'],
		categories: ['linking'],
		examples: [],
	},
];

export default documentation;
