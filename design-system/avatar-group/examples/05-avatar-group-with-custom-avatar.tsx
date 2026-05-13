/**
 * @jsx jsx
 */
import Avatar from '@atlaskit/avatar';
import AvatarGroup, { type AvatarProps } from '@atlaskit/avatar-group';
import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { appearances } from '../examples-util/appearances';
import { ExampleGroup } from '../examples-util/helpers';
import { RANDOM_USERS } from '../examples-util/random-users';

const styles = cssMap({
	container: { maxWidth: '270px', backgroundColor: token('elevation.surface.sunken') },
});

const data = RANDOM_USERS.map((d, i) => ({
	key: d.email,
	name: d.name,
	appearance: appearances[i % appearances.length],
}));

const CustomAvatar = (props: AvatarProps) => {
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	return <Avatar {...props} borderColor={token('color.border.focused')} />;
};

const _default: () => JSX.Element = () => {
	return (
		<div css={styles.container}>
			<ExampleGroup heading="Display as a Stack">
				<AvatarGroup
					appearance="stack"
					onAvatarClick={console.log}
					avatar={CustomAvatar}
					data={data}
					size="large"
					testId="stack"
				/>
			</ExampleGroup>

			<ExampleGroup heading="Display as a Grid">
				<AvatarGroup
					appearance="grid"
					onAvatarClick={console.log}
					avatar={CustomAvatar}
					data={data}
					maxCount={14}
					size="large"
					testId="grid"
				/>
			</ExampleGroup>
		</div>
	);
};
export default _default;
