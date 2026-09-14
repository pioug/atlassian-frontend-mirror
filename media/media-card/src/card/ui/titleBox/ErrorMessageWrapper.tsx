import React from 'react';

import { ErrorMessageWrapper as CompiledErrorMessageWrapper } from './titleBoxComponents-compiled';

export const ErrorMessageWrapper = (props: any): React.JSX.Element => (
	<CompiledErrorMessageWrapper {...props} />
);
