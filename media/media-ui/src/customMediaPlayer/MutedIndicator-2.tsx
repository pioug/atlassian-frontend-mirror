import React from 'react';

import {
	MutedIndicator as CompiledMutedIndicator,
	type MutedIndicatorProps,
} from './MutedIndicator';

export const MutedIndicator = (
	props: MutedIndicatorProps &
		React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
): React.JSX.Element => <CompiledMutedIndicator {...props} />;
