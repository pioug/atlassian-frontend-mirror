import React from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { setParameters } from '../../index';
import { NativeEmbedInitialPlaceholder } from '../initial-placeholder';

const getInlineWidthStyleSheets = () =>
	Array.from(document.styleSheets).filter((sheet) =>
		Array.from(sheet.cssRules).some((rule) =>
			rule.cssText.includes('.inline-extension-renderer:has('),
		),
	);

describe('NativeEmbedInitialPlaceholder', () => {
	it.each([false, true])('applies the inline width marker only for treatment %s', (enabled) => {
		render(
			<NativeEmbedInitialPlaceholder manifest={{ id: 'maui' }} shouldFillInlineWidth={enabled} />,
		);

		expect(getInlineWidthStyleSheets()).toHaveLength(enabled ? 1 : 0);
		const wrapper = screen.getByTestId('native-embed-initial-placeholder').parentElement;
		if (enabled) {
			expect(wrapper).toHaveAttribute('data-native-embed-inline-width', 'true');
		} else {
			expect(wrapper).not.toHaveAttribute('data-native-embed-inline-width');
		}
	});

	it.each([undefined, { id: 'whiteboard' }, { id: 'maui', parameterDefaults: { width: 480 } }])(
		'does not mark an unknown, different or explicitly sized manifest %j',
		(manifest) => {
			render(<NativeEmbedInitialPlaceholder manifest={manifest} shouldFillInlineWidth />);

			expect(getInlineWidthStyleSheets()).toHaveLength(0);

			expect(
				screen.getByTestId('native-embed-initial-placeholder').parentElement,
			).not.toHaveAttribute('data-native-embed-inline-width');
		},
	);

	it('leaves standalone placeholders in control by default', () => {
		render(<NativeEmbedInitialPlaceholder manifest={{ id: 'maui' }} />);

		expect(getInlineWidthStyleSheets()).toHaveLength(0);
		expect(
			screen.getByTestId('native-embed-initial-placeholder').parentElement,
		).not.toHaveAttribute('data-native-embed-inline-width');
	});

	it('keeps treatment styles while another treatment placeholder remains mounted', () => {
		const { rerender } = render(
			<>
				<NativeEmbedInitialPlaceholder
					key="first"
					manifest={{ id: 'maui' }}
					shouldFillInlineWidth
				/>
				<NativeEmbedInitialPlaceholder
					key="second"
					manifest={{ id: 'maui' }}
					shouldFillInlineWidth
				/>
			</>,
		);
		expect(getInlineWidthStyleSheets()).toHaveLength(2);

		rerender(
			<>
				<NativeEmbedInitialPlaceholder
					key="second"
					manifest={{ id: 'maui' }}
					shouldFillInlineWidth
				/>
			</>,
		);
		expect(getInlineWidthStyleSheets()).toHaveLength(1);

		rerender(<NativeEmbedInitialPlaceholder manifest={{ id: 'maui' }} />);
		expect(getInlineWidthStyleSheets()).toHaveLength(0);
	});

	it('removes treatment styles when a placeholder acquires an explicit width', () => {
		const { rerender } = render(
			<NativeEmbedInitialPlaceholder manifest={{ id: 'maui' }} shouldFillInlineWidth />,
		);
		expect(getInlineWidthStyleSheets()).toHaveLength(1);

		rerender(
			<NativeEmbedInitialPlaceholder
				manifest={{ id: 'maui' }}
				parameters={setParameters({}, { width: 480 })}
				shouldFillInlineWidth
			/>,
		);
		expect(getInlineWidthStyleSheets()).toHaveLength(0);
		expect(screen.getByTestId('native-embed-initial-placeholder')).toHaveStyle({ width: '480px' });
	});

	it('exposes the shared alignment and width contract on first paint', async () => {
		const parameters = setParameters({}, { alignment: 'right', height: 500, width: 900 });

		const { container } = render(
			<NativeEmbedInitialPlaceholder
				firstPaint
				parameters={parameters}
				testId="first-paint-placeholder"
			/>,
		);

		const frame = screen.getByTestId('first-paint-placeholder');
		const wrapper = frame.parentElement;

		expect(wrapper).toHaveAttribute('data-native-embed-alignment', 'right');
		expect(wrapper).toHaveAttribute('data-native-embed-width', '900');
		expect(wrapper).toHaveAttribute('data-native-embed-initial-placeholder', 'true');
		expect(wrapper).toHaveAttribute('data-native-embed-first-paint-placeholder', 'true');
		expect(frame).toHaveStyle({
			width: '900px',
			height: 'auto',
			aspectRatio: '900 / 500',
		});
		await expect(container).toBeAccessible();
	});

	it('uses manifest chrome and preserves the SSR replacement id', () => {
		render(
			<NativeEmbedInitialPlaceholder
				manifest={{
					id: 'maui',
					lockResizeAspectRatio: false,
					parameterDefaults: { height: 420, width: 760 },
					uiConfig: { showBorder: false },
				}}
				placeholderId="native-embed-macro-id"
			/>,
		);

		const frame = screen.getByTestId('native-embed-initial-placeholder');
		const wrapper = frame.parentElement;

		expect(wrapper).toHaveAttribute('data-native-embed-show-border', 'false');
		expect(wrapper).toHaveAttribute('data-native-embed-experience', 'maui');
		expect(wrapper).toHaveAttribute('data-native-embed-width', '760');
		expect(frame).toHaveAttribute('data-ssr-placeholder', 'native-embed-macro-id');
		expect(frame).toHaveStyle({ width: '760px', height: '420px' });
		expect(frame.style.aspectRatio).toBe('');
	});

	it('uses full available width when no explicit or manifest width is available', () => {
		render(<NativeEmbedInitialPlaceholder manifest={{ id: 'maui' }} />);

		const frame = screen.getByTestId('native-embed-initial-placeholder');
		const wrapper = frame.parentElement;

		expect(wrapper).not.toHaveAttribute('data-native-embed-width');
		expect(wrapper).toHaveAttribute('data-native-embed-experience', 'maui');
		expect(wrapper).toHaveAttribute('data-native-embed-alignment', 'center');
		expect(frame).toHaveStyle({ width: '100%', aspectRatio: '760 / 600' });
	});

	it('updates the placement metadata when an unsized MAUI embed is resized', () => {
		const { rerender } = render(<NativeEmbedInitialPlaceholder manifest={{ id: 'maui' }} />);
		const wrapper = screen.getByTestId('native-embed-initial-placeholder').parentElement;

		rerender(
			<NativeEmbedInitialPlaceholder
				manifest={{ id: 'maui' }}
				parameters={setParameters({}, { width: 480 })}
			/>,
		);

		expect(wrapper).toHaveAttribute('data-native-embed-width', '480');
	});

	it('does not opt other experiences into new placeholder placement styles', () => {
		render(<NativeEmbedInitialPlaceholder manifest={{ id: 'database' }} />);

		expect(
			screen.getByTestId('native-embed-initial-placeholder').parentElement,
		).not.toHaveAttribute('data-native-embed-experience');
	});
});
