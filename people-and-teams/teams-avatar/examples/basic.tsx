import React from 'react';

import { selectField } from '@atlassian/teams-app-internal-playground/fields';
import {
	Playground,
	type PlaygroundConfig,
} from '@atlassian/teams-app-internal-playground/playground';

import TeamAvatar from '../src/ui/teams-avatar';

const IMAGE_SOURCES = {
	fallback: '-',
	custom:
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABACAMAAACqVYydAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAGBQTFRF/zX7+DP73i77uyb8kR78ZhX9PQz+GwX+/jT78jL71Sz7ryT8hRv8WhL9Mwr+EwT+/TT76jD7yyr7pCL8eRn9ThD9KQj+DAL/+jT74i/7wCj8lx/8bBb9Qw3+IAb+BgH/HFKiKQAAAIBJREFUeJztzjkOggAAAEEEORTkFOQS/v9L+u1INDQ7L5ggOOkGIURwhxgSSOHsz6BBgwYNGjRo0OBvgxk84Ak5FPCCEiowaNCgQYMGDRo0eG2whgZa6OANPQzwAYMGDRo0aNCgQYPXBkeYYIYFVvjCBjsYNGjQoEGDBg0a/GvwADIe8BAKQVCtAAAAAElFTkSuQmCC',
	nextAvatar:
		'https://teams-directory-frontend.stg-east.frontend.public.atl-paas.net/assets/teams/avatars/v4/blue_4.svg',
} as const;

const config = {
	fields: [
		selectField({
			id: 'size',
			label: 'Size',
			type: 'select',
			defaultValue: 'medium',
			options: [
				{ label: 'xsmall', value: 'xsmall' },
				{ label: 'small', value: 'small' },
				{ label: 'medium', value: 'medium' },
				{ label: 'large', value: 'large' },
				{ label: 'xlarge', value: 'xlarge' },
				{ label: 'xxlarge', value: 'xxlarge' },
			],
		}),
		selectField({
			id: 'image-source',
			label: 'Image source',
			type: 'select',
			defaultValue: '-',
			options: [
				{ label: 'Fallback', value: '-' },
				{ label: 'Custom avatar', value: IMAGE_SOURCES.custom },
				{ label: 'Next avatar', value: IMAGE_SOURCES.nextAvatar },
			],
		}),
	],
} satisfies PlaygroundConfig;

export default function TeamAvatarExample() {
	return (
		<Playground config={config}>
			{({ size, imageSource }) => (
				<TeamAvatar size={size} src={imageSource === '-' ? undefined : imageSource} />
			)}
		</Playground>
	);
}
