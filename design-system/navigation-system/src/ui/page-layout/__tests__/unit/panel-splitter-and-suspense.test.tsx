import React from 'react';

import { PanelSplitter } from '../../panel-splitter/panel-splitter';
import { Root } from '../../root';
import { SideNav } from '../../side-nav/side-nav';
import { SideNavContent } from '../../side-nav/side-nav-content';

import {
	filterFromConsoleErrorOutput,
	parseCssErrorRegex,
	type ResetConsoleErrorFn,
	resetMatchMedia,
	runSuspenseTest,
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

test('panel splitter works with suspense', async () => {
	await runSuspenseTest(
		<Root>
			<SideNav>
				<SideNavContent>Side navigation content</SideNavContent>
				<PanelSplitter label="Resize side nav" />
			</SideNav>
		</Root>,
	);
});
