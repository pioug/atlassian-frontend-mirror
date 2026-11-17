import React from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import { Dialog } from '../../src/dialog/dialog-content';
import { isNativeElementOpen } from '../../src/internal/is-native-element-open';
import { Popover } from '../../src/popover/popover';

/**
 * Consumer tests often stub `getDocument()` with a partial document (for example, only
 * `execCommand`). A layer must still show, and a content `autoFocus` must still work.
 */
jest.mock('@atlaskit/browser-apis', () => ({
	...jest.requireActual('@atlaskit/browser-apis'),
	getDocument: () => ({ execCommand: () => true }),
}));

function noop() {}

describe('show with a stubbed `getDocument()`', () => {
	it('Popover: shows, and content `autoFocus` takes focus', () => {
		render(
			<Popover isOpen onClose={noop} role="dialog" label="layer" testId="layer">
				<button type="button" data-testid="target" autoFocus>
					Target
				</button>
			</Popover>,
		);

		expect(isNativeElementOpen({ element: screen.getByTestId('layer') })).toBe(true);
		expect(screen.getByTestId('target')).toHaveFocus();
	});

	it('Dialog: shows, and content `autoFocus` takes focus', () => {
		render(
			<Dialog isOpen onClose={noop} label="layer" testId="layer">
				<button type="button" data-testid="target" autoFocus>
					Target
				</button>
			</Dialog>,
		);

		expect(isNativeElementOpen({ element: screen.getByTestId('layer') })).toBe(true);
		expect(screen.getByTestId('target')).toHaveFocus();
	});
});
