/**
 * @jsx jsx
 */

import AvatarGroup from '@atlaskit/avatar-group';
import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { appearances, RANDOM_USERS } from '../examples-util/data';
import { ExampleGroup } from '../examples-util/helpers';

const styles = cssMap({
	container: { maxWidth: '270px', backgroundColor: token('elevation.surface.sunken') },
});

const data = RANDOM_USERS.map((d, i) => ({
	key: d.email,
	name: d.name,
	appearance: appearances[i % appearances.length],
}));

const _default: () => JSX.Element = () => {
	return (
		<div css={styles.container}>
			<ExampleGroup heading="Display as a Stack">
				<AvatarGroup
					appearance="stack"
					onAvatarClick={console.log}
					data={data}
					size="large"
					testId="stack"
				/>
			</ExampleGroup>

			<ExampleGroup heading="Display as a Grid">
				<AvatarGroup
					appearance="grid"
					onAvatarClick={console.log}
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
