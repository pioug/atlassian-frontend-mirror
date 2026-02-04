/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import Skeleton from '@atlaskit/tile/skeleton';
import { token } from '@atlaskit/tokens';

export default (): JSX.Element => (
	<Stack space="space.200">
		<Heading size="small">Tile Skeleton</Heading>

		<div>
			<Heading size="xsmall">Standard</Heading>
			<Inline space="space.100" alignBlock="end">
				<Skeleton size="xsmall" testId="skeleton" />
				<Skeleton size="small" testId="skeleton" />
				<Skeleton size="medium" testId="skeleton" />
				<Skeleton size="large" testId="skeleton" />
				<Skeleton size="xlarge" testId="skeleton" />
			</Inline>
		</div>
		<div>
			<Heading size="xsmall">Shimmering</Heading>
			<Inline space="space.100" alignBlock="end">
				<Skeleton size="xsmall" isShimmering testId="skeleton-shimmering" />
				<Skeleton size="small" isShimmering testId="skeleton-shimmering" />
				<Skeleton size="medium" isShimmering testId="skeleton-shimmering" />
				<Skeleton size="large" isShimmering testId="skeleton-shimmering" />
				<Skeleton size="xlarge" isShimmering testId="skeleton-shimmering" />
			</Inline>
		</div>
		<div>
			<Heading size="xsmall">Custom Shimmering</Heading>
			<Inline space="space.100" alignBlock="end">
				<Skeleton
					size="xsmall"
					color={token('color.background.neutral')}
					isShimmering
					shimmeringEndColor="red"
					testId="skeleton-shimmering"
				/>
				<Skeleton
					size="small"
					color={token('color.background.neutral')}
					isShimmering
					shimmeringEndColor="orange"
					testId="skeleton-shimmering"
				/>
				<Skeleton
					size="medium"
					color={token('color.background.neutral')}
					isShimmering
					shimmeringEndColor="yellow"
					testId="skeleton-shimmering"
				/>
				<Skeleton
					size="large"
					color={token('color.background.neutral')}
					isShimmering
					shimmeringEndColor="green"
					testId="skeleton-shimmering"
				/>
				<Skeleton
					size="xlarge"
					color={token('color.background.neutral')}
					isShimmering
					shimmeringEndColor="blue"
					testId="skeleton-shimmering"
				/>
			</Inline>
		</div>
	</Stack>
);
