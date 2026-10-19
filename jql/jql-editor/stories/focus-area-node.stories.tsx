import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { withIntlProvider } from '@atlassian/platform-storybook-helpers/intl-provider';

import { FocusAreaNode } from '../src/plugins/rich-inline-nodes/nodes/focus-area/focus-area-node';

const meta: Meta<typeof FocusAreaNode> = {
	title: 'JQL Editor/Focus Area Node',
	component: FocusAreaNode,
	args: {
		id: 'focus-area-1',
		fieldName: 'focusArea',
		name: 'Cloud Migration 2026',
		selected: false,
		error: false,
	},
	decorators: [withIntlProvider()],
};

export default meta;

type Story = StoryObj<typeof FocusAreaNode>;

export const Basic: Story = {
	render: (props) => <FocusAreaNode {...props} />,
};

export const Selected: Story = {
	args: { selected: true },
};

export const Error: Story = {
	args: { error: true },
};
