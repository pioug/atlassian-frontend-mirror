import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import TeamAvatar from '../src/ui/teams-avatar';

const styles = cssMap({
	stack: {
		marginTop: token('space.400'),
		paddingTop: token('space.400'),
		paddingRight: token('space.400'),
		paddingBottom: token('space.400'),
		paddingLeft: token('space.400'),
	},
});

const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'];

export default function TeamAvatarExample(): React.JSX.Element {
	return (
		<Stack space="space.200" xcss={styles.stack} alignInline="start">
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
						src="https://teams-directory-frontend.stg-east.frontend.public.atl-paas.net/assets/teams/avatars/v4/blue_4.svg"
					/>
				))}
				<span>Next avatar</span>
			</Inline>
		</Stack>
	);
}
