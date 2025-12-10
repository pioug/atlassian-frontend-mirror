import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Slider from '../../image-navigator/slider';
import { IntlProvider } from 'react-intl-next';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => (
	<IntlProvider locale="en">{children}</IntlProvider>
);

describe('Slider', () => {
	const setup = () => {
		const onChange = jest.fn();
		const { container } = render(<Slider value={0} onChange={onChange} />, {
			wrapper: AllTheProviders,
		});
		return {
			element: container,
			onChange,
		};
	};

	it('should pass FieldRange values back', async () => {
		const { element, onChange } = setup();

		const sliderRange = element.querySelector('input[type=range]');
		sliderRange && fireEvent.change(sliderRange, { target: { value: 25 } });
		expect(sliderRange).toBeInTheDocument();
		expect(onChange).toHaveBeenCalledWith(25);

		await expect(document.body).toBeAccessible();
	});

	it('should zoom to 0 when small icon clicked', async () => {
		const { element, onChange } = setup();
		const zoomOutBtn = element.querySelector('.zoom_button_small');
		zoomOutBtn && fireEvent.click(zoomOutBtn);
		expect(onChange).toHaveBeenCalledWith(0);
		expect(zoomOutBtn).toHaveAttribute('aria-label', 'Zoom out');

		await expect(document.body).toBeAccessible();
	});

	it('should zoom to 100 when large icon clicked', async () => {
		const { element, onChange } = setup();
		const zoomInBtn = element.querySelector('.zoom_button_large');
		zoomInBtn && fireEvent.click(zoomInBtn);
		expect(onChange).toHaveBeenCalledWith(100);
		expect(zoomInBtn).toHaveAttribute('aria-label', 'Zoom in');

		await expect(document.body).toBeAccessible();
	});
});
