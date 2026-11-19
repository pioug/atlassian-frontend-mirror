import React from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { ControlsLayout } from '../ControlsLayout';

// Wrap the real primitives so the structure can be asserted without asserting any styles.
const mockBox = jest.fn();
const mockFlex = jest.fn();
jest.mock('@atlaskit/primitives/compiled/box', () => {
	const { createElement, forwardRef } = jest.requireActual('react');
	const original = jest.requireActual('@atlaskit/primitives/compiled/box');
	return {
		...original,
		Box: forwardRef((props: object, ref: unknown) => {
			mockBox(props);
			return createElement(original.Box, { ...props, ref });
		}),
	};
});
jest.mock('@atlaskit/primitives/compiled/flex', () => {
	const { createElement, forwardRef } = jest.requireActual('react');
	const original = jest.requireActual('@atlaskit/primitives/compiled/flex');
	return {
		...original,
		Flex: forwardRef((props: object, ref: unknown) => {
			mockFlex(props);
			return createElement(original.Flex, { ...props, ref });
		}),
	};
});

describe('ControlsLayout', () => {
	beforeEach(() => {
		mockBox.mockClear();
		mockFlex.mockClear();
	});

	it('should lay out the timeline above a row with the left and right controls, inside the controls wrapper ref', async () => {
		const videoControlsWrapperRef = React.createRef<HTMLDivElement>();
		const timeline = <span data-testid="timeline" />;
		const left = <span data-testid="left" />;
		const right = <span data-testid="right" />;

		render(
			<ControlsLayout
				videoControlsWrapperRef={videoControlsWrapperRef}
				timeline={timeline}
				left={left}
				right={right}
			/>,
		);

		// A Box around the whole layout, then a Box holding only the timeline
		expect(mockBox).toHaveBeenCalledTimes(2);
		expect(mockBox.mock.calls[1][0].children).toBe(timeline);
		// One Flex holding the left and right controls, in that order, at either end of the row
		expect(mockFlex).toHaveBeenCalledTimes(1);
		expect(mockFlex.mock.calls[0][0]).toEqual(
			expect.objectContaining({
				alignItems: 'center',
				justifyContent: 'space-between',
				children: [left, right],
			}),
		);
		expect(videoControlsWrapperRef.current).toContainElement(screen.getByTestId('timeline'));
		expect(videoControlsWrapperRef.current).toContainElement(screen.getByTestId('left'));
		expect(videoControlsWrapperRef.current).toContainElement(screen.getByTestId('right'));
		await expect(document.body).toBeAccessible();
	});
});
