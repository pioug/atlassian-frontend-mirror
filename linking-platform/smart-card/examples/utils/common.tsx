/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';
import { type JsonLd } from 'json-ld-types';
import Page from '@atlaskit/page';
import { token } from '@atlaskit/tokens';
import { forbiddenJira, iconGoogleDrive, imageForbiddenJiraEmbed } from '../images';
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

export const VRTestCase = ({ title, children }: VRTestCaseOpts) => {
	return (
		<IntlProvider locale={'en'}>
			<Page>
				{/* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview*/}
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ padding: '30px' }}>
					<h6 css={subHeaderCSS}>{title}</h6>
					{children()}
				</div>
			</Page>
		</IntlProvider>
	);
};

const content = `
<html>
  <body style="font-family:sans-serif;text-align:center;background-color:#091E4208">
    VR TEST: EMBED CONTENT
  </body>
</html>
`;
const encodedContent = encodeURIComponent(content);
export const overrideEmbedContent = `data:text/html;charset=utf-8,${encodedContent}`;

export const mocks = {
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
