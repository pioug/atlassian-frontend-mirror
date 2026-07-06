/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { render, screen } from '@atlassian/testing-library';

import context from '../../../../../../../__fixtures__/flexible-ui-data-context';
import { getFlexibleCardTestWrapper } from '../../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { MediaPlacement } from '../../../../../../../constants';
import { type PreviewBlockProps } from '../../types';
import PreviewBlockResolvedView from '../index';

const testId = 'test-smart-block-preview-resolved';

const renderResolvedView = (props?: PreviewBlockProps) => {
	return render(<PreviewBlockResolvedView testId={testId} {...props} />, {
		wrapper: getFlexibleCardTestWrapper(context),
	});
};

describe('PreviewBlockResolvedView', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = renderResolvedView();

		await screen.findByTestId(`${testId}-resolved-view`);

		await expect(container).toBeAccessible();
	});

	describe('dynamic styles', () => {
		it('applies absolute positioning for Left placement (via updateStyles in useLayoutEffect)', async () => {
			renderResolvedView({ placement: MediaPlacement.Left });

			const block = await screen.findByTestId(`${testId}-resolved-view`);

			expect(block).toHaveStyle({
				position: 'absolute',
				top: 'var(--container-padding)',
				bottom: 'var(--container-padding)',
				width: 'calc(var(--preview-block-width) - var(--container-padding))',
				left: 'var(--container-padding)',
			});
		});

		it('does not apply absolute positioning when no placement is provided', async () => {
			renderResolvedView({ style: { color: 'red' } });

			const block = await screen.findByTestId(`${testId}-resolved-view`);

			expect(block).not.toHaveStyle({ position: 'absolute' });
		});

		it('uses provided style prop when no placement is set', async () => {
			renderResolvedView({ style: { color: 'rgb(255, 0, 0)' } });

			const block = await screen.findByTestId(`${testId}-resolved-view`);

			expect(block).toHaveStyle({ color: 'rgb(255, 0, 0)' });
		});

		it('falls back to empty style when no style prop and no placement is set', async () => {
			renderResolvedView({});

			const block = await screen.findByTestId(`${testId}-resolved-view`);

			expect(block).not.toHaveStyle({ position: 'absolute' });
		});

		it('renders the resolved view block', async () => {
			renderResolvedView();

			const block = await screen.findByTestId(`${testId}-resolved-view`);

			expect(block).toBeDefined();
		});

		it('renders the preview media element', async () => {
			renderResolvedView();

			const image = await screen.findByTestId(`smart-element-media-image-image`);

			expect(image).toBeDefined();
		});
	});
});
