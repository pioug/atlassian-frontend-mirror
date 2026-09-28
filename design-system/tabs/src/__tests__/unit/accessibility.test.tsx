import React from 'react';

import { act, render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import CustomTabs from '../../../examples/constellation/tab-custom';
import ControlledTabs from '../../../examples/constellation/tabs-controlled';
import DefaultTabs from '../../../examples/constellation/tabs-default';

const motionGate = 'platform-dst-motion-uplift-tab';

it('Tabs should pass axe audit', async () => {
	failGate(motionGate);
	const { container } = render(<DefaultTabs />);
	await axe(container);
});

it('Tabs with motion should pass axe audit', async () => {
	passGate(motionGate);
	const { container, unmount } = render(<DefaultTabs />);
	await act(async () => {
		await axe(container);
	});
	unmount();
});

it('Controlled tabs should pass axe audit', async () => {
	failGate(motionGate);
	const { container } = render(<ControlledTabs />);
	await axe(container);
});

it('Custom tabs should pass axe audit', async () => {
	failGate(motionGate);
	const { container } = render(<CustomTabs />);
	await axe(container);
});

it('Custom tabs with motion should pass axe audit', async () => {
	passGate(motionGate);
	const { container, unmount } = render(<CustomTabs />);
	await act(async () => {
		await axe(container);
	});
	unmount();
});
