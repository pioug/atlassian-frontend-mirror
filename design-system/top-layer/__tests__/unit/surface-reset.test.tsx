import React from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { Dialog } from '../../src/dialog/dialog-content';
import { Popover } from '../../src/popover';

/**
 * The `Popover` and `Dialog` hosts apply a surface reset, so that content in the
 * top layer does not pick up UA or trigger styles that the portal path never had.
 *
 * **Colour**: the UA stylesheet gives `[popover]` and `dialog` `color: CanvasText`,
 * so the host never inherits a text colour. The reset restores the `color.text`
 * that `<body>` gave the portal path, for content that sets no colour of its own.
 */
function renderPopover(): HTMLElement {
	render(
		<Popover isOpen testId="popover">
			<div>content</div>
		</Popover>,
	);
	return screen.getByTestId('popover');
}

function renderDialog(): HTMLElement {
	render(
		<Dialog onClose={() => {}} isOpen label="Test dialog" testId="dialog">
			<div>content</div>
		</Dialog>,
	);
	return screen.getByTestId('dialog');
}

const hosts = [
	{ name: 'popover', renderHost: renderPopover },
	{ name: 'dialog', renderHost: renderDialog },
];

// The reset sits under the host specificity boost (see `styles.root` in `popover.tsx`).
const boostTarget = { target: ':defined:defined:defined' };

const resetProperties: [string, string][] = [
	['pointer-events', 'auto'],
	['white-space', 'normal'],
	['word-break', 'normal'],
	['overflow-wrap', 'normal'],
	['text-align', 'start'],
	['text-indent', '0'],
	['text-transform', 'none'],
];

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage -- style assertions only
describe('surface reset', () => {
	describe.each(hosts)('$name host', ({ renderHost }) => {
		it('should apply the default text colour', () => {
			expect(renderHost()).toHaveCompiledCss('color', 'var(--ds-text,#292a2e)', boostTarget);
		});

		it.each(resetProperties)('should apply `%s: %s`', (property, value) => {
			expect(renderHost()).toHaveCompiledCss(property, value, boostTarget);
		});
	});
});
