import React from 'react';

import { LozengeWrapper as CompiledLozengeWrapper } from './lozenge-wrapper-compiled';

export const LozengeWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledLozengeWrapper {...props} />;
