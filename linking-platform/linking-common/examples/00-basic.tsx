/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Pulse from '../src/components/Pulse';
import Skeleton, { SpanSkeleton } from '../src/components/Skeleton';

const styles = css({
	display: 'flex',
	width: '100%',
	height: '100%',
	alignItems: 'center',
	flexDirection: 'column',
});

const headingPadding = css({
	marginBottom: '10px',
});

const rowStyle = css({
	display: 'flex',
	gap: '16px',
});

export default function Component(): JSX.Element {
	return (
		<div css={styles}>
			<h1 css={headingPadding}>Pulse</h1>
			<Pulse showPulse={true}>
				<div>There is a pulse around this text</div>
			</Pulse>
			<h1 css={headingPadding}>Skeleton Default</h1>
			<Skeleton width={50} height={50} />
			<h1 css={headingPadding}>Skeleton Coloured</h1>
			<div css={rowStyle}>
				<Skeleton width={50} height={50} appearance="blue" />
				<Skeleton width={50} height={50} appearance="gray" />
				<Skeleton width={50} height={50} appearance="darkGray" />
			</div>
			<h1 css={headingPadding}>Skeleton No Shimmer</h1>
			<div css={rowStyle}>
				<Skeleton width={50} height={50} appearance="blue" isShimmering={false} />
				<Skeleton width={50} height={50} appearance="gray" isShimmering={false} />
				<Skeleton width={50} height={50} appearance="darkGray" isShimmering={false} />
			</div>
			<h1 css={headingPadding}>Span Skeleton Default</h1>
			<SpanSkeleton width={50} height={50} />
			<h1 css={headingPadding}>Span Skeleton Coloured</h1>
			<div css={rowStyle}>
				<SpanSkeleton width={50} height={50} appearance="blue" />
				<SpanSkeleton width={50} height={50} appearance="gray" />
				<SpanSkeleton width={50} height={50} appearance="darkGray" />
			</div>
			<h1 css={headingPadding}>Span Skeleton No Shimmer</h1>
			<div css={rowStyle}>
				<SpanSkeleton width={50} height={50} appearance="blue" isShimmering={false} />
				<SpanSkeleton width={50} height={50} appearance="gray" isShimmering={false} />
				<SpanSkeleton width={50} height={50} appearance="darkGray" isShimmering={false} />
			</div>
			<h1 css={headingPadding}>Skeleton Style Override</h1>
			<Skeleton
				width={50}
				height={50}
				appearance="blue"
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					boxShadow: '10px 5px 5px red',
				}}
			/>
		</div>
	);
}
