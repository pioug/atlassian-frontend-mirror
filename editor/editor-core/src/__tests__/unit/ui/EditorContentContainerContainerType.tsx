import React from 'react';

// eslint-disable-next-line @atlassian/testing-library/prefer-atlassian-testing-library -- `render`/`screen` are only exported from the `@atlassian/testing-library` root barrel, which is prohibited by the ratcheting rule; import them from the `@testing-library/react` source directly instead.
import { render, screen } from '@testing-library/react';

import { BaseTheme } from '@atlaskit/editor-common/ui';
import { akEditorFullPageDefaultFontSize } from '@atlaskit/editor-shared-styles/consts';
import { setGlobalTheme } from '@atlaskit/tokens/set-global-theme';

import { EditorContentContainerEmotion } from '../../../ui/EditorContentContainer/EditorContentContainer-emotion';

// jest doesn't support @container styles in css, so strip them (mirrors EditorContentContainerEmotion.tsx)
jest.mock('@emotion/react', () => {
	const originalModule = jest.requireActual('@emotion/react');
	return {
		...originalModule,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		css: (...args: any[]) => {
			const styles = originalModule.css(...args);
			return {
				...styles,
				// eslint-disable-next-line require-unicode-regexp
				styles: styles.styles.replace(/@container[^{]*{[^{}]*({[^{}]*}[^{}]*)*}/g, ''),
			};
		},
	};
});

const renderContentContainer = (appearance: 'comment' | 'chromeless' | 'full-page') =>
	render(
		<BaseTheme baseFontSize={akEditorFullPageDefaultFontSize}>
			<EditorContentContainerEmotion
				appearance={appearance}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className="fabric-editor-popup-scroll-parent"
				viewMode={'edit'}
				isScrollable
			>
				<div data-testid="child-component">content</div>
			</EditorContentContainerEmotion>
		</BaseTheme>,
	);

// Comment and chromeless appearances have no `container-type: inline-size` ancestor, so the
// content area itself is the query container. That gives `--ak-editor-max-container-width`
// (cqw-based) a sidebar-aware width to resolve against instead of the viewport.
describe('EditorContentContainer container-query context', () => {
	beforeEach(() => {
		setGlobalTheme({ typography: 'typography' });
	});

	it('makes the comment content area a query container', async () => {
		renderContentContainer('comment');
		expect(screen.getByTestId('editor-content-container')).toHaveCompiledCss({
			containerType: 'inline-size',
		});
		await expect(document.body).toBeAccessible();
	});

	it('makes the chromeless content area a query container', () => {
		renderContentContainer('chromeless');
		expect(screen.getByTestId('editor-content-container')).toHaveCompiledCss({
			containerType: 'inline-size',
		});
	});

	// Full-page uses the ancestor `editor-area` query container, so the content area itself is
	// never made a query container here.
	it('does not make the full-page content area a query container', () => {
		renderContentContainer('full-page');
		expect(screen.getByTestId('editor-content-container')).not.toHaveCompiledCss({
			containerType: 'inline-size',
		});
	});
});
