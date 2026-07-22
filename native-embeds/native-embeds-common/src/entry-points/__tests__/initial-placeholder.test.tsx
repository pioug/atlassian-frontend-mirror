import React from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { setParameters } from '../../index';
import { NativeEmbedInitialPlaceholder } from '../initial-placeholder';

describe('NativeEmbedInitialPlaceholder', () => {
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
		expect(wrapper).toHaveAttribute('data-native-embed-width', '760');
		expect(frame).toHaveAttribute('data-ssr-placeholder', 'native-embed-macro-id');
		expect(frame).toHaveStyle({ width: '760px', height: '420px' });
		expect(frame.style.aspectRatio).toBe('');
	});

	it('uses full available width when no explicit or manifest width is available', () => {
		render(<NativeEmbedInitialPlaceholder />);

		const frame = screen.getByTestId('native-embed-initial-placeholder');
		const wrapper = frame.parentElement;

		expect(wrapper).not.toHaveAttribute('data-native-embed-width');
		expect(frame).toHaveStyle({ width: '100%', aspectRatio: '760 / 600' });
	});
});
