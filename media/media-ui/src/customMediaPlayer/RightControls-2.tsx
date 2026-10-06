import React from 'react';

import { RightControls as CompiledRightControls, type RightControlsProps } from './RightControls';

export const RightControls = (props: RightControlsProps): React.JSX.Element => (
	<CompiledRightControls {...props} />
);
