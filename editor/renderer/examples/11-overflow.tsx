import React from 'react';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/overflow.adf.json';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';

export default function Example(): React.JSX.Element {
	return (
		<Renderer extensionHandlers={extensionHandlers} document={document} appearance="full-page" />
	);
}
