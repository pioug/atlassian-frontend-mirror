import React from 'react';

import { render, screen } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { Panel } from '../../panel';
import * as panelSplitterProvider from '../../panel-splitter/provider';

it('should set the default panel width to the default value if width is not provided', () => {
	render(<Panel testId="panel">panel</Panel>);

	expect(screen.getByTestId('panel')).toHaveStyle({ '--n_pnlW': `clamp(0px, 365px, 50vw)` });
});

it('should set the default panel width to the provided value', () => {
	render(
		<Panel testId="panel" defaultWidth={399}>
			panel
		</Panel>,
	);

	expect(screen.getByTestId('panel')).toHaveStyle({ '--n_pnlW': `clamp(0px, 399px, 50vw)` });
});

ffTest.off('platform_design_system_nav4_preview_panel_support', 'resize bounds', () => {
	const PanelSplitterProvider = jest.spyOn(panelSplitterProvider, 'PanelSplitterProvider');

	beforeEach(() => {
		PanelSplitterProvider.mockClear();
	});

	it('should have a 120px minimum resize width', () => {
		render(<Panel>panel</Panel>);

		expect(PanelSplitterProvider).toHaveBeenCalledTimes(1);

		const [{ getResizeBounds }] = PanelSplitterProvider.mock.calls[0];

		expect(getResizeBounds()).toHaveProperty('min', '120px');
	});

	it('should have a 50vw maximum resize width', () => {
		render(<Panel>panel</Panel>);

		expect(PanelSplitterProvider).toHaveBeenCalledTimes(1);

		const [{ getResizeBounds }] = PanelSplitterProvider.mock.calls[0];

		expect(getResizeBounds()).toHaveProperty('max', '50vw');
	});
});

ffTest.on('platform_design_system_nav4_preview_panel_support', 'resize bounds', () => {
	const PanelSplitterProvider = jest.spyOn(panelSplitterProvider, 'PanelSplitterProvider');

	beforeEach(() => {
		PanelSplitterProvider.mockClear();
	});

	test.each([
		{ defaultWidth: 399, expectedResizeMinWidth: '399px' },
		{ defaultWidth: 400, expectedResizeMinWidth: '400px' },
		{ defaultWidth: 401, expectedResizeMinWidth: '400px' },
	])(
		'should use `defaultWidth` as minimum resize width, up to `400px` (`defaultWidth={$defaultWidth}`)',
		({ defaultWidth, expectedResizeMinWidth }) => {
			render(<Panel defaultWidth={defaultWidth}>panel</Panel>);

			expect(PanelSplitterProvider).toHaveBeenCalledTimes(1);

			const [{ getResizeBounds }] = PanelSplitterProvider.mock.calls[0];

			expect(getResizeBounds()).toHaveProperty('min', expectedResizeMinWidth);
		},
	);
});
