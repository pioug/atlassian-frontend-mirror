import React from 'react';

import { LozengeBlockWrapper as CompiledLozengeBlockWrapper } from './lozenge-block-wrapper-compiled';

export const LozengeBlockWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledLozengeBlockWrapper {...props} />;
