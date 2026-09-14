import React, { type ReactNode } from 'react';

import { TouchScrollable } from 'react-scrolllock';

import { CodeViewWrapper as CompiledCodeViewWrapper } from './codeViewerRenderer-compiled';

export const CodeViewWrapper = (props: {
	children: ReactNode;
	'data-testid': string | undefined;
}): React.JSX.Element => (
	<TouchScrollable>
		<CompiledCodeViewWrapper {...props} />
	</TouchScrollable>
);
