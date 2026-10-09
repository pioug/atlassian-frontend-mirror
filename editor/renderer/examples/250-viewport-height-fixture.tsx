import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import Renderer from '../src/ui/Renderer';
import type { RendererProps } from '../src/ui/renderer-props';

const namedSizes = ['small', 'medium', 'large', 'xlarge'];
const extensionId = (size: string) =>
	`ari:cloud:ecosystem::extension/scale-9486/fixture/static/${size}`;
const paragraph = (text: string) => ({
	type: 'paragraph' as const,
	content: [{ type: 'text' as const, text }],
});
const document: RendererProps['document'] = {
	type: 'doc',
	version: 1,
	content: [...namedSizes, 'unknown', 'omitted', 'connect', 'no-record'].flatMap((size) => [
		paragraph(`${size} viewport`),
		{
			type: 'extension' as const,
			attrs: {
				extensionType: 'com.atlassian.ecosystem',
				extensionKey: size,
				parameters: { extensionId: extensionId(size) },
				localId: size,
			},
		},
	]),
};
const extensionViewportSizes = [
	...namedSizes.map((viewportSize) => ({ extensionId: extensionId(viewportSize), viewportSize })),
	{ extensionId: extensionId('unknown'), viewportSize: 'unsupported' },
	{ extensionId: extensionId('omitted') },
];

/** Browser fixture for named heights and Connect/metadata fallback controls. */
export default function ViewportHeightFixture(): React.JSX.Element {
	const fix = fg('confluence_forge_early_render_reserve_height');
	return (
		<main>
			<h1>SCALE-9486 full ADF renderer fixture</h1>
			<p>Correction gate: {fix ? 'enabled' : 'disabled'}.</p>
			<Renderer
				document={document}
				extensionViewportSizes={extensionViewportSizes}
				getExtensionHeight={(node) => (node.attrs.extensionKey === 'connect' ? '150' : undefined)}
				extensionHandlers={{
					'com.atlassian.ecosystem': (node) => <p>{node.extensionKey} short macro content</p>,
				}}
			/>
		</main>
	);
}
