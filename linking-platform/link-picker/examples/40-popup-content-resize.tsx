import React, { Fragment, useCallback, useRef, useState } from 'react';

import Button from '@atlaskit/button';
import NewButton from '@atlaskit/button/new';
import { fg } from '@atlaskit/platform-feature-flags';
import Popup from '@atlaskit/popup';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';

import { PageHeader, PageWrapper } from '../example-helpers/common';
import LinkPicker, { type LinkPickerState } from '../src';
import { MockLinkPickerPromisePlugin } from '../src/__tests__/__helpers/mock-plugins';

/**
 * Plugin that returns a set of results with same length as the query string
 */
class Plugin extends MockLinkPickerPromisePlugin {
	async resolve(state: LinkPickerState) {
		const result = await super.resolve(state);

		await new Promise((resolve) => {
			setTimeout(resolve, 1000);
		});

		return {
			data: result.data.slice(0, state.query.length),
		};
	}
}

const noop = () => {};

function TestContentResize() {
	const [isOpen, setIsOpen] = useState(false);
	const handleToggle = useCallback(() => setIsOpen((prev) => !prev), []);
	const [isUpdateOn, setIsUpdateOn] = useState(false);
	const [isAdaptiveHeight, setIsAdaptiveHeight] = useState(false);
	const plugins = useRef([new Plugin()]);

	const ButtonComponent = fg('platform-link-picker-remove-legacy-button') ? NewButton : Button;
	return (
		<Fragment>
			<PageHeader>
				<h1>Popup Content Resize Test Example</h1>
				<p>
					In this example the link picker will return as many results as the length of your search
					term (max of 5).
				</p>
				<p>
					Experiment with different numbers of results by searching with different search query
					lengths to see how the content resizing impacts the positioning of the popup, with and
					without provision of the update method.
				</p>
				<p>
					The popup trigger is position fixed in a way that the picker should ordinarily be
					off-screen when a full set of results are loaded.
				</p>
			</PageHeader>
			<Stack space="space.200">
				<Box>
					<Toggle
						id="provide-updateFn-toggle"
						testId="provide-updateFn-toggle"
						size="large"
						isChecked={isUpdateOn}
						onChange={() => setIsUpdateOn((prev) => !prev)}
					/>
					<label htmlFor="provide-updateFn-toggle">Updates {isUpdateOn ? 'on' : 'off'}</label>
				</Box>
				<Box>
					<Toggle
						id="provide-adaptiveHeight-toggle"
						testId="provide-adaptiveHeight-toggle"
						size="large"
						isChecked={isAdaptiveHeight}
						onChange={() => setIsAdaptiveHeight((prev) => !prev)}
					/>
					<label htmlFor="provide-adaptiveHeight-toggle">
						Adaptive Height {isAdaptiveHeight ? 'on' : 'off'}
					</label>
				</Box>
			</Stack>
			<Popup
				isOpen={isOpen}
				autoFocus={false}
				onClose={handleToggle}
				content={({ update }) => (
					<LinkPicker
						plugins={plugins.current}
						onSubmit={handleToggle}
						onCancel={handleToggle}
						onContentResize={isUpdateOn ? update : noop}
						adaptiveHeight={isAdaptiveHeight}
					/>
				)}
				placement="right-start"
				trigger={({ ref, ...triggerProps }) => (
					<ButtonComponent
						{...triggerProps}
						testId="trigger"
						ref={ref}
						appearance="primary"
						isSelected={isOpen}
						onClick={handleToggle}
						// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ position: 'fixed', bottom: 350 }}
					>
						Toggle
					</ButtonComponent>
				)}
				shouldRenderToParent={fg('should-render-to-parent-should-be-true-linking-pla')}
			/>
		</Fragment>
	);
}

export default function TestContentResizeWrapper() {
	return (
		<PageWrapper>
			<TestContentResize />
		</PageWrapper>
	);
}
