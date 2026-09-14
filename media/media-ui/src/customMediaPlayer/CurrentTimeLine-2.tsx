import React from 'react';

import { CurrentTimeLine as CompiledCurrentTimeLine } from './CurrentTimeLine';

export const CurrentTimeLine = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
): React.JSX.Element => <CompiledCurrentTimeLine {...props} />;
