import React from 'react';

import { render } from '@atlassian/testing-library/render';

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
});
