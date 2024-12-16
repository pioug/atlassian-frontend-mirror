import React from 'react';
import FeatureGates from '@atlaskit/feature-gate-js-client';

import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema';
import { act, fireEvent } from '@testing-library/react';
import { render, unmountComponentAtNode } from 'react-dom';
import { MarkComponent } from '../../mark';
import { IntlProvider } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';

jest.mock('@atlaskit/feature-gate-js-client');

describe('Annotations/Mark', () => {
	const fakeId = 'fakeId';
	const annotationParentIds = ['lol_1'];
	const fakeDataAttributes = {
		'data-renderer-mark': true,
		'data-mark-type': 'annotation',
		'data-mark-annotation-type': AnnotationTypes.INLINE_COMMENT,
		'data-id': fakeId,
	};
	let onClick: jest.Mock;

	let container: HTMLElement;
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

		onClick = jest.fn();
	});

	afterEach(() => {
		act(() => {
			if (process.env.IS_REACT_18 === 'true') {
				root.unmount();
			} else {
				unmountComponentAtNode(container!);
			}
		});
		container.remove();
	});
	ffTest.on(
		'inline_comments_keyboard_accessible_renderer',
		'when inline keyboard accessible renderer fg is on',
		() => {
			describe('when state is active', () => {
				const state = AnnotationMarkStates.ACTIVE;

				beforeEach(() => {
					if (process.env.IS_REACT_18 === 'true') {
						act(() => {
							root.render(
								<IntlProvider locale="en">
									<MarkComponent
										id={fakeId}
										annotationParentIds={annotationParentIds}
										dataAttributes={fakeDataAttributes}
										state={state}
										hasFocus={false}
										onClick={onClick}
										isHovered={false}
									>
										<small>some</small>
									</MarkComponent>
									,
								</IntlProvider>,
							);
						});
					} else {
						render(
							<IntlProvider locale="en">
								<MarkComponent
									id={fakeId}
									annotationParentIds={annotationParentIds}
									dataAttributes={fakeDataAttributes}
									state={state}
									hasFocus={false}
									onClick={onClick}
									isHovered={false}
								>
									<small>some</small>
								</MarkComponent>
							</IntlProvider>,
							container,
						);
					}
				});

				it('should render the data attributes', async () => {
					const markWrapper = container.querySelector('mark');
					expect(markWrapper).not.toBeNull();
					expect(Object.assign({}, markWrapper!.dataset)).toEqual({
						id: fakeId,
						markAnnotationType: 'inlineComment',
						markAnnotationState: 'active',
						markType: 'annotation',
						rendererMark: 'true',
						hasFocus: 'false',
						isHovered: 'false',
					});
					expect(markWrapper!.getAttribute('role')).toEqual('button');
					expect(markWrapper!.getAttribute('tabIndex')).toEqual('0');
					expect(markWrapper!.getAttribute('aria-expanded')).toEqual('false');
				});

				it('should render the aria-details with parent ids and the mark id', async () => {
					const markWrapper = container.querySelector('mark');
					expect(markWrapper).not.toBeNull();
					expect(markWrapper!.getAttribute('aria-details')).toEqual('lol_1, fakeId');
				});

				it('should not render the aria-disabled', async () => {
					const markWrapper = container.querySelector('mark');
					expect(markWrapper!.getAttribute('aria-disabled')).toBeNull();
				});

				it('should prevent default when clicked', async () => {
					const markWrapper = container.querySelector('mark');
					const clickEvent = new MouseEvent('click', {
						bubbles: true,
						cancelable: true,
					});
					Object.assign(clickEvent, { preventDefault: jest.fn() });
					fireEvent(markWrapper!, clickEvent);
					expect(clickEvent.preventDefault).toHaveBeenCalledTimes(1);
				});

				it('should call onClick prop when clicked', async () => {
					const markWrapper = container.querySelector('mark');
					markWrapper!.click();
					expect(onClick).toHaveBeenCalledWith(
						expect.objectContaining({
							annotationIds: [...annotationParentIds, fakeId],
						}),
					);
				});
			});
		},
	);

	describe('when 2 marks overlaps in active state', () => {
		const state = AnnotationMarkStates.ACTIVE;
		const childFakeId = 'childFakeId';
		const childAnnotationParentIds = [fakeId];
		const childFakeDataAttributes = {
			'data-renderer-mark': true,
			'data-mark-type': 'annotation',
			'data-mark-annotation-type': AnnotationTypes.INLINE_COMMENT,
			'data-id': childFakeId,
		};

		beforeEach(() => {
			if (process.env.IS_REACT_18 === 'true') {
				act(() => {
					root.render(
						<IntlProvider locale="en">
							<MarkComponent
								id={fakeId}
								annotationParentIds={annotationParentIds}
								dataAttributes={fakeDataAttributes}
								state={state}
								hasFocus={false}
								onClick={onClick}
								isHovered={false}
							>
								<MarkComponent
									id={childFakeId}
									annotationParentIds={childAnnotationParentIds}
									dataAttributes={childFakeDataAttributes}
									state={state}
									hasFocus={false}
									onClick={onClick}
									isHovered={false}
								>
									<small>some</small>
								</MarkComponent>
							</MarkComponent>
						</IntlProvider>,
					);
				});
			} else {
				render(
					<IntlProvider locale="en">
						<MarkComponent
							id={fakeId}
							annotationParentIds={annotationParentIds}
							dataAttributes={fakeDataAttributes}
							state={state}
							hasFocus={false}
							onClick={onClick}
							isHovered={false}
						>
							<MarkComponent
								id={childFakeId}
								annotationParentIds={childAnnotationParentIds}
								dataAttributes={childFakeDataAttributes}
								state={state}
								hasFocus={false}
								onClick={onClick}
								isHovered={false}
							>
								<small>some</small>
							</MarkComponent>
						</MarkComponent>
					</IntlProvider>,
					container,
				);
			}
		});

		it('should call onClick only once', async () => {
			const markWrapper = container.querySelector('#childFakeId');
			const clickEvent = new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
			});
			Object.assign(clickEvent, { preventDefault: jest.fn() });
			fireEvent(markWrapper!, clickEvent);
			expect(onClick).toHaveBeenCalledTimes(1);
		});
	});

	describe('when state is not active', () => {
		const state = AnnotationMarkStates.RESOLVED;
		(FeatureGates.checkGate as jest.Mock).mockReturnValue(true);

		beforeEach(() => {
			if (process.env.IS_REACT_18 === 'true') {
				act(() => {
					root.render(
						<IntlProvider locale="en">
							<MarkComponent
								id={fakeId}
								annotationParentIds={annotationParentIds}
								dataAttributes={fakeDataAttributes}
								state={state}
								hasFocus={false}
								onClick={onClick}
								isHovered={false}
							>
								<small>some</small>
							</MarkComponent>
						</IntlProvider>,
					);
				});
			} else {
				render(
					<IntlProvider locale="en">
						<MarkComponent
							id={fakeId}
							annotationParentIds={annotationParentIds}
							dataAttributes={fakeDataAttributes}
							state={state}
							hasFocus={false}
							onClick={onClick}
							isHovered={false}
						>
							<small>some</small>
						</MarkComponent>
					</IntlProvider>,
					container,
				);
			}
		});

		it('should not call onClick prop when clicked', async () => {
			const markWrapper = container.querySelector('mark');
			markWrapper!.click();
			expect(onClick).not.toHaveBeenCalledWith([...annotationParentIds, fakeId]);
		});

		it('should render the aria-disabled', async () => {
			const markWrapper = container.querySelector('mark');
			expect(markWrapper!.getAttribute('aria-disabled')).toEqual('true');
		});

		it('should not render the aria-details', async () => {
			const markWrapper = container.querySelector('mark');
			expect(markWrapper).not.toBeNull();
			expect(markWrapper!.getAttribute('aria-details')).toBeNull();
			expect(markWrapper!.getAttribute('role')).not.toEqual('button');
			expect(markWrapper!.getAttribute('tabIndex')).not.toEqual('0');
			expect(markWrapper!.getAttribute('aria-expanded')).toEqual(null);
		});
	});
});
