import React from 'react';

import { CurrentTime as CompiledCurrentTime } from './CurrentTime';

export const CurrentTime = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
): React.JSX.Element => <CompiledCurrentTime {...props} />;
