import React from 'react';
import { screen, render, fireEvent, act, waitFor } from '@testing-library/react';

import { AnnotationRangeProvider } from '../../../contexts/AnnotationRangeContext';
import { AnnotationsDraftContext } from '../../../context';
import type { Position } from '../../../types';
import { useUserSelectionRange } from '../../user-selection';
import * as utils from '../../utils';
import { isRangeInsideOfRendererContainer } from '../../utils';
import { ffTest } from '@atlassian/feature-flags-test-utils';

jest.useFakeTimers();

describe('Annotations: SelectionInlineCommentMounter', () => {
	beforeEach(() => {
		jest.spyOn(document, 'createRange').mockImplementation(() => new Range());
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('isRangeInsideOfRendererContainer', () => {
		const renderRenderer = () => {
			return render(
				<div>
					<section id="before-container">
						<span data-testid="before-start">Melancia</span>
						<span>Mamao</span>
						<div>
							<small data-testid="before-end">morango</small>
						</div>
					</section>
					<section id="renderer-container" data-testid="renderer-container">
						<span>
							<span data-testid="renderer-start">
								K<small>e</small>
								<strong data-testid="renderer-end">VIN</strong>nho
							</span>
						</span>
					</section>
					<ul id="after-container">
						<li>
							<span data-testid="after-start">
								Hello <strong>World</strong>
							</span>
						</li>
						<li>
							<span data-testid="after-end">WELcome</span>
						</li>
					</ul>
				</div>,
			);
		};

		it('should return true when the range is inside the renderer container', () => {
			renderRenderer();
			const range = document.createRange();
			const start = screen.getByTestId('renderer-start');
			const end = screen.getByTestId('renderer-end');
			range.setStart(start.childNodes[0], 1);
			range.setEnd(end.childNodes[0], 3);
			expect(
				isRangeInsideOfRendererContainer(screen.getByTestId('renderer-container'), range),
			).toBe(true);
		});

		it('should return false when the range spans before and after the container', () => {
			renderRenderer();
			const range = document.createRange();
			const start = screen.getByTestId('before-start');
			const end = screen.getByTestId('after-end');
			range.setStart(start.childNodes[0], 1);
			range.setEnd(end.childNodes[0], 3);
			expect(
				isRangeInsideOfRendererContainer(screen.getByTestId('renderer-container'), range),
			).toBe(false);
		});

		it('should return false when the range starts before and ends inside the container', () => {
			renderRenderer();
			const range = document.createRange();
			const start = screen.getByTestId('before-start');
			const end = screen.getByTestId('renderer-end');
			range.setStart(start.childNodes[0], 1);
			range.setEnd(end.childNodes[0], 3);
			expect(
				isRangeInsideOfRendererContainer(screen.getByTestId('renderer-container'), range),
			).toBe(false);
		});

		it('should return false when the range starts inside and ends after the container', () => {
			renderRenderer();
			const range = document.createRange();
			const start = screen.getByTestId('renderer-start');
			const end = screen.getByTestId('after-end');
			range.setStart(start.childNodes[0], 1);
			range.setEnd(end.childNodes[0], 3);
			expect(
				isRangeInsideOfRendererContainer(screen.getByTestId('renderer-container'), range),
			).toBe(false);
		});

		it('should return false when the range is entirely outside the container', () => {
			renderRenderer();
			const rangeBefore = document.createRange();
			const rangeAfter = document.createRange();
			const startBefore = screen.getByTestId('before-start');
			const endBefore = screen.getByTestId('before-end');
			const startAfter = screen.getByTestId('after-start');
			const endAfter = screen.getByTestId('after-end');
			rangeBefore.setStart(startBefore.childNodes[0], 1);
			rangeBefore.setEnd(endBefore.childNodes[0], 3);
			rangeAfter.setStart(startAfter.childNodes[0], 1);
			rangeAfter.setEnd(endAfter.childNodes[0], 3);
			expect(
				isRangeInsideOfRendererContainer(screen.getByTestId('renderer-container'), rangeBefore),
			).toBe(false);
			expect(
				isRangeInsideOfRendererContainer(screen.getByTestId('renderer-container'), rangeAfter),
			).toBe(false);
		});
	});

	describe('useUserSelectionRange', () => {
		let rendererDOM: HTMLElement;
		let fakeRef: React.RefObject<HTMLDivElement>;
		let myFakeValidRange: Range;
		const myFakePosition: Position = { from: 1, to: 10 };

		type Props = {
			rendererRef: React.RefObject<HTMLDivElement>;
			fakeFunction: (range: any) => void;
		};

		const DummyComponent = (props: Props) => {
			const _range = useUserSelectionRange(props);
			props.fakeFunction(_range);
			return <div ref={props.rendererRef} data-testid="renderer-container" />;
		};

		const renderDummyComponentWithDraftContext = (
			myFakePosition: Position | null,
			fakeFunction: jest.Mock,
		) => {
			render(
				<AnnotationRangeProvider>
					<AnnotationsDraftContext.Provider value={myFakePosition}>
						<DummyComponent rendererRef={fakeRef} fakeFunction={fakeFunction} />
					</AnnotationsDraftContext.Provider>
				</AnnotationRangeProvider>,
			);
		};

		const dispatchSelectionChange = () => {
			act(() => {
				fireEvent(document, new Event('selectionchange', { bubbles: false, cancelable: false }));
				jest.runAllTimers();
			});
		};

		beforeEach(() => {
			myFakeValidRange = new Range();
			jest.spyOn(document, 'getSelection').mockReturnValue({
				type: 'Range',
				rangeCount: 1,
				getRangeAt: jest.fn().mockReturnValue(myFakeValidRange),
			} as unknown as Selection);
			jest.spyOn(utils, 'isRangeInsideOfRendererContainer').mockReturnValue(true);

			// Setup DOM and ref for each test
			render(<div id="renderer-container" />);
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			rendererDOM = document.querySelector('#renderer-container') as HTMLElement;
			fakeRef = { current: rendererDOM } as React.RefObject<HTMLDivElement>;
		});

		describe('when the selection changes', () => {
			it('should change the range value when annotation draft is not happening', async () => {
				const fakeFunction = jest.fn();

				expect(fakeFunction).toHaveBeenCalledTimes(0);
				expect(document.getSelection).toHaveBeenCalledTimes(0);

				renderDummyComponentWithDraftContext(myFakePosition, fakeFunction);

				expect(fakeFunction).toHaveBeenCalledTimes(1);
				expect(fakeFunction).toHaveBeenCalledWith([null, null, expect.any(Function)]);

				fakeFunction.mockClear();
				dispatchSelectionChange();
				jest.runAllTimers();

				expect(document.getSelection).toHaveBeenCalledTimes(1);
				expect(fakeFunction).toHaveBeenCalledTimes(2);
			});

			it('should change the range value when annotation draft is happening', async () => {
				const fakeFunction = jest.fn();

				expect(fakeFunction).toHaveBeenCalledTimes(0);
				expect(document.getSelection).toHaveBeenCalledTimes(0);

				renderDummyComponentWithDraftContext(null, fakeFunction);

				expect(fakeFunction).toHaveBeenCalledTimes(1);
				expect(fakeFunction).toHaveBeenCalledWith([null, null, expect.any(Function)]);

				fakeFunction.mockClear();
				dispatchSelectionChange();
				jest.runAllTimers();

				expect(document.getSelection).toHaveBeenCalledTimes(1);
				expect(fakeFunction).toHaveBeenCalledTimes(2);
				expect(fakeFunction).toHaveBeenCalledWith([myFakeValidRange, null, expect.any(Function)]);
			});
		});

		describe('triple click', () => {
			const setupRenderer = () => {
				render(
					<div id="renderer-container">
						<ol>
							<li>
								<p>
									item 1<code>abc</code>
								</p>
							</li>
							<li>
								<p>item 2</p>
							</li>
							<li>
								<p>item 3</p>
							</li>
						</ol>
					</div>,
				);
			};

			it('should not change the endContainer when endContainer is textNode', async () => {
				setupRenderer();
				const fakeFunction = jest.fn();
				rendererDOM.classList.add('ak-renderer-document');

				const lastListItem = document.querySelector('li:last-child p')?.childNodes[0] as Node;

				const myFakeValidRangeUpdated: Range = {
					...myFakeValidRange,
					startContainer: lastListItem,
					endContainer: lastListItem,
					endOffset: 5,
					commonAncestorContainer: lastListItem.parentNode as Node,
					setEnd: jest.fn(),
					cloneRange: jest.fn(),
				};

				renderDummyComponentWithDraftContext(null, fakeFunction);

				// @ts-ignore
				const myFakeSelection: Selection = {
					type: 'Range',
					rangeCount: 1,
					getRangeAt: jest.fn().mockReturnValue(myFakeValidRangeUpdated),
				};
				jest.spyOn(document, 'getSelection').mockReturnValue(myFakeSelection);

				dispatchSelectionChange();
				jest.runAllTimers();

				expect(document.getSelection()?.getRangeAt(0).setEnd).toHaveBeenCalledTimes(0);
				expect(document.getSelection()?.getRangeAt(0).cloneRange).toHaveBeenCalledTimes(1);
			});

			it('should change the endContainer when endContainer is not textNode', async () => {
				setupRenderer();
				const fakeFunction = jest.fn();
				rendererDOM.classList.add('ak-renderer-document');

				const lastListItem = document.querySelector('li:last-child p')?.childNodes[0] as Node;

				const myFakeValidRangeUpdated: Range = {
					...myFakeValidRange,
					startContainer: lastListItem,
					startOffset: 0,
					endContainer: rendererDOM as Node,
					endOffset: 0,
					commonAncestorContainer: rendererDOM as Node,
					setEnd: jest.fn(),
					cloneRange: jest.fn(),
				};

				renderDummyComponentWithDraftContext(null, fakeFunction);

				// @ts-ignore
				const myFakeSelection: Selection = {
					type: 'Range',
					rangeCount: 1,
					getRangeAt: jest.fn().mockReturnValue(myFakeValidRangeUpdated),
				};
				jest.spyOn(document, 'getSelection').mockReturnValue(myFakeSelection);

				dispatchSelectionChange();
				jest.runAllTimers();

				expect(document.getSelection()?.getRangeAt(0).setEnd).toHaveBeenCalledTimes(1);
				expect(document.getSelection()?.getRangeAt(0).setEnd).toHaveBeenCalledWith(lastListItem, 6);
				expect(document.getSelection()?.getRangeAt(0).cloneRange).toHaveBeenCalledTimes(1);
			});

			it('should change the endContainer when endContainer is not textNode and selection include inline code', async () => {
				setupRenderer();
				const fakeFunction = jest.fn();
				rendererDOM.classList.add('ak-renderer-document');
				const firstListItem = document.querySelector('li:first-child p') as Node;

				const myFakeValidRangeUpdated: Range = {
					...myFakeValidRange,
					startContainer: firstListItem.childNodes[0],
					startOffset: 0,
					endContainer: rendererDOM as Node,
					endOffset: 0,
					commonAncestorContainer: rendererDOM as Node,
					setEnd: jest.fn(),
					cloneRange: jest.fn(),
				};

				renderDummyComponentWithDraftContext(null, fakeFunction);

				// @ts-ignore
				const myFakeSelection: Selection = {
					type: 'Range',
					rangeCount: 1,
					getRangeAt: jest.fn().mockReturnValue(myFakeValidRangeUpdated),
				};
				jest.spyOn(document, 'getSelection').mockReturnValue(myFakeSelection);

				dispatchSelectionChange();
				jest.runAllTimers();

				expect(document.getSelection()?.getRangeAt(0).setEnd).toHaveBeenCalledTimes(1);
				expect(document.getSelection()?.getRangeAt(0).setEnd).toHaveBeenCalledWith(
					firstListItem.lastChild!.childNodes[0], // text node abc
					3,
				);
				expect(document.getSelection()?.getRangeAt(0).cloneRange).toHaveBeenCalledTimes(1);
			});
		});

		ffTest.on('platform_renderer_triple_click_selects_paragraph', 'triple click', () => {
			it('should select the entire paragraph with nested content', async () => {
				render(
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
					<div data-testid="renderer-container" className="ak-renderer-document">
						<p data-testid="paragraph">
							hello<span></span>
							<span>world</span>
							<span></span>
						</p>
					</div>,
				);

				const fakeFunction = jest.fn();
				const paragraph = screen.getByTestId('paragraph');

				const myFakeValidRangeUpdated: Range = {
					...myFakeValidRange,
					startContainer: paragraph,
					startOffset: 0,
					endContainer: rendererDOM as Node,
					endOffset: 0,
					commonAncestorContainer: paragraph,
					setEnd: jest.fn(),
					cloneRange: jest.fn(() => myFakeValidRangeUpdated),
				};

				const fakeSelection: Selection = {
					type: 'Range',
					rangeCount: 1,
					getRangeAt: jest.fn().mockReturnValue(myFakeValidRangeUpdated),
					removeAllRanges: jest.fn(),
					addRange: jest.fn(),
				} as unknown as Selection;

				jest.spyOn(document, 'getSelection').mockReturnValue(fakeSelection as unknown as Selection);

				renderDummyComponentWithDraftContext(null, fakeFunction);

				act(() => {
					dispatchSelectionChange();
					jest.advanceTimersByTime(100); // Match hook's 100ms timeout
				});

				await waitFor(() => {
					expect(fakeFunction).toHaveBeenCalledWith([
						myFakeValidRangeUpdated,
						null,
						expect.any(Function),
					]);
					expect(fakeSelection.removeAllRanges).toHaveBeenCalledTimes(1);
					expect(myFakeValidRangeUpdated.cloneRange).toHaveBeenCalledTimes(1);
					// setEnd is called when the flag is false
					expect(myFakeValidRangeUpdated.setEnd).not.toHaveBeenCalled();
				});
			});
		});

		describe('event listeners', () => {
			it('should attach a selectionchange listener', () => {
				jest.spyOn(document, 'addEventListener');
				render(
					<AnnotationRangeProvider>
						<AnnotationsDraftContext.Provider value={myFakePosition}>
							<DummyComponent rendererRef={fakeRef} fakeFunction={jest.fn()} />
						</AnnotationsDraftContext.Provider>
					</AnnotationRangeProvider>,
				);
				expect(document.addEventListener).toHaveBeenCalledWith(
					'selectionchange',
					expect.any(Function),
				);
			});

			it('should remove the selectionchange listener on unmount', () => {
				jest.spyOn(document, 'removeEventListener');
				const { unmount } = render(
					<AnnotationRangeProvider>
						<AnnotationsDraftContext.Provider value={myFakePosition}>
							<DummyComponent rendererRef={fakeRef} fakeFunction={jest.fn()} />
						</AnnotationsDraftContext.Provider>
					</AnnotationRangeProvider>,
				);

				unmount();
				expect(document.removeEventListener).toHaveBeenCalledWith(
					'selectionchange',
					expect.any(Function),
				);
			});
		});
	});
});
