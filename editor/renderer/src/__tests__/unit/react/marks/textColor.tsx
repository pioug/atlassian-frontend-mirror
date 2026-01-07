import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';

import { token } from '@atlaskit/tokens';

import TextColor from '../../../../react/marks/textColor';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer - React/Marks/TextColor', () => {
	let wrapper: RenderResult;
	beforeEach(() => {
		wrapper = render(
			<TextColor
				dataAttributes={{ 'data-renderer-mark': true }}
				color={token('color.text.danger', '#bf2600')}
			>
				This is a red text
			</TextColor>,
		);
	});

	it('should wrap content with <span>-tag', async () => {
		const mark = await wrapper.getByText('This is a red text');
		expect(mark.tagName).toEqual('SPAN');
	});

	it('should output correct html', async () => {
		const mark = await wrapper.getByText('This is a red text');

		expect(mark.outerHTML).toEqual(
			`<span data-renderer-mark=\"true\" data-text-custom-color=\"var(--ds-text-danger, #bf2600)\" class=\"fabric-text-color-mark\" style=\"--custom-palette-color: var(--ds-text-danger, #bf2600);\">This is a red text</span>`,
		);
	});
});
