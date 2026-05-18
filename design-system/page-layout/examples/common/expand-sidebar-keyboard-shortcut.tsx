/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

import { bind } from 'bind-event-listener';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { usePageLayoutResize } from '@atlaskit/page-layout';

export const ExpandLeftSidebarKeyboardShortcut = () => {
	const { toggleLeftSidebar } = usePageLayoutResize();

	useEffect(() => {
		const toggle = (event: KeyboardEvent) => {
			if (event.which === 219) {
				toggleLeftSidebar();
			}
		};

		return bind(document, {
			type: 'keydown',
			listener: toggle,
		});
	}, [toggleLeftSidebar]);

	return null;
};
