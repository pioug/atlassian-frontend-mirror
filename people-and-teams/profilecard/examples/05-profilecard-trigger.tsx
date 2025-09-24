import React, { useState } from 'react';

// Simulating import from '@atlaskit/profilecard/user'
import ProfileCardTrigger from '../src/components/User';

import { BlankSpace } from './helper/blank-space';
import ExampleWrapper from './helper/example-wrapper';
import { MainStage } from './helper/main-stage';
import { Section } from './helper/section';
import { getMockProfileClient } from './helper/util';

const mockClient = getMockProfileClient(10, 0);
const mockClientForInactiveAccount = getMockProfileClient(10, 0, {
	status: 'inactive',
});
const mockClientForClosedAccountAndCustomMessage = getMockProfileClient(10, 0, {
	status: 'closed',
	disabledAccountMessage:
		'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
	hasDisabledAccountLozenge: false,
});

const defaultProps = {
	cloudId: 'DUMMY-10ae0bf3-157e-43f7-be45-f1bb13b39048',
	resourceClient: mockClient,
};

export default function Example() {
	const [clickCount, setCount] = useState(0);
	const [externalPropExampleIsVisible, setExternalPropExampleIsVisible] = useState(false);

	return (
		<ExampleWrapper>
			<MainStage>
				<Section>
					<h4>Profilecard triggered by hover</h4>
					<p>
						Input for testing with focus <input type="text" />
					</p>
					<span>
						Lorem ipsum{' '}
						<ProfileCardTrigger
							{...defaultProps}
							userId="1"
							actions={[
								{
									label: 'View profile',
									id: 'view-profile',
									callback: () => {},
								},
							]}
						>
							<strong>hover over me</strong>
						</ProfileCardTrigger>{' '}
						dolor sit amet
					</span>
				</Section>
				<Section>
					<h4>Profilecard triggered by click</h4>
					<span>
						Lorem ipsum{' '}
						<ProfileCardTrigger
							{...defaultProps}
							userId="1"
							trigger="click"
							actions={[
								{
									label: 'View profile',
									id: 'view-profile',
									callback: () => {},
								},
							]}
						>
							<strong>click me</strong>
						</ProfileCardTrigger>{' '}
						dolor sit amet
					</span>
				</Section>

				<Section>
					<h4>Profilecard triggered by external prop</h4>
					<span>
						Lorem ipsum{' '}
						<ProfileCardTrigger
							{...defaultProps}
							userId="1"
							trigger="click"
							isVisible={externalPropExampleIsVisible}
							actions={[
								{
									label: 'View profile',
									id: 'view-profile',
									callback: () => {},
								},
							]}
						>
							<strong>click me</strong>
						</ProfileCardTrigger>{' '}
						dolor sit amet
						<button
							type="button"
							onClick={() => setExternalPropExampleIsVisible(!externalPropExampleIsVisible)}
						>
							Toggle external prop
						</button>
					</span>
				</Section>

				<Section>
					<h4>Profilecard triggered for closed account</h4>
					<span>
						Lorem ipsum{' '}
						<ProfileCardTrigger
							{...defaultProps}
							userId="1"
							resourceClient={getMockProfileClient(10, 0, {
								status: 'closed',
							})}
							trigger="click"
						>
							<strong>click me</strong>
						</ProfileCardTrigger>{' '}
						dolor sit amet
					</span>
				</Section>

				<Section>
					<h4>Profilecard triggered for inactive account</h4>
					<span>
						Lorem ipsum{' '}
						<ProfileCardTrigger
							{...defaultProps}
							userId="1"
							resourceClient={mockClientForInactiveAccount}
							trigger="click"
						>
							<strong>click me</strong>
						</ProfileCardTrigger>{' '}
						dolor sit amet
					</span>
				</Section>

				<Section>
					<h4>Profilecard triggered for customer account</h4>
					<span>
						Lorem ipsum{' '}
						<ProfileCardTrigger
							{...defaultProps}
							userId="3"
							resourceClient={getMockProfileClient(10, 0, {
								accountType: 'customer',
							})}
							trigger="click"
							actions={[
								{
									label: 'View profile',
									id: 'view-profile',
									callback: () => {},
									shouldRender: (data: any) => data && data.accountType !== 'customer',
								},
							]}
						>
							<strong>click me</strong>
						</ProfileCardTrigger>{' '}
						dolor sit amet
					</span>
				</Section>

				<Section>
					<h4>Counting clicks of parent container</h4>
					{/**
					 * If the user clicks on the trigger then we don't want that click
					 * event to propagate out to parent containers. For example when
					 * clicking a mention lozenge in an inline-edit.
					 *
					 * This example has the parent span counting how many times it was
					 * clicked so we can easily verify that it's not triggered when
					 * clicking the profile card trigger.
					 */}
					{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, @atlassian/a11y/interactive-element-not-keyboard-focusable */}
					<span onClick={() => setCount((c) => c + 1)}>
						Lorem ipsum. Parent clicked {clickCount} times!{' '}
						<ProfileCardTrigger
							{...defaultProps}
							userId="1"
							resourceClient={mockClientForClosedAccountAndCustomMessage}
							trigger="click"
						>
							<strong>click me</strong>
						</ProfileCardTrigger>{' '}
						dolor sit amet
					</span>
				</Section>

				<Section>
					<h4>
						Profilecard triggered for closed account and custom message and not show status lozenge
					</h4>
					<span>
						Lorem ipsum{' '}
						<ProfileCardTrigger
							{...defaultProps}
							userId="1"
							resourceClient={mockClientForClosedAccountAndCustomMessage}
							trigger="click"
						>
							<strong>click me</strong>
						</ProfileCardTrigger>{' '}
						dolor sit amet
					</span>
				</Section>

				<Section>
					<h4>Profilecard trigger hidden from screen readers</h4>
					<span>
						Lorem ipsum{' '}
						<ProfileCardTrigger
							{...defaultProps}
							userId="1"
							actions={[
								{
									label: 'View profile',
									id: 'view-profile',
									callback: () => {},
								},
							]}
							ariaHideProfileTrigger
						>
							<strong>hover over me</strong>
						</ProfileCardTrigger>
						{' or '}
						<ProfileCardTrigger
							{...defaultProps}
							userId="3"
							resourceClient={getMockProfileClient(10, 0, {
								accountType: 'customer',
							})}
							trigger="click"
							actions={[
								{
									label: 'View profile',
									id: 'view-profile',
									callback: () => {},
									shouldRender: (data: any) => data && data.accountType !== 'customer',
								},
							]}
							ariaHideProfileTrigger
						>
							<strong>click me</strong>
						</ProfileCardTrigger>{' '}
						dolor sit amet
					</span>
				</Section>

				<BlankSpace>Scroll down to test focus behaviour</BlankSpace>

				<Section>
					<ProfileCardTrigger
						{...defaultProps}
						userId="1"
						actions={[
							{
								label: 'View profile',
								id: 'view-profile',
								callback: () => {},
							},
						]}
					>
						<strong>Hover me.</strong>
					</ProfileCardTrigger>{' '}
					|||{' '}
					<ProfileCardTrigger
						{...defaultProps}
						userId="1"
						trigger="click"
						actions={[
							{
								label: 'View profile',
								id: 'view-profile',
								callback: () => {},
							},
						]}
					>
						<strong>Click me.</strong>
					</ProfileCardTrigger>
				</Section>
			</MainStage>
		</ExampleWrapper>
	);
}
