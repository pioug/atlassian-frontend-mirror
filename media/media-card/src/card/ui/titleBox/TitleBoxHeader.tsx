import React from 'react';

import { TitleBoxHeader as CompiledTitleBoxHeader } from './titleBoxComponents-compiled';
import { type TitleBoxHeaderProps } from './types';

export const TitleBoxHeader = (props: TitleBoxHeaderProps): React.JSX.Element => (
	<CompiledTitleBoxHeader {...props} />
);
