import React from 'react';

import { TitleBoxWrapper as CompiledTitleBoxWrapper } from './titleBoxComponents-compiled';
import { type TitleBoxWrapperProps } from './types';

export const TitleBoxWrapper = (props: TitleBoxWrapperProps): React.JSX.Element => (
	<CompiledTitleBoxWrapper {...props} />
);
