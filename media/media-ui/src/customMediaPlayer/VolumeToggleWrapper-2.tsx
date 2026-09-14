import React from 'react';

import type { MutedIndicatorProps } from './MutedIndicator';
import { VolumeToggleWrapper as CompiledVolumeToggleWrapper } from './VolumeToggleWrapper';

export const VolumeToggleWrapper = (
	props: MutedIndicatorProps &
		React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
): React.JSX.Element => <CompiledVolumeToggleWrapper {...props} />;
