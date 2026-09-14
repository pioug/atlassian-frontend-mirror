import React from 'react';

import { Icon as CompiledIcon } from './Icon-2';

export const Icon = (
	props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
): React.JSX.Element => <CompiledIcon {...props} />;
