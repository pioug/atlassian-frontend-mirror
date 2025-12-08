import React from 'react';

import { Editor } from '../../../index';
import adf from '../../__fixtures__/layout-empty.adf.json';

// eslint-disable-next-line jsdoc/require-jsdoc
export function EditorWithBeakout(): React.JSX.Element {
	return <Editor defaultValue={adf} allowLayouts allowBreakout appearance="full-page" />;
}
