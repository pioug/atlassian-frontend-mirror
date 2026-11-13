import React, { useRef } from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import { usePositionArea } from './index';

function Example({ isOpen, area }: { isOpen: boolean; area: string }) {
	const ref = useRef<HTMLDivElement | null>(null);
	const positionArea = usePositionArea(ref, isOpen);
	return (
		<>
			{isOpen && <div ref={ref} data-area={area} />}
			<output data-testid="area">{positionArea}</output>
		</>
	);
}

it('reads the mounted host when opened and reopened', () => {
	// jsdom does not implement position-area, so supply its computed value.
	const getComputedStyle = window.getComputedStyle;
	jest.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
		const style = getComputedStyle(element);
		jest.spyOn(style, 'getPropertyValue').mockReturnValue(element.getAttribute('data-area') ?? '');
		return style;
	});
	const { rerender } = render(<Example isOpen={false} area="block-end" />);
	rerender(<Example isOpen={true} area="block-end" />);
	expect(screen.getByTestId('area')).toHaveTextContent('block-end');
	rerender(<Example isOpen={false} area="inline-start" />);
	rerender(<Example isOpen={true} area="inline-start" />);
	expect(screen.getByTestId('area')).toHaveTextContent('inline-start');
});
