import type React from 'react';

import { WithFlash as WithFlashComponent } from './withFlash';

export interface Props {
	animate: boolean;
	children?: React.ReactNode;
}

const WithFlash: React.ComponentType<Props> = WithFlashComponent;

export default WithFlash;
