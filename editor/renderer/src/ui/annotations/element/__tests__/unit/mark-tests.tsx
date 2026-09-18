import React from 'react';

import { act, fireEvent } from '@testing-library/react';
import { createRoot, type Root } from 'react-dom/client';
import { IntlProvider } from 'react-intl';

import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema/annotation';
import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import { MarkComponent } from '../../mark';

jest.mock('@atlaskit/feature-gate-js-client/feature-gates');

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

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
	let root: Root;

	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);

		onClick = jest.fn();
	});

	afterEach(() => {
		act(() => {
			root.unmount();
		});
		container.remove();
	});

	describe('when state is active', () => {
		const state = AnnotationMarkStates.ACTIVE;

		beforeEach(() => {
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
			jest.spyOn(FeatureGates, 'checkGate').mockReturnValue(false);

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
		});

		it('should call onClick only once', async () => {
			jest.spyOn(FeatureGates, 'checkGate').mockReturnValue(false);

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
