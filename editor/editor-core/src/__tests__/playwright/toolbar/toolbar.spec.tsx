import React from 'react';

import { expect, editorTestCase as test } from '@af/editor-libra';
import { EditorMainToolbarModel } from '@af/editor-libra/page-models';

// These tests uses bounding box instead of `expect...toHaveCSS('width', ...)`
// to avoid pixel-perfect comparison, which is a source of flake
test.describe('Toolbar with long width and short height', () => {
	test.use({
		appearance: 'full-page',
		viewport: { width: 1280, height: 300 },
		withCollab: true,
	});

	test.use({
		editorProps: {
			primaryToolbarComponents: <div></div>,
		},
	});

	test('should show one line', async ({ editor }) => {
		const toolbar = EditorMainToolbarModel.from(editor);

		const toolbarBoundingBox = await toolbar.mainToolbar.boundingBox();
		expect(toolbarBoundingBox?.height).toBeCloseTo(32);
	});
});

test.describe('Toolbar with mid width and short height', () => {
	test.use({
		appearance: 'full-page',
		viewport: { width: 870, height: 300 },
		withCollab: true,
	});
	test.use({
		editorProps: {
			primaryToolbarComponents: <div></div>,
		},
	});

	test('should show one line', async ({ editor }) => {
		const toolbar = EditorMainToolbarModel.from(editor);

		const toolbarBoundingBox = await toolbar.mainToolbar.boundingBox();
		expect(toolbarBoundingBox?.height).toBeCloseTo(32);
	});
});

test.describe('Toolbar with short width and short height', () => {
	test.use({
		appearance: 'full-page',
		viewport: { width: 400, height: 300 },
		withCollab: true,
	});
	test.use({
		editorProps: {
			primaryToolbarComponents: <div></div>,
		},
	});

	test('should show two lines', async ({ editor }) => {
		const toolbar = EditorMainToolbarModel.from(editor);

		const toolbarBoundingBox = await toolbar.mainToolbar.boundingBox();
		expect(toolbarBoundingBox?.height).toBeCloseTo(56);
	});
});
