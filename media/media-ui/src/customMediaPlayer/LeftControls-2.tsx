import React from 'react';

import { LeftControls as CompiledLeftControls } from './LeftControls';

export const LeftControls = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
): React.JSX.Element => <CompiledLeftControls {...props} />;
