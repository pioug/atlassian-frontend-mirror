import React from 'react';

import { render, screen } from '@testing-library/react';

import { UNSAFE_LAYERING, UNSAFE_useLayering } from '../../../index';

describe('Layering', () => {
	const Wrapper = () => {
		const { currentLevel, topLevelRef } = UNSAFE_useLayering();
		return (
			<div>
				The current level is {currentLevel}, top level is {topLevelRef.current ?? 'null'}
			</div>
		);
	};
	it('should have default context value if Layering is not provided', () => {
		render(<Wrapper />);
		expect(screen.getByText(/^The current level is/)).toHaveTextContent(
			'The current level is 0, top level is null',
		);
	});

	it('should have correct context value if 2 layers are provided', () => {
		render(
			<UNSAFE_LAYERING isDisabled={false}>
				<UNSAFE_LAYERING isDisabled={false}>
					<Wrapper />
				</UNSAFE_LAYERING>
			</UNSAFE_LAYERING>,
		);
		expect(screen.getByText(/^The current level is/)).toHaveTextContent(
			'The current level is 2, top level is 2',
		);
	});

	it('should have correct context value if 4 layers are provided', () => {
		render(
			<UNSAFE_LAYERING isDisabled={false}>
				<UNSAFE_LAYERING isDisabled={false}>
					<UNSAFE_LAYERING isDisabled={false}>
						<UNSAFE_LAYERING isDisabled={false}>
							<Wrapper />
						</UNSAFE_LAYERING>
					</UNSAFE_LAYERING>
				</UNSAFE_LAYERING>
			</UNSAFE_LAYERING>,
		);
		expect(screen.getByText(/^The current level is/)).toHaveTextContent(
			'The current level is 4, top level is 4',
		);
	});

	it('should have default context value if isDisabled is true by default', () => {
		render(
			<UNSAFE_LAYERING>
				<Wrapper />
			</UNSAFE_LAYERING>,
		);
		expect(screen.getByText(/^The current level is/)).toHaveTextContent(
			'The current level is 0, top level is null',
		);
	});
});
