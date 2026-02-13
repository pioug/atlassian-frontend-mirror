import React from 'react';
import type { DocNode } from '@atlaskit/adf-schema/schema';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/column-layout.adf.json';

export default function Example(): React.JSX.Element {
	return <Renderer document={document as DocNode} appearance="full-page" />;
}
