import React from 'react';

import { render } from '@testing-library/react';

import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

import { ChromelessEditorContainer } from '../../../ui/Appearance/Chromeless';

// this test is mainly to check if dev only updated legacy styles, and forget to update in the new styles
// if the new styles are not updated, we will see a difference in the snapshot
// and dev should update the new styles, and then update the snapshot
describe('ChromelessEditorContainer', () => {
	eeTest.describe('platform_editor_core_static_emotion', 'static emotion on').variant(true, () => {
		it('should have correct styles for new container', () => {
			const { container } = render(
				<ChromelessEditorContainer minHeight={100} maxHeight={200}>
					<div>child</div>
				</ChromelessEditorContainer>,
			);
			expect(container).toMatchSnapshot();
		});

		it('should have correct styles for new container with no max height', () => {
			const { container } = render(
				<ChromelessEditorContainer minHeight={100}>
					<div>child</div>
				</ChromelessEditorContainer>,
			);
			expect(container).toMatchSnapshot();
		});
	});
	eeTest
		.describe('platform_editor_core_static_emotion', 'static emotion off')
		.variant(false, () => {
			it('should have correct styles for legacy container', () => {
				const { container } = render(
					<ChromelessEditorContainer minHeight={100} maxHeight={200}>
						<div>child</div>
					</ChromelessEditorContainer>,
				);
				expect(container).toMatchSnapshot();
			});

			it('should have correct styles for legacy container with no max height', () => {
				const { container } = render(
					<ChromelessEditorContainer minHeight={100}>
						<div>child</div>
					</ChromelessEditorContainer>,
				);
				expect(container).toMatchSnapshot();
			});
		});
});
