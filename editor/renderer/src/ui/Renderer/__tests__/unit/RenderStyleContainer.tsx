import React from 'react';
import { render, screen } from '@testing-library/react';

import { RendererStyleContainer } from '../../RendererStyleContainer';
import { BaseTheme } from '@atlaskit/editor-common/ui';
import { akEditorFullPageDefaultFontSize } from '@atlaskit/editor-shared-styles';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { setGlobalTheme } from '@atlaskit/tokens';

describe('RendererStyleContainer', () => {
	beforeEach(() => {
		setGlobalTheme({ typography: 'typography-modernized' });
	});

	it('should render children', () => {
		const { getByText } = render(
			<RendererStyleContainer
				appearance={'full-page'}
				allowNestedHeaderLinks={false}
				useBlockRenderForCodeBlock={false}
			>
				<div>Hello world</div>
			</RendererStyleContainer>,
		);
		expect(getByText('Hello world')).toBeTruthy();
	});

	describe('when platform_editor_typography_ugc are on', () => {
		ffTest.on('platform_editor_typography_ugc', 'with fg on', () => {
			it('should keep the editor visual refresh headings and paragraph styles', async () => {
				render(
					<BaseTheme baseFontSize={akEditorFullPageDefaultFontSize}>
						<RendererStyleContainer
							appearance="full-page"
							allowNestedHeaderLinks={false}
							useBlockRenderForCodeBlock={false}
						>
							<h1>Heading 1</h1>
							<h2>Heading 2</h2>
							<h3>Heading 3</h3>
							<h4>Heading 4</h4>
							<h5>Heading 5</h5>
							<h6>Heading 6</h6>
							<p>paragraph</p>
						</RendererStyleContainer>
					</BaseTheme>,
				);

				[1, 2, 3, 4, 5, 6].forEach((index) => {
					expect(screen.getByText(`Heading ${index}`)).toHaveStyle(
						`font:var(--ak-renderer-editor-font-heading-h${index})`,
					);
				});
				expect(screen.getByText(`paragraph`)).toHaveStyle(
					`font:var(--ak-renderer-editor-font-normal-text)`,
				);
			});
		});
	});
});
