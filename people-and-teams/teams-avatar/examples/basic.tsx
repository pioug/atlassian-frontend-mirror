import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline, Stack, xcss } from '@atlaskit/primitives';

import TeamAvatar from '../src/ui/teams-avatar';

const style = xcss({
	marginTop: 'space.400',
	padding: 'space.400',
});

const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'];

export default function TeamAvatarExample() {
	return (
		<Stack space="space.200" xcss={style} alignInline="start">
			<Inline alignBlock="center">
				{sizes.map((size) => (
					<TeamAvatar size={size as any} />
				))}
				<span>Fallback</span>
			</Inline>
			<Inline alignBlock="center">
				{sizes.map((size) => (
					<TeamAvatar
						size={size as any}
						src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABACAMAAACqVYydAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAGBQTFRF/zX7+DP73i77uyb8kR78ZhX9PQz+GwX+/jT78jL71Sz7ryT8hRv8WhL9Mwr+EwT+/TT76jD7yyr7pCL8eRn9ThD9KQj+DAL/+jT74i/7wCj8lx/8bBb9Qw3+IAb+BgH/HFKiKQAAAIBJREFUeJztzjkOggAAAEEEORTkFOQS/v9L+u1INDQ7L5ggOOkGIURwhxgSSOHsz6BBgwYNGjRo0OBvgxk84Ak5FPCCEiowaNCgQYMGDRo0eG2whgZa6OANPQzwAYMGDRo0aNCgQYPXBkeYYIYFVvjCBjsYNGjQoEGDBg0a/GvwADIe8BAKQVCtAAAAAElFTkSuQmCC"
					/>
				))}
				<span>With custom Avatar url</span>
			</Inline>
			<Inline alignBlock="center" space="space.050">
				{sizes.map((size) => (
					<TeamAvatar
						// any for examples ONLY
						size={size as any}
						src="https://ptc-directory-sited-static.us-east-1.staging.public.atl-paas.net/teams/avatars/v4/blue_4.svg"
					/>
				))}
				<span>Next avatar</span>
			</Inline>
		</Stack>
	);
}
