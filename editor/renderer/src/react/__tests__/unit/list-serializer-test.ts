import { createElement, Fragment } from 'react';
import { render } from '@atlassian/testing-library/render';
import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { ReactSerializer } from '../../../index';
import {
	nestedBulletList,
	nestedOrderedList,
	nestedBulletAndOrderedList,
} from './__fixtures__/documents';

const renderDocument = (document: object): HTMLElement => {
	const reactSerializer = new ReactSerializer({
		allowAnnotations: false,
	});
	const docFromSchema: PMNode = schema.nodeFromJSON(document);

	return render(
		createElement(Fragment, null, reactSerializer.serializeFragment(docFromSchema.content)),
	).container;
};

const countListAncestors = (element: Element, selector: string): number => {
	let count = 0;
	let parent = element.parentElement;

	while (parent) {
		if (parent.matches(selector)) {
			count++;
		}
		parent = parent.parentElement;
	}

	return count;
};

describe('Renderer - ReactSerializer - Lists', () => {
	describe('when the nested list is a bullet list', () => {
		it('should have the correct data-indent-level', () => {
			const container = renderDocument(nestedBulletList);

			const lists = Array.from(container.querySelectorAll('ul'));
			expect(lists).toHaveLength(6);
			lists.forEach((list, idx) => {
				expect(countListAncestors(list, 'ul')).toBe(idx);
				expect(list.getAttribute('data-indent-level')).toEqual(`${idx + 1}`);
			});
		});
	});

	describe('when the nested list is an ordered list', () => {
		it('should have the correct data-indent-level', () => {
			const container = renderDocument(nestedOrderedList);

			const lists = Array.from(container.querySelectorAll('ol'));
			expect(lists).toHaveLength(6);
			lists.forEach((list, idx) => {
				expect(countListAncestors(list, 'ol')).toBe(idx);
				expect(list.getAttribute('data-indent-level')).toEqual(`${idx + 1}`);
			});
		});
	});

	describe('when the nested list mixes bullet and ordered lists', () => {
		it('should have the correct data-indent-level for a nested mixed bullet and ordered list', () => {
			const container = renderDocument(nestedBulletAndOrderedList);

			const lists = Array.from(container.querySelectorAll('ul, ol'));
			expect(lists).toHaveLength(6);
			lists.forEach((list, idx) => {
				expect(countListAncestors(list, 'ul, ol')).toBe(idx);
				expect(list.getAttribute('data-indent-level')).toEqual(`${idx + 1}`);
			});
		});
	});
});
