import React from 'react';
import type { DocNode } from '@atlaskit/adf-schema';
import { ReactRenderer as Renderer } from '@atlaskit/renderer';
import { document } from '@atlaskit/util-data-test/task-decision-story-data';

import { DecisionItem } from '../src';
import { dumpRef } from '../example-helpers/story-utils';

export default () => (
	<div>
		<h3>Simple DecisionItem</h3>
		<DecisionItem contentRef={dumpRef}>
			Hello <b>world</b>.
		</DecisionItem>

		<h3>Long DecisionItem</h3>
		<DecisionItem contentRef={dumpRef}>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
			laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
			voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
			non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		</DecisionItem>

		<h3>Simple DecisionItem with renderer</h3>
		<DecisionItem contentRef={dumpRef}>
			<Renderer document={document as DocNode} />
		</DecisionItem>

		<h3>Simple DecisionItem with placeholder</h3>
		<DecisionItem contentRef={dumpRef} showPlaceholder={true} placeholder="Placeholder text" />
	</div>
);
