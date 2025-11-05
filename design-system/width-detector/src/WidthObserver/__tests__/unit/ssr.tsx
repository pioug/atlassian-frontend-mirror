import React from 'react';

import ReactDOM from 'react-dom/client';

import { WidthDetectorObserver } from '../../width-detector-observer';

describe('SSR', () => {
	describe('#width-detector-observer', () => {
		it('should not call setWidth', () => {
			const setWidth = jest.fn();
			const div = document.createElement('div');

			ReactDOM.hydrateRoot(
				div,
				<>
					<WidthDetectorObserver setWidth={setWidth} />
					<span>1</span>
				</>,
			);

			expect(setWidth).not.toHaveBeenCalled();
		});
	});
});
