/**
 * @jsxRuntime classic
 * @jsx jsx
 */

/* eslint-disable @typescript-eslint/consistent-type-imports, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic */
import { jsx, css } from '@emotion/react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { RendererContext } from '../types';
import type { Serializer } from '../../serializer';
import type { Layout as ExtensionLayout } from '@atlaskit/adf-schema/extensions';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { token } from '@atlaskit/tokens';

const containerCSS = css({
	padding: `${token('space.100')}`,
	minHeight: '100px',
	// by default all frames are hidden, this style is overridden in multiBodiedExtensions for active frame
	display: 'none',
});

type Props = React.PropsWithChildren<{
	extensionHandlers?: ExtensionHandlers;
	extensionKey: string;
	extensionType: string;
	layout?: ExtensionLayout;
	localId?: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	originalContent?: any;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	parameters?: any;
	path?: PMNode[];
	providers: ProviderFactory;
	rendererContext: RendererContext;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	serializer: Serializer<any>;
}>;

const ExtensionFrame = (props: Props): jsx.JSX.Element => {
	return (
		<div css={[containerCSS]} data-extension-frame="true">
			{props.children}
		</div>
	);
};

export default ExtensionFrame;
