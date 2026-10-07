import type React from 'react';

import { WithFlashCompiled } from './withFlash-compiled';

export interface Props {
	animate: boolean;
	children?: React.ReactNode;
}

const WithFlash: React.ComponentType<Props> = WithFlashCompiled;

export default WithFlash;
