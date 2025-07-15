import React from 'react';

import { render, screen } from '@testing-library/react';

import { Panel } from '../../panel';
import * as panelSplitterProvider from '../../panel-splitter/provider';

it('should set the default panel width to the default value if width is not provided', () => {
	render(<Panel testId="panel">panel</Panel>);

	expect(screen.getByTestId('panel')).toHaveStyle({
		'--n_pnlW': `clamp(365px, 365px, round(nearest, calc((100vw - var(--n_sNvlw, 0px)) / 2), 1px))`,
	});
});

it('should set the default panel width to the provided value', () => {
	render(
		<Panel testId="panel" defaultWidth={399}>
			panel
		</Panel>,
	);

	expect(screen.getByTestId('panel')).toHaveStyle({
		'--n_pnlW': `clamp(399px, 399px, round(nearest, calc((100vw - var(--n_sNvlw, 0px)) / 2), 1px))`,
	});
});

it('should set the panel min width to 400px if the default width is larger', () => {
	render(
		<Panel testId="panel" defaultWidth={450}>
			panel
		</Panel>,
	);

	expect(screen.getByTestId('panel')).toHaveStyle({
		'--n_pnlW': `clamp(400px, 450px, round(nearest, calc((100vw - var(--n_sNvlw, 0px)) / 2), 1px))`,
	});
});

describe('resize bounds', () => {
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
