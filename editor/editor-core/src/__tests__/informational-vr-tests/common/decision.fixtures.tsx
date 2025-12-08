import React from 'react';

import { Editor } from '../../../index';
import adf from '../../__fixtures__/decision-adf.json';

// eslint-disable-next-line jsdoc/require-jsdoc
export function EditorWithDecision(): React.JSX.Element {
	return <Editor defaultValue={adf} allowTasksAndDecisions appearance="full-page" />;
}
