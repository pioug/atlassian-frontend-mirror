/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useLayoutEffect, useRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

import HomeIcon from '@atlaskit/icon/core/home';
import { MenuList } from '@atlaskit/navigation-system';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';

const styles = cssMap({
	root: {
		width: '300px',
	},
});

const homeIcon = <HomeIcon label="" color="currentColor" spacing="spacious" />;

export function LinkMenuItemBleed() {
	const ref = useRef<HTMLAnchorElement | null>(null);

	// Focus on initial render for snapshots
	useLayoutEffect(() => {
		ref.current?.focus();
	}, []);

	return (
		<div css={styles.root}>
			<SideNavContent>
				<MenuList>
					<LinkMenuItem href="#" elemBefore={homeIcon} isSelected>
						1.1 (selected)
					</LinkMenuItem>
					<LinkMenuItem href="#" elemBefore={homeIcon} ref={ref}>
						1.2 (focused)
					</LinkMenuItem>
					<LinkMenuItem href="#" elemBefore="🤩" isSelected>
						1.3 (selected)
					</LinkMenuItem>
				</MenuList>
			</SideNavContent>
		</div>
	);
}

export default LinkMenuItemBleed;
