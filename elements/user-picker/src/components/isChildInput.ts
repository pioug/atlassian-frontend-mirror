import { type ReactChild, type ReactElement } from 'react';

export const isChildInput = (child: ReactChild): child is ReactElement<any> =>
	child && typeof child === 'object' && child.props && child.props.type === 'text';
