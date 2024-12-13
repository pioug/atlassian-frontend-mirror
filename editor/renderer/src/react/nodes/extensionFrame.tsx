/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { RendererContext } from '../types';
import type { Serializer } from '../../serializer';
import type { ExtensionLayout } from '@atlaskit/adf-schema';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

const containerCSS = css({
	minHeight: '100px',
});

type Props = React.PropsWithChildren<{
	serializer: Serializer<any>;
	extensionHandlers?: ExtensionHandlers;
	rendererContext: RendererContext;
	providers: ProviderFactory;
	extensionType: string;
	extensionKey: string;
	path?: PMNode[];
	originalContent?: any;
	parameters?: any;
	content?: any;
	layout?: ExtensionLayout;
	localId?: string;
}>;

const ExtensionFrame = (props: Props) => {
	return (
		<div css={containerCSS} data-extension-frame="true" style={{ flexBasis: `100%` }}>
			{props.children}
		</div>
	);
};

export default ExtensionFrame;
