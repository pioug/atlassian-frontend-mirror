import React, { useCallback } from 'react';

import Button from '@atlaskit/button/new';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Box } from '@atlaskit/primitives';

import { Card, CardAction } from '../../src';
import { useSmartLinkActions } from '../../src/hooks';
import { ResolvedClient, ResolvedClientUrl } from '../utils/custom-client';

import ExampleContainer from './example-container';

const PreviewButton = ({ url }: { url: string }) => {
	const actions = useSmartLinkActions({ url, appearance: 'block' });

	// actions are returned in an array, find the preview action
	const previewAction = actions.find((action) => action.id === 'preview-content');

	const handleClick = useCallback(() => {
		if (previewAction) {
			previewAction.invoke();
		}
	}, [previewAction]);

	if (!previewAction) {
		return null;
	}

	return <Button onClick={handleClick}>{previewAction.text}</Button>;
};

const UseSmartLinkActionsExample = () => (
	<ExampleContainer>
		<SmartCardProvider client={new ResolvedClient()}>
			<Card
				appearance="block"
				url={ResolvedClientUrl}
				actionOptions={{ hide: false, exclude: [CardAction.PreviewAction] }}
			/>

			<Box paddingBlockStart="space.200">
				<PreviewButton url={ResolvedClientUrl} />
			</Box>
		</SmartCardProvider>
	</ExampleContainer>
);

export default UseSmartLinkActionsExample;
