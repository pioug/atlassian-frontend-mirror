import React from 'react';

import { VolumeWrapper as CompiledVolumeWrapper, type VolumeWrapperProps } from './VolumeWrapper';

export const VolumeWrapper = (
	props: VolumeWrapperProps &
		React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
): React.JSX.Element => <CompiledVolumeWrapper {...props} />;
