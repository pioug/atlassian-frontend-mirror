import React from 'react';

import type { Props } from './codeViewerRenderer';
import { CodeViewRenderer as CompiledCodeViewRenderer } from './CodeViewRenderer';

export const CodeViewRenderer = (props: Props): React.JSX.Element => (
	<CompiledCodeViewRenderer {...props} />
);
