import React from 'react';

import { TitleBoxFooter as CompiledTitleBoxFooter } from './titleBoxComponents-compiled';
import { type TitleBoxFooterProps } from './types';

export const TitleBoxFooter = (props: TitleBoxFooterProps): React.JSX.Element => (
	<CompiledTitleBoxFooter {...props} />
);
