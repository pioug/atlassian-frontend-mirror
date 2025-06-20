/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { css } from '@atlaskit/css';
import { Aside } from '@atlaskit/navigation-system/layout/aside';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNav, SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';

const noShrinkStyles = css({
	whiteSpace: 'nowrap',
});

export default function ImplicitRows() {
	return (
		<Root>
			<div data-hi>I should not be here</div>
			<TopNav>
				<span css={noShrinkStyles}>top nav</span>
			</TopNav>
			<SideNav defaultCollapsed>
				<SideNavContent>Hello world</SideNavContent>
			</SideNav>
			<div data-yo>I should not be here</div>
			<Main>main content</Main>
			<Aside>aside</Aside>
		</Root>
	);
}
