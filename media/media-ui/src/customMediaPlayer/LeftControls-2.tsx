import React from 'react';

import { LeftControls as CompiledLeftControls, type LeftControlsProps } from './LeftControls';

export const LeftControls = (props: LeftControlsProps): React.JSX.Element => (
	<CompiledLeftControls {...props} />
);
