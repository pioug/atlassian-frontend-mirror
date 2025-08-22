/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';

import { DefaultExtensionProvider } from '@atlaskit/editor-common/extensions';
import type { ExtensionManifest, ExtensionProvider } from '@atlaskit/editor-common/extensions';
import Link from '@atlaskit/link';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { nativeFields } from '../example-utils/config-panel/fields';
import ConfigPanel from '../src/ui/ConfigPanel/ConfigPanelLoader';

const wrapperStyles = css({
	display: 'flex',
	flexDirection: 'row',

	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	h3: {
		margin: `${token('space.100', '8px')} 0`,
	},
});

const contextPanelWrapperStyles = xcss({
	margin: 'space.100',
	height: '100%',
});

// Adding border as 2px instead of 1px, since Design tokens supports space sizes in 2 multiples only
// Ref: https://atlassian.design/components/tokens/all-tokens
const contextPanelStyles = css({
	border: `${token('space.025', '2px')} solid ${N30}`,
	width: '360px',
	height: '450px',
	padding: token('space.200', '16px'),
	overflowY: 'auto',
});

const createFakeContextPanel =
	(extensionProvider: ExtensionProvider) => (props: { nodeKey: string; title: string; }) => {
		return (
			<Box xcss={contextPanelWrapperStyles}>
				<h3>{props.title}</h3>
				<div css={contextPanelStyles}>
					<ConfigPanel
						api={undefined}
						showHeader
						extensionProvider={extensionProvider}
						extensionKey="examples"
						extensionType="twp.editor.example"
						nodeKey={props.nodeKey}
						onChange={noop}
						onCancel={noop}
					/>
				</div>
			</Box>
		);
	};

const exampleManifest: ExtensionManifest = {
	title: 'Editor example',
	type: 'twp.editor.example',
	key: 'examples',
	description: 'Extension used as example to demonstrate different states.',
	documentationUrl: 'http://atlassian.com',
	icons: {
		'48': () => import('@atlaskit/icon/core/angle-brackets'),
	},
	modules: {
		nodes: {
			loading: {
				type: 'extension',
				render: () => Promise.resolve(() => null),
				getFieldsDefinition: () => {
					return new Promise((resolve) => {
						// never resolves
					});
				},
			},
			error: {
				type: 'extension',
				render: () => Promise.resolve(() => null),
				getFieldsDefinition: () => {
					return Promise.reject(
						new Error(
							'This is an error that gets included when the Promise returned from getFieldsDefinition is rejected.',
						),
					);
				},
			},
			loaded: {
				type: 'extension',
				render: () => Promise.resolve(() => null),
				getFieldsDefinition: () => {
					return Promise.resolve([nativeFields[0], nativeFields[1]]);
				},
			},
		},
	},
};

const FakeContextPanel = createFakeContextPanel(new DefaultExtensionProvider([exampleManifest]));

const manifestWithDeprecation = {
	...exampleManifest,
	deprecation: {
		isDeprecated: true,
		message: (
			<div>
				A deprecation message can include <Link href="#link">links</Link> or <b>styling.</b>
			</div>
		),
	},
};

const manifestWithSummary = {
	...exampleManifest,
	summary: 'Short text describing this extension',
};

const manifestWithoutDescription = {
	...exampleManifest,
	summary: 'No description',
	description: undefined,
};

const manifestWithoutDescriptionOrDocumentation = {
	...exampleManifest,
	summary: 'No description, no docs',
	description: undefined,
	documentationUrl: undefined,
};

const manifestWithoutDocumentation = {
	...exampleManifest,
	summary: 'No docs',
	documentationUrl: undefined,
};

const manifestWithoutSummaryAndDocumentation = {
	...exampleManifest,
	summary: undefined,
	documentationUrl: undefined,
};

const manifestWithoutSummaryAndDescriptionAndDocumentation = {
	...exampleManifest,
	summary: undefined,
	description: undefined,
	documentationUrl: undefined,
};

const FaceContextPanelWithDeprecation = createFakeContextPanel(
	new DefaultExtensionProvider([manifestWithDeprecation]),
);

const FakeContextPanelWithSummary = createFakeContextPanel(
	new DefaultExtensionProvider([manifestWithSummary]),
);

const FakeContextPanelWithoutDescription = createFakeContextPanel(
	new DefaultExtensionProvider([manifestWithoutDescription]),
);

const FakeContextPanelWithoutDescriptionOrDocumentation = createFakeContextPanel(
	new DefaultExtensionProvider([manifestWithoutDescriptionOrDocumentation]),
);

const FakeContextPanelWithoutDocumentation = createFakeContextPanel(
	new DefaultExtensionProvider([manifestWithoutDocumentation]),
);

const FakeContextPanelWithoutSummaryAndDocumentation = createFakeContextPanel(
	new DefaultExtensionProvider([manifestWithoutSummaryAndDocumentation]),
);

const FakeContextPanelWithoutSummaryAndDescriptionAndDocumentation = createFakeContextPanel(
	new DefaultExtensionProvider([manifestWithoutSummaryAndDescriptionAndDocumentation]),
);

const noop = () => {};

export default function Example() {
	return (
		<IntlProvider locale="en">
			<div css={wrapperStyles}>
				<FakeContextPanel nodeKey="loading" title="Loading state" />
				<FakeContextPanel nodeKey="error" title="Error state" />
			</div>
			<div css={wrapperStyles}>
				<FakeContextPanel nodeKey="loaded" title="Loaded state" />
				<FakeContextPanelWithSummary nodeKey="loaded" title="With summary" />
			</div>
			<div css={wrapperStyles}>
				<FakeContextPanelWithoutDescription nodeKey="loaded" title="Missing description" />
				<FakeContextPanelWithoutDescriptionOrDocumentation
					nodeKey="loaded"
					title="Missing description and docs"
				/>
			</div>
			<div css={wrapperStyles}>
				<FakeContextPanelWithoutDocumentation nodeKey="loaded" title="Missing docs" />
				<FakeContextPanelWithoutSummaryAndDocumentation
					nodeKey="loaded"
					title="Missing summary and docs"
				/>
			</div>
			<div css={wrapperStyles}>
				<FakeContextPanelWithoutSummaryAndDescriptionAndDocumentation
					nodeKey="loaded"
					title="Missing description, summary and docs"
				/>
				<FaceContextPanelWithDeprecation nodeKey="loaded" title="With deprecation status" />
			</div>
		</IntlProvider>
	);
}
