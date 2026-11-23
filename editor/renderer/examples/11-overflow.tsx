import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';

import { Renderer } from '../src/entry-points/renderer-default';
import document from './helper/overflow.adf.json';

export default function Example(): React.JSX.Element {
	return (
		<Renderer
			extensionHandlers={extensionHandlers}
			document={document as DocNode}
			appearance="full-page"
		/>
	);
}
