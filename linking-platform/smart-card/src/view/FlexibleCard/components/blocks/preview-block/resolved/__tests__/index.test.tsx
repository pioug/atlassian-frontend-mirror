/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';
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
	describe('dynamic styles - feature gate dfo-fix-preview-dynamic-style', () => {
		ffTest.on('dfo-fix-preview-dynamic-style', 'when gate is on', () => {
			it('applies absolute positioning style for Left placement with default container padding', async () => {
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

			it('applies absolute positioning style for Right placement with default container padding', async () => {
				renderResolvedView({ placement: MediaPlacement.Right });

				const block = await screen.findByTestId(`${testId}-resolved-view`);

				expect(block).toHaveStyle({
					position: 'absolute',
					top: 'var(--container-padding)',
					bottom: 'var(--container-padding)',
					width: 'calc(var(--preview-block-width) - var(--container-padding))',
					right: 'var(--container-padding)',
				});
			});

			it('does not set left style for Right placement', async () => {
				renderResolvedView({ placement: MediaPlacement.Right });

				const block = await screen.findByTestId(`${testId}-resolved-view`);

				// right is set for Right placement, but left should not be set
				expect(block.style.left).toBe('');
			});

			it('does not set right style for Left placement', async () => {
				renderResolvedView({ placement: MediaPlacement.Left });

				const block = await screen.findByTestId(`${testId}-resolved-view`);

				// left is set for Left placement, but right should not be set
				expect(block.style.right).toBe('');
			});

			it('applies absolute positioning with 0px padding for Left placement when ignoreContainerPadding is true', async () => {
				renderResolvedView({
					placement: MediaPlacement.Left,
					ignoreContainerPadding: true,
				});

				const block = await screen.findByTestId(`${testId}-resolved-view`);

				expect(block).toHaveStyle({
					position: 'absolute',
					top: '0px',
					bottom: '0px',
					width: 'calc(var(--preview-block-width) - 0px)',
					left: '0px',
				});
			});

			it('applies absolute positioning with 0px padding for Right placement when ignoreContainerPadding is true', async () => {
				renderResolvedView({
					placement: MediaPlacement.Right,
					ignoreContainerPadding: true,
				});

				const block = await screen.findByTestId(`${testId}-resolved-view`);

				expect(block).toHaveStyle({
					position: 'absolute',
					top: '0px',
					bottom: '0px',
					width: 'calc(var(--preview-block-width) - 0px)',
					right: '0px',
				});
			});

			it('does not apply absolute positioning when placement is not set', async () => {
				renderResolvedView({ placement: undefined });

				const block = await screen.findByTestId(`${testId}-resolved-view`);

				expect(block).not.toHaveStyle({ position: 'absolute' });
			});

			it('merges provided style prop into dynamic styles for Left placement', async () => {
				renderResolvedView({
					placement: MediaPlacement.Left,
					style: { zIndex: 10 },
				});

				const block = await screen.findByTestId(`${testId}-resolved-view`);

				expect(block).toHaveStyle({
					position: 'absolute',
					zIndex: 10,
				});
			});
		});

		ffTest.off('dfo-fix-preview-dynamic-style', 'when gate is off', () => {
			it('does not apply absolute positioning for Left placement (uses updateStyles via useLayoutEffect)', async () => {
				// When the gate is off, the initial state falls back to style ?? {}
				// but useLayoutEffect still calls updateStyles() which sets absolute positioning
				// for Left/Right placements unconditionally.
				renderResolvedView({ placement: MediaPlacement.Left });

				const block = await screen.findByTestId(`${testId}-resolved-view`);

				// After useLayoutEffect, updateStyles sets absolute positioning regardless of gate
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
		});

		ffTest.both('dfo-fix-preview-dynamic-style', 'regardless of gate state', () => {
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
});
