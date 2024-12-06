import React from 'react';
import { create, type ReactTestRenderer, type ReactTestInstance } from 'react-test-renderer';
import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { ReactSerializer } from '../../../index';
import AnnotationComponent from '../../marks/annotation';
import { MarkElement as AnnotationMark } from '../../../ui/annotations/element';
import { simpleDocument as doc } from './__fixtures__/documents';
import { IntlProvider } from 'react-intl-next';

describe('Renderer - ReactSerializer - AnnotationMark', () => {
	let docFromSchema: PMNode;
	beforeAll(() => {
		docFromSchema = schema.nodeFromJSON(doc);
	});

	describe('when allowAnnotations is false', () => {
		let reactRenderer: ReactTestRenderer;
		beforeAll(() => {
			const reactSerializer = new ReactSerializer({
				allowAnnotations: false,
			});

			reactRenderer = create(reactSerializer.serializeFragment(docFromSchema.content) as any);
		});

		it('should render a span with the data attributes', () => {
			const testInstance = reactRenderer.root;

			const components = testInstance.findAllByType(AnnotationComponent);

			components.forEach((component) => {
				const id = component.props.id;
				const children = component.children[0] as ReactTestInstance;

				expect(children.type).toBe('span');
				expect(children.props['id']).toBe(id);
				expect(children.props['data-renderer-mark']).toBe(true);
				expect(children.props['data-mark-type']).toBe('annotation');
				expect(children.props['data-mark-annotation-type']).toBe('inlineComment');
				expect(children.props['data-id']).toBe(id);
			});
		});
	});

	describe('when allowAnnotations is true', () => {
		let reactRenderer: ReactTestRenderer;
		beforeAll(() => {
			const reactSerializer = new ReactSerializer({
				allowAnnotations: true,
			});

			const withIntl = () => (
				<IntlProvider locale="en">
					{reactSerializer.serializeFragment(docFromSchema.content)}
				</IntlProvider>
			);

			reactRenderer = create(withIntl());
		});

		it('should render AnnotationMark', () => {
			const testInstance = reactRenderer.root;

			const components = testInstance.findAllByType(AnnotationComponent);
			components.forEach((component) => {
				const children = component.children[0] as ReactTestInstance;

				expect(children.type).toBe(AnnotationMark);
			});
		});

		it('should have the parent annotation id inside of annotationParentIds', () => {
			const testInstance = reactRenderer.root;

			const components = testInstance.findAllByType(AnnotationComponent);
			let children = components[1].children[0] as ReactTestInstance;
			expect(children.props.annotationParentIds).toEqual(['lol_1', 'lol_2']);

			children = components[4].children[0] as ReactTestInstance;
			expect(children.props.annotationParentIds).toEqual(['lol_2', 'lol_3', 'lol_4']);
		});
	});
});
