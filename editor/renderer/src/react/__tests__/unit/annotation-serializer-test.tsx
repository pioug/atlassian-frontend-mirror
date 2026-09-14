import React from 'react';
import { render } from '@atlassian/testing-library/render';
import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { ReactSerializer } from '../../../index';
import { MarkElement as AnnotationMark } from '../../../ui/annotations/element';
import { simpleDocument as doc } from './__fixtures__/documents';
import { IntlProvider } from 'react-intl';

// Spy on the annotation mark element while keeping it rendering for real, so the props the
// serializer hands down can be asserted without inspecting the React tree.
jest.mock('../../../ui/annotations/element', () => {
	const actual = jest.requireActual('../../../ui/annotations/element');

	return {
		MarkElement: jest.fn(actual.MarkElement),
	};
});

const annotationMarkMock = AnnotationMark as unknown as jest.Mock;

describe('Renderer - ReactSerializer - AnnotationMark', () => {
	let docFromSchema: PMNode;
	beforeAll(() => {
		docFromSchema = schema.nodeFromJSON(doc);
	});

	beforeEach(() => {
		annotationMarkMock.mockClear();
	});

	const renderDocument = (allowAnnotations: boolean) => {
		const reactSerializer = new ReactSerializer({
			allowAnnotations,
		});

		return render(
			<IntlProvider locale="en">
				{reactSerializer.serializeFragment(docFromSchema.content)}
			</IntlProvider>,
		).container;
	};

	describe('when allowAnnotations is false', () => {
		it('should render a span with the data attributes', () => {
			const container = renderDocument(false);

			const annotations = Array.from(container.querySelectorAll('[data-mark-type="annotation"]'));
			expect(annotations).toHaveLength(5);
			expect(annotationMarkMock).not.toHaveBeenCalled();

			annotations.forEach((annotation) => {
				const id = annotation.getAttribute('data-id');

				expect(annotation.tagName).toBe('SPAN');
				expect(annotation.getAttribute('id')).toBe(id);
				expect(annotation.getAttribute('data-renderer-mark')).toBe('true');
				expect(annotation.getAttribute('data-mark-annotation-type')).toBe('inlineComment');
			});
		});
	});

	describe('when allowAnnotations is true', () => {
		it('should render AnnotationMark', () => {
			const container = renderDocument(true);

			const annotations = Array.from(container.querySelectorAll('[data-mark-type="annotation"]'));
			expect(annotations).toHaveLength(5);

			annotations.forEach((annotation) => {
				expect(annotation.tagName).toBe('MARK');
			});
		});

		it('should have the parent annotation id inside of annotationParentIds', () => {
			renderDocument(true);

			expect(annotationMarkMock).toHaveBeenCalledTimes(5);

			expect(annotationMarkMock.mock.calls[1][0].annotationParentIds).toEqual(['lol_1', 'lol_2']);
			expect(annotationMarkMock.mock.calls[4][0].annotationParentIds).toEqual([
				'lol_2',
				'lol_3',
				'lol_4',
			]);
		});
	});
});
