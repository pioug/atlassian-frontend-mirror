import React from 'react';

import { render, screen } from '@testing-library/react';

import { skipA11yAudit } from '@af/accessibility-testing';

import { Content, LeftSidebar, Main, PageLayout, RightSidebar } from '../../../index';

describe('<Main />', () => {
	it('should take up all space between the sidebars', () => {
		render(
			<PageLayout testId="grid">
				<Content>
					<LeftSidebar testId="left" width={200}>
						Contents
					</LeftSidebar>
					<Main testId="main">Main content</Main>
					<RightSidebar testId="right" width={200}>
						Contents
					</RightSidebar>
				</Content>
			</PageLayout>,
		);

		expect(screen.getByTestId('main')).toHaveStyleDeclaration('flex-grow', '1');
		expect(screen.getByTestId('left')).toHaveStyleDeclaration(
			'width',
			'var(--leftSidebarWidth, 0px)',
		);
		expect(screen.getByTestId('right')).toHaveStyleDeclaration(
			'width',
			'var(--rightSidebarWidth, 0px)',
		);

		// a11y audits fail due to old axe rules that need to be updated
		// See https://product-fabric.atlassian.net/browse/DSP-17790 for info
		skipA11yAudit();
	});
});
