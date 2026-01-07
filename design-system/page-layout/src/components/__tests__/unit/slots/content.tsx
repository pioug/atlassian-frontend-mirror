import React from 'react';

import { render, screen } from '@testing-library/react';

import { Content, LeftPanel, Main, PageLayout, RightPanel } from '../../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<Content />', () => {
	it('should take up all space between the panels', () => {
		render(
			<PageLayout testId="grid">
				<Content testId="content">
					<LeftPanel width={200}>left panel</LeftPanel>
					<Main testId="main">Main</Main>
					<RightPanel width={200}>Right panel</RightPanel>
				</Content>
			</PageLayout>,
		);

		expect(document.head.innerHTML).toEqual(
			expect.stringContaining(
				'grid-template-columns:var(--leftPanelWidth, 0px) minmax(0, 1fr) var(--rightPanelWidth, 0px);',
			),
		);
		// eslint-disable-next-line testing-library/no-node-access
		expect(screen.getByTestId('content').querySelector('style')!.innerHTML).toEqual(
			expect.stringContaining(':root{--leftPanelWidth:200px;}'),
		);
	});
});
