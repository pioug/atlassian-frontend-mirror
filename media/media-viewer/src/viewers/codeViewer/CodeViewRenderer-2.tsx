import React from 'react';

import { CodeViewRenderer as CompiledCodeViewRenderer } from './CodeViewRenderer';
import type { Props } from './codeViewerRenderer';

export const CodeViewRenderer = (props: Props): React.JSX.Element => (
	<CompiledCodeViewRenderer {...props} />
);
