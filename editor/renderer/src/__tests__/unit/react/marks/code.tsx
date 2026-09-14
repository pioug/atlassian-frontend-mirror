import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import Code from '../../../../react/marks/code';
import InlineComment from '../../../../react/marks/confluence-inline-comment';

describe('Renderer - React/Marks/Code', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(
			<Code codeBidiWarningTooltipEnabled={true} dataAttributes={{ 'data-renderer-mark': true }}>
				This is code
			</Code>,
		);

		await expect(container).toBeAccessible();
	});

	it('should generate content with a <Code>-tag', () => {
		const { container } = renderWithIntl(
			<Code codeBidiWarningTooltipEnabled={true} dataAttributes={{ 'data-renderer-mark': true }}>
				This is code
			</Code>,
		);

		expect(container.querySelector('code')).toBeInTheDocument();
	});

	it('should output correct html', () => {
		const { container } = renderWithIntl(
			<Code codeBidiWarningTooltipEnabled={true} dataAttributes={{ 'data-renderer-mark': true }}>
				This is code
			</Code>,
		);

		const code = container.querySelector('code');

		expect(code).toHaveAttribute('data-renderer-mark', 'true');
		expect(code).toHaveTextContent('This is code');
	});

	it('should handle arrays correctly', () => {
		const { container } = renderWithIntl(
			<Code codeBidiWarningTooltipEnabled={true} dataAttributes={{ 'data-renderer-mark': true }}>
				{['This ', 'is', ' code']}
			</Code>,
		);

		expect(container.querySelector('code')).toHaveTextContent('This is code');
	});

	it('should render in combination with other marks', () => {
		const { container } = renderWithIntl(
			<Code codeBidiWarningTooltipEnabled={true} dataAttributes={{ 'data-renderer-mark': true }}>
				This{' '}
				<InlineComment dataAttributes={{ 'data-renderer-mark': true }} reference={undefined as any}>
					is code
				</InlineComment>
			</Code>,
		);

		const code = container.querySelector('code');

		expect(code).toHaveTextContent('This is code');
		expect(code?.querySelector('span[data-mark-type="confluenceInlineComment"]')).toHaveTextContent(
			'is code',
		);
	});
});
