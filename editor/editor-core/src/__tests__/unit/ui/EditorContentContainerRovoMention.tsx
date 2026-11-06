/* eslint-disable @atlaskit/ui-styling-standard/no-classname-prop -- Fixture mirrors mention NodeView run-state classes. */
import React from 'react';

import { useThemeObserver } from '@atlaskit/tokens/use-theme-observer';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import EditorContentContainer from '../../../ui/EditorContentContainer/EditorContentContainer';

jest.mock('@atlaskit/tokens/use-theme-observer', () => ({ useThemeObserver: jest.fn() }));

const getAppliedRovoStyles = (element: HTMLElement): string =>
	Array.from(document.querySelectorAll('style'))
		.flatMap((style) =>
			Array.from((style.textContent ?? '').matchAll(/([^{}]+)\{([^{}]*)\}/gu))
				.filter(
					([, selector]) =>
						selector.includes('.mention-rovo-chat') && element.matches(selector.trim()),
				)
				.map(([, , body]) => body),
		)
		.join('');

it.each([
	{ colorMode: 'light', mentions: true, visuals: true, pill: '#2b2c2f', text: '#cecfd2' },
	{ colorMode: 'dark', mentions: true, visuals: true, pill: '#ebebeb', text: '#292a2e' },
	{ colorMode: 'light', mentions: true, visuals: false, pill: undefined, text: undefined },
	{ colorMode: 'dark', mentions: true, visuals: false, pill: undefined, text: undefined },
	{ colorMode: 'light', mentions: false, visuals: true, pill: '#2b2c2f', text: '#cecfd2' },
	{ colorMode: 'dark', mentions: false, visuals: true, pill: '#ebebeb', text: '#292a2e' },
] as const)(
	'gates $colorMode Rovo shimmer with visuals=$visuals independently of mentions=$mentions',
	({ colorMode, mentions, visuals, pill, text }) => {
		(mentions ? mockExpEnabled : mockExpDisabled)('platform_editor_mention_rovo');
		(visuals ? mockExpEnabled : mockExpDisabled)('platform_editor_mention_rovo_special_visual');
		jest
			.mocked(useThemeObserver)
			.mockReturnValue({ colorMode } as ReturnType<typeof useThemeObserver>);
		render(
			<EditorContentContainer appearance="full-page" viewMode="edit">
				<div className="ProseMirror">
					<div className="agent-mention-analysing-state">
						<span className="editor-mention-primitive mention-rovo-chat" data-testid="rovo-pill">
							<span className="editor-mention-text" data-testid="rovo-text">
								Rovo
							</span>
						</span>
					</div>
				</div>
			</EditorContentContainer>,
		);
		const pillStyles = getAppliedRovoStyles(screen.getByTestId('rovo-pill')).toLowerCase();
		const textStyles = getAppliedRovoStyles(screen.getByTestId('rovo-text')).toLowerCase();
		expect(pillStyles.includes(pill ?? 'linear-gradient')).toBe(visuals);
		expect(textStyles.includes(text ?? 'linear-gradient')).toBe(visuals);
	},
);
