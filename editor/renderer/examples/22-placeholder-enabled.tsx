import React from 'react';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/placeholder.adf.json';

export default function Example(): React.JSX.Element {
	return <Renderer document={document} appearance="full-page" allowPlaceholderText />;
}
