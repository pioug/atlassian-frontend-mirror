/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

import { bind } from 'bind-event-listener';

import { usePageLayoutResize } from '@atlaskit/page-layout/sidebar-resize-context';

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
