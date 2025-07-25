/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { getFlexibleCardTestWrapper } from '../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { SmartLinkStatus } from '../../../../../../constants';
import { type FlexibleUiDataContext } from '../../../../../../state/flexible-ui-context/types';
import PreviewBlock from '../index';
import { type PreviewBlockProps } from '../types';

const testId = 'test-smart-block-preview';

const renderPreviewBlock = (
	props?: PreviewBlockProps,
	customContext?: FlexibleUiDataContext,
	status?: SmartLinkStatus,
) => {
	const ctx = customContext || context;
	return render(<PreviewBlock {...props} />, {
		wrapper: getFlexibleCardTestWrapper(ctx, undefined, status),
	});
};

describe('PreviewBlock', () => {
	it('renders PreviewBlock', async () => {
		renderPreviewBlock({
			testId,
		});

		const block = await screen.findByTestId(`${testId}-resolved-view`);

		expect(block).toBeDefined();
	});

	it('does not render Media if preview context is undefined', async () => {
		renderPreviewBlock(undefined, {
			preview: undefined,
		});

		const media = screen.queryByTestId(`smart-element-media-image-image`);
		expect(media).not.toBeInTheDocument();
	});

	describe('renders Previewblock with overrideUrl', () => {
		const props = {
			testId,
			overrideUrl: 'override-url',
		};

		it('with media data', async () => {
			renderPreviewBlock(props);

			const block = await screen.findByTestId(`${testId}-resolved-view`);
			const image = await screen.findByTestId(`smart-element-media-image-image`);

			expect(block).toBeDefined();
			expect(image).toHaveAttribute('src', 'override-url');
		});

		it('without media data', async () => {
			const customContext = { ...context, preview: undefined };
			renderPreviewBlock(props, customContext);

			const block = await screen.findByTestId(`${testId}-resolved-view`);
			const image = await screen.findByTestId(`smart-element-media-image-image`);

			expect(block).toBeDefined();
			expect(image).toHaveAttribute('src', 'override-url');
		});
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			backgroundColor: 'blue',
		});
		render(<PreviewBlock testId={testId} css={overrideCss} />, {
			wrapper: getFlexibleCardTestWrapper(context, undefined, SmartLinkStatus.Resolved),
		});
		const block = await screen.findByTestId('test-smart-block-preview-resolved-view');
		expect(block).toHaveCompiledCss('backgroundColor', 'blue');
	});

	describe('with specific status', () => {
		it('renders PreviewBlock when status is resolved', async () => {
			renderPreviewBlock();

			const block = await screen.findByTestId('smart-block-preview-resolved-view');

			expect(block).toBeDefined();
		});

		it.each([
			[SmartLinkStatus.Resolving],
			[SmartLinkStatus.Forbidden],
			[SmartLinkStatus.Errored],
			[SmartLinkStatus.NotFound],
			[SmartLinkStatus.Unauthorized],
			[SmartLinkStatus.Fallback],
		])('renders PreviewBlock when status is %s', async (status: SmartLinkStatus) => {
			renderPreviewBlock(undefined, undefined, status);
			const block = await screen.findByTestId('smart-block-preview-resolved-view');

			expect(block).toBeDefined();
		});
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderPreviewBlock();

		await expect(container).toBeAccessible();
	});
});
