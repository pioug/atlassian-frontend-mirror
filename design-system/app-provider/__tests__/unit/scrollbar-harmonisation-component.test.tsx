import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { waitFor } from '@atlassian/testing-library/wait-for';

import { ScrollbarHarmonisation } from '../../src/scrollbar-harmonisation/scrollbar-harmonisation';
import { useScrollbarHarmonisation } from '../../src/scrollbar-harmonisation/use-scrollbar-harmonisation';

const attribute = 'data-scrollbar-harmonisation';
const transparentAttribute = 'data-scrollbar-harmonisation-transparent';

function ScrollbarHarmonisationHookHarness({ isEnabled }: { isEnabled: boolean }): null {
	useScrollbarHarmonisation(isEnabled);
	return null;
}

afterEach(() => {
	document.documentElement.removeAttribute(attribute);
	document.documentElement.removeAttribute(transparentAttribute);
	jest.resetAllMocks();
});

describe('ScrollbarHarmonisation', () => {
	it('does not install the appearance when the gate is off', () => {
		failGate('platform_dst_scrollbar_harmonisation');

		render(<ScrollbarHarmonisation />);

		expect(document.documentElement).not.toHaveAttribute(attribute);
	});

	it('installs and cleans up the appearance when the gate is on', async () => {
		passGate('platform_dst_scrollbar_harmonisation');

		const { unmount } = render(<ScrollbarHarmonisation />);

		await waitFor(() => {
			expect(document.documentElement).toHaveAttribute(attribute);
		});

		unmount();

		await waitFor(() => {
			expect(document.documentElement).not.toHaveAttribute(attribute);
		});
	});

	it('uses only the main attribute for transparent tracks', () => {
		passGate('platform_dst_scrollbar_harmonisation');

		render(<ScrollbarHarmonisation />);

		expect(document.documentElement).toHaveAttribute(attribute);
		expect(document.documentElement).not.toHaveAttribute(transparentAttribute);
	});

	it('installs only the main attribute without evaluating the obsolete transparent gate', () => {
		passGate('platform_dst_scrollbar_harmonisation');

		render(<ScrollbarHarmonisation />);

		expect(document.documentElement).toHaveAttribute(attribute);
		expect(document.documentElement).not.toHaveAttribute(transparentAttribute);
		expect(fg).not.toHaveBeenCalledWith('platform_dst_scrollbar_harmonisation_transparent');
	});

	it('does not install an obsolete transparency attribute when disabled', () => {
		failGate('platform_dst_scrollbar_harmonisation');

		render(<ScrollbarHarmonisation />);

		expect(document.documentElement).not.toHaveAttribute(attribute);
		expect(document.documentElement).not.toHaveAttribute(transparentAttribute);
	});
});

describe('useScrollbarHarmonisation', () => {
	it('does not install transparent track styling when the base gate is off despite an enabled override', () => {
		failGate('platform_dst_scrollbar_harmonisation');

		render(<ScrollbarHarmonisationHookHarness isEnabled />);

		expect(document.documentElement).toHaveAttribute(attribute);
		expect(document.documentElement).not.toHaveAttribute(transparentAttribute);
	});

	it('respects an explicit enabled override when the gate is off', async () => {
		failGate('platform_dst_scrollbar_harmonisation');

		const { unmount } = render(<ScrollbarHarmonisationHookHarness isEnabled />);

		await waitFor(() => {
			expect(document.documentElement).toHaveAttribute(attribute);
		});

		unmount();
	});

	it('respects an explicit disabled override when the gate is on', () => {
		passGate('platform_dst_scrollbar_harmonisation');

		render(<ScrollbarHarmonisationHookHarness isEnabled={false} />);

		expect(document.documentElement).not.toHaveAttribute(attribute);
	});
});
