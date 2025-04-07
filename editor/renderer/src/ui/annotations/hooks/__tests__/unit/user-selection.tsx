import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { AnnotationRangeProvider } from '../../../contexts/AnnotationRangeContext';
import { AnnotationsDraftContext } from '../../../context';
import type { Position } from '../../../types';
import { useUserSelectionRange } from '../../user-selection';
import * as utils from '../../utils';
import { isRangeInsideOfRendererContainer } from '../../utils';

jest.useFakeTimers();

describe('Annotations: SelectionInlineCommentMounter', () => {
	let root: any; // Change to Root once we go full React 18
	let container: HTMLElement | null;
	let createRangeMock: jest.SpyInstance;

	beforeEach(async () => {
		container = document.createElement('div');
		document.body.appendChild(container);
		createRangeMock = jest.spyOn(document, 'createRange');
		createRangeMock.mockImplementation(() => {
			return new Range();
		});

		if (process.env.IS_REACT_18 === 'true') {
			// @ts-ignore react-dom/client only available in react 18
			// eslint-disable-next-line @repo/internal/import/no-unresolved, import/dynamic-import-chunkname -- react-dom/client only available in react 18
			const { createRoot } = await import('react-dom/client');
			root = createRoot(container!);
		}
	});

	afterEach(() => {
		jest.restoreAllMocks();
		document.body.removeChild(container!);
		container = null;
		createRangeMock.mockRestore();
	});

	describe('#isRangeInsideOfRendererContainer', () => {
		let rendererDOM: HTMLElement;

		beforeEach(async () => {
			const Component = (
				<div>
					<section id="before-container">
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
						<span className="start-selection">Melancia</span>
						<span>Mamao</span>
						<div>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
							<small className="end-selection">morango</small>
						</div>
					</section>
					<section id="renderer-container">
						<span>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
							<span className="start-selection">
								K<small>e</small>
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
								<strong className="end-selection">VIN</strong>nho
							</span>
						</span>
					</section>
					<ul id="after-container">
						<li>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
							<span className="start-selection">
								Hello <strong> World</strong>
							</span>
						</li>
						<li>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
							<span className="end-selection">WELcome</span>
						</li>
					</ul>
				</div>
			);
			if (process.env.IS_REACT_18 === 'true') {
				act(() => {
					root.render(Component);
				});
			} else {
				render(Component, container);
			}

			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			rendererDOM = document.querySelector('#renderer-container') as HTMLElement;
		});

		describe('when the range is inside of the container', () => {
			it('shoudl return true', () => {
				const range = document.createRange();
				const start = rendererDOM.querySelector('.start-selection')!;
				const end = rendererDOM.querySelector('.end-selection')!;

				range.setStart(start.childNodes[0], 1);
				range.setEnd(end.childNodes[0], 3);

				expect(isRangeInsideOfRendererContainer(rendererDOM, range)).toBe(true);
			});
		});

		describe('when the range starts at before of container and ends after it', () => {
			it('should return false', () => {
				const range = document.createRange();

				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const beforeContainer = document.querySelector('#before-container') as HTMLElement;
				const startBefore = beforeContainer.querySelector('.start-selection')!;

				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const afterContainer = document.querySelector('#after-container') as HTMLElement;
				const endAfter = afterContainer.querySelector('.end-selection')!;

				range.setStart(startBefore.childNodes[0], 1);
				range.setEnd(endAfter.childNodes[0], 3);

				expect(isRangeInsideOfRendererContainer(rendererDOM, range)).toBe(false);
			});
		});

		describe('when the range starts at before of container and ends inside', () => {
			it('should return false', () => {
				const range = document.createRange();

				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const beforeContainer = document.querySelector('#before-container') as HTMLElement;
				const startBefore = beforeContainer.querySelector('.start-selection')!;
				const endInside = rendererDOM.querySelector('.end-selection')!;

				range.setStart(startBefore.childNodes[0], 1);
				range.setEnd(endInside.childNodes[0], 3);

				expect(isRangeInsideOfRendererContainer(rendererDOM, range)).toBe(false);
			});
		});

		describe('when the range starts at inside of container and ends after', () => {
			it('should return false', () => {
				const range = document.createRange();

				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const afterContainer = document.querySelector('#after-container') as HTMLElement;
				const startInside = rendererDOM.querySelector('.start-selection')!;
				const endAfter = afterContainer.querySelector('.end-selection')!;

				range.setStart(startInside.childNodes[0], 1);
				range.setEnd(endAfter.childNodes[0], 3);

				expect(isRangeInsideOfRendererContainer(rendererDOM, range)).toBe(false);
			});
		});

		describe('when the range is outside of the container', () => {
			it('should return false', () => {
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const beforeContainer = document.querySelector('#before-container') as HTMLElement;
				const beforeContainerRange = document.createRange();
				const startBefore = beforeContainer.querySelector('.start-selection')!;
				const endBefore = beforeContainer.querySelector('.end-selection')!;

				beforeContainerRange.setStart(startBefore.childNodes[0], 1);
				beforeContainerRange.setEnd(endBefore.childNodes[0], 3);

				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const afterContainer = document.querySelector('#after-container') as HTMLElement;
				const afterContainerRange = document.createRange();
				const startAfter = afterContainer.querySelector('.start-selection')!;
				const endAfter = afterContainer.querySelector('.end-selection')!;

				afterContainerRange.setStart(startAfter.childNodes[0], 1);
				afterContainerRange.setEnd(endAfter.childNodes[0], 3);

				expect(isRangeInsideOfRendererContainer(rendererDOM, beforeContainerRange)).toBe(false);
				expect(isRangeInsideOfRendererContainer(rendererDOM, afterContainerRange)).toBe(false);
			});
		});
	});

	describe('#useUserSelectionRange', () => {
		let rendererDOM: HTMLElement;
		type Props = {
			shouldAttachMouseUpEvent: boolean;
			rendererRef: React.RefObject<HTMLDivElement>;
		};
		let fakeFunction: jest.Mock;
		let fakeRef: React.RefObject<HTMLDivElement>;
		const DummyComponent = (props: Props) => {
			const _range = useUserSelectionRange(props);
			fakeFunction(_range);

			return null;
		};

		beforeEach(async () => {
			fakeFunction = jest.fn();

			if (process.env.IS_REACT_18 === 'true') {
				act(() => {
					root.render(<div id="renderer-container"></div>);
				});
			} else {
				render(<div id="renderer-container"></div>, container);
			}

			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			rendererDOM = document.querySelector('#renderer-container') as HTMLElement;

			fakeRef = { current: rendererDOM } as React.RefObject<HTMLDivElement>;
		});

		describe('when the selection changes', () => {
			function dispatchFakeSelectionChange() {
				act(() => {
					const event = new Event('selectionchange', {
						bubbles: false,
						cancelable: false,
					});
					document.dispatchEvent(event);
				});
			}

			async function renderDummyComponentWithDraftContext(myFakePosition: Position | null) {
				if (process.env.IS_REACT_18 === 'true') {
					act(() => {
						root.render(
							<AnnotationRangeProvider>
								<AnnotationsDraftContext.Provider value={myFakePosition}>
									<DummyComponent shouldAttachMouseUpEvent={true} rendererRef={fakeRef} />
								</AnnotationsDraftContext.Provider>
							</AnnotationRangeProvider>,
						);
					});
				} else {
					act(() => {
						render(
							<AnnotationRangeProvider>
								<AnnotationsDraftContext.Provider value={myFakePosition}>
									<DummyComponent shouldAttachMouseUpEvent={true} rendererRef={fakeRef} />
								</AnnotationsDraftContext.Provider>
							</AnnotationRangeProvider>,
							rendererDOM,
						);
					});
				}
			}

			let myFakeValidRange: Range;
			const myFakePosition = { from: 1, to: 10 };
			beforeEach(() => {
				myFakeValidRange = new Range();
				// @ts-ignore
				const myFakeSelection: Selection = {
					type: 'Range',
					rangeCount: 1,
					getRangeAt: jest.fn().mockReturnValue(myFakeValidRange),
				};
				jest.spyOn(document, 'getSelection').mockReturnValue(myFakeSelection);
				jest.spyOn(utils, 'isRangeInsideOfRendererContainer').mockReturnValue(true);
			});

			afterEach(() => {
				act(() => {
					if (process.env.IS_REACT_18 === 'true') {
						root.unmount();
					} else {
						unmountComponentAtNode(rendererDOM!);
					}
				});
			});

			describe('and when annotation draft is not happening', () => {
				it('should change the range value', async () => {
					expect(fakeFunction).toHaveBeenCalledTimes(0);
					expect(document.getSelection).toHaveBeenCalledTimes(0);

					await renderDummyComponentWithDraftContext(myFakePosition);

					expect(fakeFunction).toHaveBeenCalledTimes(1);
					expect(fakeFunction).toHaveBeenCalledWith([null, null, expect.any(Function)]);

					act(() => {
						dispatchFakeSelectionChange();
						jest.runAllTimers();
					});

					expect(document.getSelection).toHaveBeenCalledTimes(1);
					expect(fakeFunction).toHaveBeenCalledTimes(2);
				});
			});

			describe('and when there is a annotation draft happening', () => {
				it('should change the range value', async () => {
					expect(fakeFunction).toHaveBeenCalledTimes(0);
					expect(document.getSelection).toHaveBeenCalledTimes(0);

					await renderDummyComponentWithDraftContext(null);

					expect(fakeFunction).toHaveBeenCalledTimes(1);
					expect(fakeFunction).toHaveBeenCalledWith([null, null, expect.any(Function)]);

					act(() => {
						dispatchFakeSelectionChange();
						jest.runAllTimers();
					});

					expect(document.getSelection).toHaveBeenCalledTimes(1);
					expect(fakeFunction).toHaveBeenCalledTimes(2);
					expect(fakeFunction).toHaveBeenCalledWith([myFakeValidRange, null, expect.any(Function)]);
				});
			});

			describe('triple click', () => {
				beforeEach(async () => {
					if (process.env.IS_REACT_18 === 'true') {
						act(() => {
							root.render(
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
						});
					} else {
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
							container,
						);
					}
				});
				it('should not change the endContainer when endContainer is textNode', async () => {
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

					await renderDummyComponentWithDraftContext(null);

					// @ts-ignore
					const myFakeSelection: Selection = {
						type: 'Range',
						rangeCount: 1,
						getRangeAt: jest.fn().mockReturnValue(myFakeValidRangeUpdated),
					};
					jest.spyOn(document, 'getSelection').mockReturnValue(myFakeSelection);

					act(() => {
						dispatchFakeSelectionChange();
						jest.runAllTimers();
					});

					expect(document.getSelection()?.getRangeAt(0).setEnd).toHaveBeenCalledTimes(0);
					expect(document.getSelection()?.getRangeAt(0).cloneRange).toHaveBeenCalledTimes(1);
				});

				it('should change the endContainer when endContainer is not textNode', async () => {
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

					await renderDummyComponentWithDraftContext(null);

					// @ts-ignore
					const myFakeSelection: Selection = {
						type: 'Range',
						rangeCount: 1,
						getRangeAt: jest.fn().mockReturnValue(myFakeValidRangeUpdated),
					};
					jest.spyOn(document, 'getSelection').mockReturnValue(myFakeSelection);

					act(() => {
						dispatchFakeSelectionChange();
						jest.runAllTimers();
					});

					expect(document.getSelection()?.getRangeAt(0).setEnd).toHaveBeenCalledTimes(1);
					expect(document.getSelection()?.getRangeAt(0).setEnd).toHaveBeenCalledWith(
						lastListItem,
						6,
					);
					expect(document.getSelection()?.getRangeAt(0).cloneRange).toHaveBeenCalledTimes(1);
				});

				it('should change the endContainer when endContainer is not textNode and selection include inline code', async () => {
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

					await renderDummyComponentWithDraftContext(null);

					// @ts-ignore
					const myFakeSelection: Selection = {
						type: 'Range',
						rangeCount: 1,
						getRangeAt: jest.fn().mockReturnValue(myFakeValidRangeUpdated),
					};
					jest.spyOn(document, 'getSelection').mockReturnValue(myFakeSelection);

					act(() => {
						dispatchFakeSelectionChange();
						jest.runAllTimers();
					});

					expect(document.getSelection()?.getRangeAt(0).setEnd).toHaveBeenCalledTimes(1);
					expect(document.getSelection()?.getRangeAt(0).setEnd).toHaveBeenCalledWith(
						firstListItem.lastChild!.childNodes[0], // text node abc
						3,
					);
					expect(document.getSelection()?.getRangeAt(0).cloneRange).toHaveBeenCalledTimes(1);
				});
			});
		});

		describe('when a component is render using this hook', () => {
			describe('after mounting', () => {
				it('should attach a listener at the document selection change event', async () => {
					jest.spyOn(document, 'addEventListener');

					const fakeRef = {
						current: rendererDOM,
					} as React.RefObject<HTMLDivElement>;
					expect(document.addEventListener).toHaveBeenCalledTimes(0);

					if (process.env.IS_REACT_18 === 'true') {
						act(() => {
							root.render(<DummyComponent shouldAttachMouseUpEvent={true} rendererRef={fakeRef} />);
						});
					} else {
						act(() => {
							render(
								<DummyComponent shouldAttachMouseUpEvent={true} rendererRef={fakeRef} />,
								rendererDOM,
							);
						});
					}
					expect(document.addEventListener).toHaveBeenCalledTimes(1);
					expect(document.addEventListener).toHaveBeenCalledWith(
						'selectionchange',
						expect.any(Function),
					);
				});
			});

			describe('after unmounting', () => {
				it('should remove should the listener from the document selection change event', async () => {
					jest.spyOn(document, 'removeEventListener');

					const fakeRef = {
						current: rendererDOM,
					} as React.RefObject<HTMLDivElement>;
					expect(document.removeEventListener).toHaveBeenCalledTimes(0);

					if (process.env.IS_REACT_18 === 'true') {
						act(() => {
							root.render(<DummyComponent shouldAttachMouseUpEvent={true} rendererRef={fakeRef} />);
						});
					} else {
						act(() => {
							render(
								<DummyComponent shouldAttachMouseUpEvent={true} rendererRef={fakeRef} />,
								rendererDOM,
							);
						});
					}

					act(() => {
						if (process.env.IS_REACT_18 === 'true') {
							root.unmount();
						} else {
							unmountComponentAtNode(rendererDOM!);
						}
					});
					expect(document.removeEventListener).toHaveBeenCalledTimes(1);

					expect(document.removeEventListener).toHaveBeenCalledWith(
						'selectionchange',
						expect.any(Function),
					);
				});
			});
		});
	});
});
