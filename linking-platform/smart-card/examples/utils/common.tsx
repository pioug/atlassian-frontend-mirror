/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { IntlProvider } from 'react-intl-next';

import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	forbiddenJira,
	iconGoogleDrive,
	image1,
	image2,
	imageForbiddenJiraEmbed,
} from '@atlaskit/link-test-helpers';
import type { SmartLinkResponse } from '@atlaskit/linking-types';
import Page from '@atlaskit/page';
import { token } from '@atlaskit/tokens';

interface VRTestCaseOpts {
	title: string;
	children: () => JSX.Element;
}

const subHeaderCSS = css({
	// We are keeping this margin as a hardcoded variable as it is not a standard token size and needs
	// to be thoroughly checked with a designer so that we do not miss an unintended visual change
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
	marginTop: '28px',
	marginBottom: token('space.100', '8px'),
});

const divPadding = css({
	padding: '30px',
});

export const VRTestCase = ({ title, children }: VRTestCaseOpts) => {
	return (
		<IntlProvider locale={'en'}>
			<Page>
				<div css={divPadding}>
					<h6 css={subHeaderCSS}>{title}</h6>
					{children()}
				</div>
			</Page>
		</IntlProvider>
	);
};

export const mocks = {
	entityDataSuccess: {
		meta: {
			visibility: 'public',
			access: 'granted',
			auth: [],
			definitionId: 'd1',
			key: 'object-provider',
			resourceType: 'object-resource',
			subproduct: 'object-subproduct',
			product: 'object-product',
			generator: {
				name: 'I love cheese',
				icon: {
					url: image2,
				},
			},
		},
		data: {
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			'@type': 'Object',
			name: 'https://some.url',
			summary: 'Here is your serving of cheese: 🧀',
			preview: {
				href: 'https://www.ilovecheese.com',
			},
			generator: {
				'@type': 'Application',
				icon: {
					'@type': 'Image',
					url: image2,
				},
				name: 'I love cheese',
			},
			url: 'https://some.url',
		},
		entityData: {
			id: 'I love cheese',
			displayName: 'I love cheese',
			description: 'Here is your serving of cheese: 🧀',
			url: 'https://some.url',
			lastUpdatedAt: '2025-01-08T22:26:52.501Z',
			thumbnail: {
				externalUrl: image1,
			},
			liveEmbedUrl: 'https://www.ilovecheese.com',
			type: 'FILE',
			inspectUrl: 'https://www.ilovecheese.com',
			iconUrl: image2,
		},
	} as SmartLinkResponse,
	notFound: {
		meta: {
			visibility: 'not_found',
			access: 'forbidden',
			auth: [],
			definitionId: 'd1',
			key: 'object-provider',
		},
		data: {
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			'@type': 'Object',
			generator: {
				'@type': 'Application',
				name: 'Google',
				icon: {
					'@type': 'Image',
					url: iconGoogleDrive,
				},
			},
			name: 'I love cheese',
			url: 'https://some.url',
		},
	} as JsonLd.Response,
	forbidden: {
		meta: {
			visibility: 'restricted',
			access: 'forbidden',
			auth: [
				{
					key: 'some-flow',
					displayName: 'Flow',
					url: 'https://outbound-auth/flow',
				},
			],
			definitionId: 'd1',
			key: 'object-provider',
		},
		data: {
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			'@type': 'Object',
			generator: {
				'@type': 'Application',
				name: 'Google',
				icon: {
					'@type': 'Image',
					url: iconGoogleDrive,
				},
			},
			url: 'https://some.url',
		},
	} as JsonLd.Response,
	unresolved: (accessType = 'FORBIDDEN', visibility = 'not_found') =>
		({
			meta: {
				auth: [],
				definitionId: 'jira-object-provider',
				product: 'jira',
				visibility,
				access: 'forbidden',
				resourceType: 'issue',
				category: 'object',
				tenantId: 'tenant-id',
				key: 'jira-object-provider',
				requestAccess: {
					accessType,
					cloudId: 'cloud-id',
				},
			},

			data: {
				'@context': {
					'@vocab': 'https://www.w3.org/ns/activitystreams#',
					atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
					schema: 'http://schema.org/',
				},
				generator: {
					'@type': 'Application',
					'@id': 'https://www.atlassian.com/#Jira',
					name: 'Jira',
					icon: {
						'@type': 'Image',
						url: 'https://icon-url',
					},
					image: {
						'@type': 'Image',
						url: imageForbiddenJiraEmbed,
					},
				},
				image: {
					'@type': 'Image',
					url: forbiddenJira,
				},
				url: 'https://site.atlassian.net/browse/key-1',
				'@type': ['atlassian:Task', 'Object'],
			},
		}) as JsonLd.Response,
	unauthorized: {
		meta: {
			access: 'unauthorized',
			visibility: 'restricted',
			auth: [
				{
					key: 'some-flow',
					displayName: 'Flow',
					url: 'https://outbound-auth/flow',
				},
			],
			definitionId: 'd1',
			key: 'google-object-provider',
			resourceType: 'file',
		},
		data: {
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			'@type': 'Object',
			generator: {
				'@type': 'Application',
				name: 'Google',
				icon: {
					'@type': 'Image',
					url: iconGoogleDrive,
				},
			},
			url: 'https://some.url',
		},
	} as JsonLd.Response,
};

const toEmptyFunctionString = (): string => '() => {}';

export const toObjectString = (obj: object, indent: string = ''): string => {
	const str = Object.entries(obj)
		.map(([key, value]) => `${key}: ${toValueString(value)}`)
		.join(', ');
	return `${indent}{ ${str} }`;
};

const toArrayString = (arr: any[], indent: string = ''): string => {
	const str = arr.map((value: any) => toValueString(value, `${indent}\t`)).join(', ');
	return `[${str}${indent}]`;
};

const toValueString = (value: any, indent: string = ''): string => {
	if (typeof value === 'string') {
		return `"${value}"`;
	} else if (Array.isArray(value)) {
		return toArrayString(value, indent);
	} else if (typeof value === 'function') {
		return toEmptyFunctionString();
	} else if (typeof value === 'object') {
		if (value['$$typeof'] === Symbol.for('react.element')) {
			// This is likely the custom action icon
			return '<CustomComponent />';
		} else {
			return toObjectString(value, indent);
		}
	} else {
		return `${value}`;
	}
};

const toComponentProp = (key: string, value?: any, indent?: string): string => {
	if (typeof value === 'string') {
		return `${key}="${value}"`;
	} else {
		return `${key}={${toValueString(value, indent)}}`;
	}
};

export const toComponentProps = (props: object, indent: string = '\n\t'): string =>
	Object.entries(props).reduce(
		(acc, [key, value]) => `${acc}${indent}${toComponentProp(key, value, indent)}`,
		'',
	);

export { overrideEmbedContent } from '@atlaskit/link-test-helpers';
