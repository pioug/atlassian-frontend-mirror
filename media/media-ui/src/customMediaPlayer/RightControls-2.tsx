import React from 'react';

import { RightControls as CompiledRightControls } from './RightControls';

export const RightControls = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
): React.JSX.Element => <CompiledRightControls {...props} />;
