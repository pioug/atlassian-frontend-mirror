import React from 'react';

import { render } from '@testing-library/react';

import { ChromelessEditorContainer } from '../../../ui/Appearance/Chromeless';

// this test is mainly to check if dev only updated legacy styles, and forget to update in the new styles
// if the new styles are not updated, we will see a difference in the snapshot
// and dev should update the new styles, and then update the snapshot
describe('ChromelessEditorContainer', () => {
	it('should have correct styles for new container', async () => {
		const { container } = render(
			<ChromelessEditorContainer minHeight={100} maxHeight={200}>
				<div>child</div>
			</ChromelessEditorContainer>,
		);
		expect(container).toMatchSnapshot();

		await expect(document.body).toBeAccessible();
	});

	it('should have correct styles for new container with no max height', async () => {
		const { container } = render(
			<ChromelessEditorContainer minHeight={100}>
				<div>child</div>
			</ChromelessEditorContainer>,
		);
		expect(container).toMatchSnapshot();

		await expect(document.body).toBeAccessible();
	});
});
