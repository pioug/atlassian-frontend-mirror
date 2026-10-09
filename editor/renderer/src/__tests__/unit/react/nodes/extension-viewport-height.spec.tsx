import React from 'react';

import { act, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { renderExtension } from '../../../../react/nodes/extension';
import type { ExtensionViewportSize } from '../../../../react/types';

const extensionId = 'ari:cloud:ecosystem::extension/test-app/test-environment/static/test-macro';

const renderMacro = ({
	viewportSize,
	nodeHeight,
	inline = false,
	extensionViewportSizes = [{ extensionId, viewportSize }],
}: {
	extensionViewportSizes?: ExtensionViewportSize[];
	inline?: boolean;
	nodeHeight?: string;
	viewportSize?: string;
} = {}) =>
	renderExtension(
		<p>Macro content</p>,
		'default',
		{},
		undefined,
		extensionId,
		extensionViewportSizes,
		nodeHeight,
		undefined,
		() => inline,
	);

describe('Extension viewport height', () => {
	it.each([
		['small', '112px'],
		['medium', '262px'],
		['default', '262px'],
		['large', '524px'],
		['xlarge', '1048px'],
		['unsupported', '262px'],
		['300px', '262px'],
		['resizable', '262px'],
		[undefined, '262px'],
	])('reserves %s as %s with exactly one unit suffix', (viewportSize, height) => {
		passGate('confluence_forge_early_render_reserve_height');
		const macro = renderMacro({ viewportSize });
		const markup = renderToString(macro);
		expect(markup).toContain(`min-height:${height}`);
		expect(markup).not.toContain('pxpx');
		render(macro);
		expect(screen.getByTestId('extension--wrapper').style.minHeight).toBe(height);
	});

	it.each(['0', '150', '150.5'])('preserves numeric Connect height %s', (nodeHeight) => {
		render(renderMacro({ nodeHeight, extensionViewportSizes: [] }));
		expect(screen.getByTestId('extension--wrapper').style.minHeight).toBe(`${nodeHeight}px`);
	});

	it('keeps the reserved macro content accessible', async () => {
		passGate('confluence_forge_early_render_reserve_height');
		const { container } = render(renderMacro({ viewportSize: 'medium' }));
		await expect(container).toBeAccessible();
	});

	it('prefers a stored node height over the Forge manifest height', () => {
		render(renderMacro({ nodeHeight: '150', viewportSize: 'large' }));
		expect(screen.getByTestId('extension--wrapper').style.minHeight).toBe('150px');
	});

	it('preserves a node height that already includes pixels', () => {
		passGate('confluence_forge_early_render_reserve_height');
		render(renderMacro({ nodeHeight: '150px', viewportSize: 'large' }));
		expect(screen.getByTestId('extension--wrapper').style.minHeight).toBe('150px');
	});

	it.each([
		{ extensionViewportSizes: [] },
		{ extensionViewportSizes: [{ extensionId: 'another-extension', viewportSize: 'large' }] },
	])('does not reserve height without a matching extension', ({ extensionViewportSizes }) => {
		render(renderMacro({ extensionViewportSizes }));
		expect(screen.getByTestId('extension--wrapper').style.minHeight).toBe('');
	});

	eeTest
		.describe('platform_editor_render_bodied_extension_as_inline', 'inline height exclusion')
		.variant(true, () => {
			it('does not reserve block height for an inline extension', () => {
				passGate('confluence_forge_early_render_reserve_height');
				render(renderMacro({ viewportSize: 'large', inline: true }));
				expect(screen.getByTestId('extension--wrapper').style.minHeight).toBe('');
			});
		});

	it('keeps the reserved height stable from SSR through hydration', async () => {
		passGate('confluence_forge_early_render_reserve_height');
		const Macro = () => renderMacro({ viewportSize: 'medium' });
		const macro = <Macro />;
		const container = document.createElement('div');
		container.innerHTML = renderToString(macro);
		document.body.appendChild(container);
		const wrapper = screen.getByTestId('extension--wrapper');
		expect(wrapper.style.minHeight).toBe('262px');
		expect(getComputedStyle(wrapper).minHeight).toBe('262px');
		const onRecoverableError = jest.fn();
		let root: ReturnType<typeof hydrateRoot> | undefined;
		try {
			await act(async () => {
				root = hydrateRoot(container, macro, { onRecoverableError });
			});
			expect(screen.getByTestId('extension--wrapper')).toBe(wrapper);
			expect(getComputedStyle(wrapper).minHeight).toBe('262px');
			expect(onRecoverableError).not.toHaveBeenCalled();
		} finally {
			act(() => root?.unmount());
			container.remove();
		}
	});
});

describe('Extension viewport height controls', () => {
	it('preserves the existing named-height markup with the fix gate disabled', () => {
		failGate('confluence_forge_early_render_reserve_height');
		expect(renderToString(renderMacro({ viewportSize: 'medium' }))).toContain('min-height:262pxpx');
	});

	it('preserves numeric Connect heights independently of the correction gate', () => {
		render(renderMacro({ nodeHeight: '150', extensionViewportSizes: [] }));
		expect(screen.getByTestId('extension--wrapper').style.minHeight).toBe('150px');
	});
});
