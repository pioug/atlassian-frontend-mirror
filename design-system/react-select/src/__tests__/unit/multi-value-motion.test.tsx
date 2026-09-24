import React from 'react';

import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import MultiValueMotion from '../../components/multi-value-motion';

const mockUseMotion = jest.fn((_props: unknown) => ({
	ref: jest.fn(),
	reanimate: jest.fn(),
	state: 'entering',
}));

jest.mock('@atlaskit/motion/entering/use-motion', () => ({
	useMotion: (props: unknown) => mockUseMotion(props),
}));

describe('MultiValueMotion', () => {
	beforeEach(() => {
		mockUseMotion.mockClear();
	});

	it('is accessible', async () => {
		const { container } = render(<MultiValueMotion>{() => <div />}</MultiValueMotion>);

		await expect(container).toBeAccessible();
	});

	it('skips truncation measurement by default', () => {
		render(<MultiValueMotion>{() => <div />}</MultiValueMotion>);

		expect(mockUseMotion).toHaveBeenCalledWith(expect.objectContaining({ onStart: undefined }));
	});

	it('measures truncation when the renderer forwards the ref', () => {
		render(<MultiValueMotion shouldMeasureTruncation>{() => <div />}</MultiValueMotion>);

		expect(mockUseMotion).toHaveBeenCalledWith(
			expect.objectContaining({ onStart: expect.any(Function) }),
		);
	});

	it.each(['entering', 'exiting'] as const)(
		'measures the settled width before %s and restores the animation',
		(phase) => {
			render(
				<MultiValueMotion shouldMeasureTruncation>
					{({ truncationRef, hasEllipsis }) => (
						<div ref={truncationRef} data-testid="label" data-ellipsis={hasEllipsis}>
							A label that fits
						</div>
					)}
				</MultiValueMotion>,
			);
			const label = screen.getByTestId('label');
			// eslint-disable-next-line testing-library/no-node-access -- Inspect the motion wrapper to model settled versus animated layout.
			const wrapper = label.parentElement!;
			wrapper.style.animation = 'label-motion 150ms';
			Object.defineProperties(label, {
				scrollWidth: { value: 100 },
				clientWidth: { get: () => (wrapper.style.animation === 'none' ? 100 : 80) },
			});
			const { onStart } = mockUseMotion.mock.calls.at(-1)![0] as {
				onStart: (phase: 'entering' | 'exiting') => void;
			};
			act(() => onStart(phase));
			expect(label).toHaveAttribute('data-ellipsis', 'false');
			expect(wrapper).toHaveStyle({ animation: 'label-motion 150ms' });
		},
	);

	it.each(['entering', 'exiting'] as const)(
		'keeps ellipsis during %s when the settled label truncates',
		(phase) => {
			render(
				<MultiValueMotion shouldMeasureTruncation>
					{({ truncationRef, hasEllipsis }) => (
						<div ref={truncationRef} data-testid="label" data-ellipsis={hasEllipsis} />
					)}
				</MultiValueMotion>,
			);
			const label = screen.getByTestId('label');
			// eslint-disable-next-line testing-library/no-node-access -- Verify measurement restores the wrapper's original inline animation.
			const wrapper = label.parentElement!;
			Object.defineProperties(label, {
				scrollWidth: { value: 200 },
				clientWidth: { value: 100 },
			});
			const { onStart } = mockUseMotion.mock.calls.at(-1)![0] as {
				onStart: (phase: 'entering' | 'exiting') => void;
			};
			act(() => onStart(phase));
			expect(label).toHaveAttribute('data-ellipsis', 'true');
			expect(wrapper).not.toHaveStyle({ animation: 'none' });
		},
	);
});
