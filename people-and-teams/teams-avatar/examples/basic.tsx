import React from 'react';

import { Inline, Stack, xcss } from '@atlaskit/primitives';

import TeamAvatar from '../src/ui/teams-avatar';

const style = xcss({
	marginTop: 'space.400',
	padding: 'space.400',
});

export default function TeamAvatarExample() {
	return (
		<Stack space="space.200" xcss={style} alignInline="start">
			<Inline alignBlock="center">
				<TeamAvatar />
				<span>Fallback</span>
			</Inline>
			<Inline alignBlock="center">
				<TeamAvatar src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABACAMAAACqVYydAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAGBQTFRF/zX7+DP73i77uyb8kR78ZhX9PQz+GwX+/jT78jL71Sz7ryT8hRv8WhL9Mwr+EwT+/TT76jD7yyr7pCL8eRn9ThD9KQj+DAL/+jT74i/7wCj8lx/8bBb9Qw3+IAb+BgH/HFKiKQAAAIBJREFUeJztzjkOggAAAEEEORTkFOQS/v9L+u1INDQ7L5ggOOkGIURwhxgSSOHsz6BBgwYNGjRo0OBvgxk84Ak5FPCCEiowaNCgQYMGDRo0eG2whgZa6OANPQzwAYMGDRo0aNCgQYPXBkeYYIYFVvjCBjsYNGjQoEGDBg0a/GvwADIe8BAKQVCtAAAAAElFTkSuQmCC" />
				<span>With custom Avatar url</span>
			</Inline>
			<Inline alignBlock="center">
				<TeamAvatar src="https://ptc-directory-sited-static.us-east-1.staging.public.atl-paas.net/teams/avatars/v4/blue_4.svg" />
				<span>Next avatar</span>
			</Inline>

			<Inline alignBlock="center">
				<TeamAvatar size="xsmall" />
				<span>Fallback small</span>
			</Inline>
		</Stack>
	);
}
