import React from 'react';

import { VolumeTimeRangeWrapper as CompiledVolumeTimeRangeWrapper } from './VolumeTimeRangeWrapper';

export const VolumeTimeRangeWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
): React.JSX.Element => <CompiledVolumeTimeRangeWrapper {...props} />;
