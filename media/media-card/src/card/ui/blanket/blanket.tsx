import React from 'react';
import { Blanket as CompiledBlanket } from './blanket-compiled';

export interface BlanketProps {
	isFixed?: boolean;
}

export const Blanket = (props: BlanketProps): React.JSX.Element => <CompiledBlanket {...props} />;
