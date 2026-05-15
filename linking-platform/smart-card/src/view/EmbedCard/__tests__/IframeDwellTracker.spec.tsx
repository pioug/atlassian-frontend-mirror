import React from 'react';

import { type JestFunction } from '@atlaskit/media-test-helpers';
import { act, render } from '@atlassian/testing-library';

import { IframeDwellTracker, type IframeDwellTrackerProps } from '../components/IframeDwellTracker';

type RenderResult = ReturnType<typeof render>;

describe('Iframe Dwell Tracker', () => {
	let iframeTracker: RenderResult;
	const onIframeDwellMock: JestFunction<Required<IframeDwellTrackerProps>['onIframeDwell']> =
		jest.fn();
	let props: IframeDwellTrackerProps = {
		isIframeLoaded: false,
		isMouseOver: false,
		isWindowFocused: true,
		onIframeDwell: onIframeDwellMock,
		iframePercentVisible: 0.76,
	};

	beforeEach(() => {
		jest.useFakeTimers();

		props = {
			isIframeLoaded: false,
			isMouseOver: false,
			isWindowFocused: true,
			onIframeDwell: onIframeDwellMock,
			iframePercentVisible: 0.76,
		};

		iframeTracker = render(<IframeDwellTracker {...props} />);
	});

	afterEach(() => {
		if (iframeTracker) {
			iframeTracker.unmount();
		}
		jest.clearAllMocks();
		jest.useRealTimers();
	});

	it('should call back after every 5 seconds of dwelling, with total dwell time', async () => {
		mouseEnter();
		iframeLoaded();

		incrementSeconds(5);
		expect(onIframeDwellMock).toHaveBeenLastCalledWith(5, 75);

		incrementSeconds(5);
		expect(onIframeDwellMock).toHaveBeenLastCalledWith(10, 75);

		incrementSeconds(5);
		expect(onIframeDwellMock).toHaveBeenLastCalledWith(15, 75);

		expect(onIframeDwellMock).toHaveBeenCalledTimes(3);

		await expect(document.body).toBeAccessible();
	});

	it('should stop timer on mouse out', async () => {
		mouseEnter();
		iframeLoaded();

		incrementSeconds(2);
		mouseLeave();
		incrementSeconds(3);
		expect(onIframeDwellMock).toHaveBeenCalledTimes(0);

		mouseEnter();
		incrementSeconds(2);
		expect(onIframeDwellMock).toHaveBeenCalledTimes(0);

		incrementSeconds(1);
		expect(onIframeDwellMock).toHaveBeenLastCalledWith(5, 75);

		expect(onIframeDwellMock).toHaveBeenCalledTimes(1);

		await expect(document.body).toBeAccessible();
	});

	it('should not start timer until iframe is loaded', async () => {
		mouseEnter();

		incrementSeconds(5);
		expect(onIframeDwellMock).toHaveBeenCalledTimes(0);

		incrementSeconds(1);
		iframeLoaded();
		incrementSeconds(4);
		expect(onIframeDwellMock).toHaveBeenCalledTimes(0);

		incrementSeconds(1);
		expect(onIframeDwellMock).toHaveBeenLastCalledWith(5, 75);

		expect(onIframeDwellMock).toHaveBeenCalledTimes(1);

		await expect(document.body).toBeAccessible();
	});

	it('should stop timer when visibility drops, and report last percentage', async () => {
		mouseEnter();
		iframeLoaded();

		incrementSeconds(1);
		changeIframeVisibility(0.71);
		incrementSeconds(1);

		changeIframeVisibility(0.86);
		incrementSeconds(1);

		changeIframeVisibility(0.91);
		incrementSeconds(1);

		changeIframeVisibility(0.96);
		incrementSeconds(1);
		expect(onIframeDwellMock).toHaveBeenCalledTimes(0);

		incrementSeconds(1);
		expect(onIframeDwellMock).toHaveBeenLastCalledWith(5, 95);

		expect(onIframeDwellMock).toHaveBeenCalledTimes(1);

		await expect(document.body).toBeAccessible();
	});

	it('should continue timer on window blur (window focus no longer affects dwell tracking)', async () => {
		mouseEnter();
		iframeLoaded();

		incrementSeconds(2);
		windowBlur();
		// Timer continues even when window is not focused — mouse over is sufficient
		incrementSeconds(3);
		expect(onIframeDwellMock).toHaveBeenLastCalledWith(5, 75);
		expect(onIframeDwellMock).toHaveBeenCalledTimes(1);

		await expect(document.body).toBeAccessible();
	});

	const incrementSeconds = (seconds: number) => {
		act(() => {
			jest.advanceTimersByTime(seconds * 1000);
		});
	};

	const mouseEnter = () => {
		props.isMouseOver = true;
		rerender();
	};

	const mouseLeave = () => {
		props.isMouseOver = false;
		rerender();
	};

	const windowBlur = () => {
		props.isWindowFocused = false;
		rerender();
	};

	const iframeLoaded = () => {
		props.isIframeLoaded = true;
		rerender();
	};

	const changeIframeVisibility = (visibility: number) => {
		props.iframePercentVisible = visibility;
		rerender();
	};

	const rerender = () => {
		iframeTracker.rerender(<IframeDwellTracker {...props} />);
	};
});
