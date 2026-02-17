import React from 'react';
import { TimeRange, TimeRangeBase, type TimeRangeProps } from '../../customMediaPlayer/timeRange';
import type { IntlShape } from 'react-intl-next';
import { fireEvent, screen, waitFor, act } from '@testing-library/react';
import { renderWithIntl } from '../../test-helpers';

let mockedWidth = 100;
Element.prototype.getBoundingClientRect = jest.fn(() => {
	return {
		width: mockedWidth,
	} as DOMRect;
});

describe('<TimeRange />', () => {
	const setupRTL = (props?: Partial<TimeRangeProps>) => {
		const onChange = jest.fn();
		const onChanged = jest.fn();
		const { container } = renderWithIntl(
			<TimeRange
				currentTime={10}
				duration={20}
				bufferedTime={5}
				onChange={onChange}
				onChanged={onChanged}
				disableThumbTooltip={false}
				isAlwaysActive={false}
				{...props}
			/>,
		);

		return {
			onChange,
			onChanged,
			container,
		};
	};

	it('should render the current time', async () => {
		setupRTL();

		expect(await screen.findByTestId('current-timeline')).toHaveStyle({ width: '50%' });
	});

	it('should render the buffered time', async () => {
		setupRTL();

		expect(await screen.findByTestId('buffered-time')).toHaveStyle({ width: '25%' });
	});

	it('should render the thumb element', async () => {
		setupRTL();

		expect(await screen.findByLabelText('Seek slider')).toBeInTheDocument();
	});

	it('should render the current time with the right format', async () => {
		const { container } = setupRTL();

		await waitFor(() =>
			expect(container.querySelector('.current-time-tooltip')).toHaveTextContent('0:10'),
		);
	});

	it('should notify changes when user clicks on the timeline', async () => {
		const onChange = jest.fn();
		const onChanged = jest.fn();

		renderWithIntl(
			<TimeRangeBase
				currentTime={10}
				duration={20}
				bufferedTime={5}
				onChange={onChange}
				disableThumbTooltip={false}
				isAlwaysActive={false}
				onChanged={onChanged}
				intl={{ locale: 'en', formatMessage: ({ defaultMessage }) => defaultMessage } as IntlShape}
			/>,
		);

		const timeline = await screen.findByTestId('time-range-wrapper');

		const customEvent = new Event('pointerdown', { bubbles: true });
		Object.defineProperty(customEvent, 'offsetX', { value: 5 });
		act(() => {
			timeline.dispatchEvent(customEvent);
		});

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenLastCalledWith(1);

		fireEvent.pointerMove(timeline);

		fireEvent.pointerUp(timeline);

		expect(onChanged).toHaveBeenCalledTimes(1);
	});

	it('should not display tooltip on top of thumb when flag disableThumbTooltip is set', () => {
		const { container } = setupRTL({
			disableThumbTooltip: true,
		});

		expect(container.querySelector('.current-time-tooltip')).toBeNull();
	});
});
