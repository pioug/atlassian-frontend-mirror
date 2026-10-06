import React from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { within } from '@atlassian/testing-library/within';

import { ExternalControlsLayout } from '../ExternalControlsLayout';

describe('ExternalControlsLayout', () => {
	let controlsPortalElement: HTMLDivElement;

	beforeEach(() => {
		controlsPortalElement = document.createElement('div');
		document.body.appendChild(controlsPortalElement);
	});

	afterEach(() => {
		controlsPortalElement.remove();
	});

	const renderLayout = (props: Partial<React.ComponentProps<typeof ExternalControlsLayout>> = {}) =>
		render(
			<ExternalControlsLayout
				timeline={<span data-testid="timeline" />}
				left={<span data-testid="left" />}
				right={<span data-testid="right" />}
				{...props}
			/>,
		);

	it('should portal the timeline, left and right controls into the controls element', () => {
		renderLayout({ controlsPortalElement });

		expect(within(controlsPortalElement).getByTestId('timeline')).toBeInTheDocument();
		expect(within(controlsPortalElement).getByTestId('left')).toBeInTheDocument();
		expect(within(controlsPortalElement).getByTestId('right')).toBeInTheDocument();
	});

	it('should render nothing until the controls element is available', () => {
		renderLayout({ controlsPortalElement: null });

		expect(screen.queryByTestId('timeline')).not.toBeInTheDocument();
		expect(screen.queryByTestId('left')).not.toBeInTheDocument();
		expect(screen.queryByTestId('right')).not.toBeInTheDocument();
	});

	it('should attach the controls wrapper ref to the portaled layout', () => {
		const videoControlsWrapperRef = React.createRef<HTMLDivElement>();

		renderLayout({ controlsPortalElement, videoControlsWrapperRef });

		expect(controlsPortalElement).toContainElement(videoControlsWrapperRef.current);
	});
});
