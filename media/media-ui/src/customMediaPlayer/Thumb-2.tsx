import React from 'react';

import { Thumb as CompiledThumb } from './Thumb';

export const Thumb = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
): React.JSX.Element => <CompiledThumb {...props} />;
