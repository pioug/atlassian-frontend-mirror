jest.mock('../ControlsLayout', () => {
	const original = jest.requireActual('../ControlsLayout');
	return {
		...original,
		ControlsLayout: jest.fn(original.ControlsLayout),
	};
});

import React from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { ControlsLayout } from '../ControlsLayout';
import { InsetFullscreenControlsLayout } from '../InsetFullscreenControlsLayout';

describe('InsetFullscreenControlsLayout', () => {
	it('should render the timeline, left and right controls through ControlsLayout with the controls wrapper ref', async () => {
		const videoControlsWrapperRef = React.createRef<HTMLDivElement>();
		const timeline = <span data-testid="timeline" />;
		const left = <span data-testid="left" />;
		const right = <span data-testid="right" />;

		render(
			<InsetFullscreenControlsLayout
				videoControlsWrapperRef={videoControlsWrapperRef}
				timeline={timeline}
				left={left}
				right={right}
			/>,
		);

		expect(ControlsLayout).toHaveBeenCalledTimes(1);
		expect(jest.mocked(ControlsLayout).mock.lastCall![0]).toEqual({
			videoControlsWrapperRef,
			timeline,
			left,
			right,
		});
		expect(videoControlsWrapperRef.current).toContainElement(screen.getByTestId('timeline'));
		expect(videoControlsWrapperRef.current).toContainElement(screen.getByTestId('left'));
		expect(videoControlsWrapperRef.current).toContainElement(screen.getByTestId('right'));
		await expect(document.body).toBeAccessible();
	});
});
