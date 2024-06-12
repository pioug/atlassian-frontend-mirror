import React from 'react';
import ReactDOM from 'react-dom';
import { WidthDetectorObserver } from '../../width-detector-observer';

describe('SSR', () => {
	describe('#width-detector-observer', () => {
		it('should not call setWidth', () => {
			const setWidth = jest.fn();
			const div = document.createElement('div');

			ReactDOM.hydrate(
				<>
					<WidthDetectorObserver setWidth={setWidth} />
					<span>1</span>
				</>,
				div,
			);
			expect(setWidth).not.toHaveBeenCalled();
		});
	});
});
