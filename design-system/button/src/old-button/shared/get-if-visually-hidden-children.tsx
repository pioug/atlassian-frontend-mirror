import { isValidElement, type ReactNode } from 'react';

import VisuallyHidden from '@atlaskit/visually-hidden';

export const getIfVisuallyHiddenChildren = (children: ReactNode) => {
	return children && isValidElement(children) && children.type === VisuallyHidden;
};
