import React from 'react';

import { BufferedTime as CompiledBufferedTime } from './BufferedTime';

export const BufferedTime = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
): React.JSX.Element => <CompiledBufferedTime {...props} />;
