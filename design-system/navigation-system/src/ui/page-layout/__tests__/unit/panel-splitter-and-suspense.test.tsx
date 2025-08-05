import React from 'react';

import { toBeSuspendable } from '@af/react-unit-testing';

import { PanelSplitter } from '../../panel-splitter/panel-splitter';
import { Root } from '../../root';
import { SideNav } from '../../side-nav/side-nav';
import { SideNavContent } from '../../side-nav/side-nav-content';

import {
	filterFromConsoleErrorOutput,
	parseCssErrorRegex,
	type ResetConsoleErrorFn,
	resetMatchMedia,
} from './_test-utils';

let resetConsoleErrorSpyFn: ResetConsoleErrorFn;
beforeAll(() => {
	resetConsoleErrorSpyFn = filterFromConsoleErrorOutput(parseCssErrorRegex);
});

afterAll(() => {
	resetConsoleErrorSpyFn();
});

beforeEach(() => {
	resetMatchMedia();
});

expect.extend({
	toBeSuspendable,
});

test('panel splitter works with suspense', async () => {
	expect(() => (
		<Root>
			<SideNav>
				<SideNavContent>Side navigation content</SideNavContent>
				<PanelSplitter label="Resize side nav" />
			</SideNav>
		</Root>
	)).toBeSuspendable();
});
