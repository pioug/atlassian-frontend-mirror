import { useEffect } from 'react';

import { bind } from 'bind-event-listener';

import { useToggleSideNav } from '@atlaskit/navigation-system/layout/side-nav';

// This could be a hook too
export function ToggleSideNavKeyboardShortcutExample(): void {
	const toggleSideNav = useToggleSideNav();

	useEffect(() => {
		const toggle = (event: KeyboardEvent) => {
			if (event.key === '[') {
				toggleSideNav();
			}
		};

		return bind(document, {
			type: 'keydown',
			listener: toggle,
		});
	}, [toggleSideNav]);
}

export default ToggleSideNavKeyboardShortcutExample;
