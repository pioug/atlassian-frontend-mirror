/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { SmartLinkActionType } from '@atlaskit/linking-types';
import { token } from '@atlaskit/tokens';

import { overrideEmbedContent } from './common';

const horizontalWrapperStyles = css({
	display: 'flex',
	flexWrap: 'wrap',
	gap: token('space.050'),
	paddingTop: token('space.050'),
	paddingRight: token('space.050'),
	paddingBottom: token('space.050'),
	paddingLeft: token('space.050'),
});

export type VRTestWrapperOptions = {
	title: string;
	children: React.ReactNode;
	height?: number;
};

// Mocking Date.now for tests to be consistent
Date.now = () => new Date('2022-01-25T16:44:00.000+1000').getTime();

type HorizontalWrapperProps = {
	children: React.ReactNode;
};

export const HorizontalWrapper = ({ children }: HorizontalWrapperProps) => (
	<div css={horizontalWrapperStyles}>{children}</div>
);

export const LozengeActionExample = {
	read: {
		action: {
			actionType: SmartLinkActionType.GetStatusTransitionsAction,
			resourceIdentifiers: {
				issueKey: 'some-id',
				hostname: 'some-hostname',
			},
		},
		providerKey: 'object-provider',
	},
	update: {
		action: {
			actionType: SmartLinkActionType.StatusUpdateAction,
			resourceIdentifiers: {
				issueKey: 'some-id',
				hostname: 'some-hostname',
			},
		},
		providerKey: 'object-provider',
	},
};

export const LozengeActionWithPreviewExample = {
	read: {
		...LozengeActionExample.read,
	},
	update: {
		action: { ...LozengeActionExample.update.action },
		providerKey: LozengeActionExample.update.providerKey,
		details: {
			id: 'some-link-id',
			url: 'some-link-url',
			previewData: {
				providerName: 'Jira',
				title: 'This is a visual regression test for embed modal',
				src: overrideEmbedContent,
				url: 'link-url',
			},
		},
	},
};
