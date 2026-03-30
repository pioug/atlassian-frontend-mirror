/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const articleFrameStyles = css({
	display: 'block',
	width: `calc(100% + ${token('space.150')})`,
	marginTop: token('space.negative.050'),
	marginRight: token('space.negative.050'),
	marginBottom: token('space.negative.050'),
	marginLeft: token('space.negative.050'),
	border: 'none',
});

export const ArticleFrame = ({
	id,
	name,
	onLoad,
	sandbox,
}: {
	id: string;
	name: string;
	onLoad: () => void;
	sandbox: string;
}): JSX.Element => (
	<iframe
		css={articleFrameStyles}
		id={id}
		name={name}
		title={name}
		onLoad={onLoad}
		sandbox={sandbox}
	/>
);
