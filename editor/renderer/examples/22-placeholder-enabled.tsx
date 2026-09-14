import React from 'react';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/placeholder.adf.json';
import type { DocNode } from '@atlaskit/adf-schema/doc';

export default function Example(): React.JSX.Element {
	return <Renderer document={document as DocNode} appearance="full-page" allowPlaceholderText />;
}
