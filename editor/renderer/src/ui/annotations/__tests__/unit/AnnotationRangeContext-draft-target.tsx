import React, { act } from 'react';

import { renderHook } from '@atlassian/testing-library/render-hook';

import type { DraftTarget } from '../../contexts/AnnotationRangeContext';
import {
	AnnotationRangeProvider,
	useAnnotationRangeDispatch,
	useAnnotationRangeState,
} from '../../contexts/AnnotationRangeContext';

describe('Annotations: AnnotationRangeProvider draft targets', () => {
	const wrapper = ({ children }: React.PropsWithChildren) => (
		<AnnotationRangeProvider allowCommentsOnMedia>{children}</AnnotationRangeProvider>
	);

	const renderRangeContext = () =>
		renderHook(() => ({ ...useAnnotationRangeState(), ...useAnnotationRangeDispatch() }), {
			wrapper,
		});

	const target = (source: DraftTarget['source']): DraftTarget => ({
		// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- test range
		range: document.createRange(),
		documentPosition: { from: 1, to: 5 },
		isAnnotationAllowed: true,
		source,
	});

	it('starts with no draft target and no intent source', () => {
		const result = renderRangeContext();

		expect(result.current.selectionDraftTarget).toBeNull();
		expect(result.current.hoverDraftTarget).toBeNull();
		expect(result.current.draftIntentSource).toBeNull();
	});

	it('keeps the selection and hover targets independent', () => {
		const result = renderRangeContext();
		const selection = target('selection');
		const hover = target('hover');

		act(() => {
			result.current.setSelectionDraftTarget(selection);
			result.current.setHoverDraftTarget(hover);
		});

		expect(result.current.selectionDraftTarget).toBe(selection);
		expect(result.current.hoverDraftTarget).toBe(hover);
	});

	it('records which surface the user engaged last', () => {
		const result = renderRangeContext();

		act(() => {
			result.current.setDraftIntentSource('selection');
		});
		expect(result.current.draftIntentSource).toBe('selection');

		act(() => {
			result.current.setDraftIntentSource('hover');
		});
		expect(result.current.draftIntentSource).toBe('hover');
	});

	it('clears a published target', () => {
		const result = renderRangeContext();

		act(() => {
			result.current.setSelectionDraftTarget(target('selection'));
		});
		act(() => {
			result.current.setSelectionDraftTarget(null);
		});

		expect(result.current.selectionDraftTarget).toBeNull();
	});

	it('does not produce new state when the target is unchanged', () => {
		const result = renderRangeContext();
		const selection = target('selection');

		act(() => {
			result.current.setSelectionDraftTarget(selection);
		});
		const published = result.current.selectionDraftTarget;

		act(() => {
			result.current.setSelectionDraftTarget(selection);
		});

		expect(result.current.selectionDraftTarget).toBe(published);
	});
});
