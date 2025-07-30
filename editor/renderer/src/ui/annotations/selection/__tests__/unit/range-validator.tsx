import './range-validator.mock';

import { act } from '@testing-library/react';
import React from 'react';
import { render } from 'react-dom';
import type RendererActions from '../../../../../actions/index';
import { RendererContext } from '../../../../RendererActionsContext';
// @ts-ignore
// eslint-disable-next-line import/default
import MounterMock from '../../mounter';
import { SelectionRangeValidator } from '../../range-validator';

describe('Annotations: SelectionRangeValidator', () => {
	let container: HTMLElement | null;
	let createRangeMock: jest.SpyInstance;
	let root: any; // Change to Root once we go full React 18

	beforeEach(async () => {
		container = document.createElement('div');
		document.body.appendChild(container);
		if (process.env.IS_REACT_18 === 'true') {
			// @ts-ignore react-dom/client only available in react 18
			// eslint-disable-next-line @repo/internal/import/no-unresolved, import/dynamic-import-chunkname -- react-dom/client only available in react 18
			const { createRoot } = await import('react-dom/client');
			root = createRoot(container!);
		}
		createRangeMock = jest.spyOn(document, 'createRange');
		createRangeMock.mockImplementation(() => {
			return new Range();
		});
	});

	afterEach(() => {
		document.body.removeChild(container!);
		container = null;
		createRangeMock.mockRestore();
	});

	it('should call the SelectionInlineCommentMounter with the positions calculated by the actions', () => {
		const ref: React.RefObject<HTMLDivElement> = React.createRef();
		const spy = jest.spyOn(MounterMock, 'SelectionInlineCommentMounter');
		const documentPosition = { from: 0, to: 10 };
		const applyAnnotation = () => {};
		const generateAnnotationIndexMatch = () => false;
		// @ts-ignore
		const actions = {
			getPositionFromRange: jest.fn(() => documentPosition),
			isValidAnnotationPosition: jest.fn(() => true),
			applyAnnotation,
			generateAnnotationIndexMatch,
		} as RendererActions;
		const selectionComponent = () => {
			return null;
		};

		if (process.env.IS_REACT_18 === 'true') {
			act(() => {
				root.render(
					<RendererContext.Provider value={actions}>
						<div>
							<div ref={ref} id="renderer-container">
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
								<span className="start-selection">Melancia</span>
								<span>Mamao</span>
								<div>
									{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
									<small className="end-selection">morango</small>
								</div>
							</div>
							<SelectionRangeValidator rendererRef={ref} selectionComponent={selectionComponent} />
						</div>
						,
					</RendererContext.Provider>,
				);
			});
		} else {
			act(() => {
				render(
					<RendererContext.Provider value={actions}>
						<div>
							<div ref={ref} id="renderer-container">
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
								<span className="start-selection">Melancia</span>
								<span>Mamao</span>
								<div>
									{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
									<small className="end-selection">morango</small>
								</div>
							</div>
							<SelectionRangeValidator rendererRef={ref} selectionComponent={selectionComponent} />
						</div>
						,
					</RendererContext.Provider>,
					container,
				);
			});
		}

		expect(spy.mock.calls[0][0]).toMatchObject({
			documentPosition,
			isAnnotationAllowed: true,
		});
	});
});
