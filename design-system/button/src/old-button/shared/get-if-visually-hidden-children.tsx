import { isValidElement, type ReactNode } from 'react';

import VisuallyHidden from '@atlaskit/visually-hidden';

export const getIfVisuallyHiddenChildren: (
	children: ReactNode,
) => boolean | '' | 0 | null | undefined = (children: ReactNode) => {
	return children && isValidElement(children) && children.type === VisuallyHidden;
};
