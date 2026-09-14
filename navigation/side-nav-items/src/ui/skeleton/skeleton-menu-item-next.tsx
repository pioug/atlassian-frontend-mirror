/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import { Flex } from '@atlaskit/primitives/compiled';
import Skeleton from '@atlaskit/skeleton';
import { token } from '@atlaskit/tokens';

const containerStyles = cssMap({
	root: {
		height: '24px',
		paddingInlineStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
		paddingBlockStart: token('space.050'),
		paddingBlockEnd: token('space.050'),
		display: 'flex',
		alignItems: 'center',
	},
	// Fills the root so the text column below has a definite width to size against.
	content: {
		flexGrow: 1,
	},
	text: {
		paddingInlineStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
		// Lets the description skeleton resolve `width: 100%` against the space left
		// over by the icon, rather than against its own content width. `minWidth`
		// is the string `'0'` rather than the number `0` because `cssMap` widens a
		// numeric literal to `number`, which `Flex`'s strict `xcss` type rejects for
		// `minWidth` (it accepts `SizeIntrinsic`, i.e. `0 | '0' | ...`, not `number`).
		flexGrow: 1,
		minWidth: '0',
	},
	item: {
		font: token('font.body'),
		height: '1lh',
		display: 'flex',
		alignItems: 'center',
	},
	hasDescription: {
		height: '40px',
	},
	description: {
		font: token('font.body.small'),
		height: '1lh',
		display: 'flex',
		alignItems: 'center',
	},
	elemBefore: {
		paddingInlineStart: token('space.025'),
		paddingInlineEnd: token('space.025'),
		paddingBlockStart: token('space.025'),
		paddingBlockEnd: token('space.025'),
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export interface SkeletonMenuItemNextProps {
	/**
	 * Whether to render a description skeleton.
	 */
	hasDescription?: boolean;

	/**
	 * Whether to render an icon element skeleton.
	 */
	hasElemBefore?: boolean;

	/**
	 * A unique string that appears as data attribute data-testid in the
	 * rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
}

/**
 * __Skeleton menu item next__
 *
 * A skeleton menu item is used to display a loading state for a side nav menu item.
 * This component can have an icon element skeleton, and a description skeleton included.
 *
 * This is a variant of `SkeletonMenuItem` that draws its placeholders with
 * `Skeleton` from `@atlaskit/skeleton` rather than plain elements, so they pick up
 * that component's appearance and its interaction-tracing hold. The surrounding
 * layout — heights, paddings and the icon slot — is unchanged, with one exception:
 * the description skeleton spans the full width available to it instead of a fixed
 * 60px.
 */
export const SkeletonMenuItemNext = (props: SkeletonMenuItemNextProps): JSX.Element => {
	const { hasDescription = false, hasElemBefore = false, testId } = props;

	return (
		<div
			css={[containerStyles.root, hasDescription && containerStyles.hasDescription]}
			data-testid={testId}
		>
			<Flex alignItems="center" xcss={containerStyles.content}>
				{hasElemBefore && (
					<div css={containerStyles.elemBefore}>
						<Skeleton
							width="20px"
							height="20px"
							borderRadius={token('radius.small')}
							isShimmering
						/>
					</div>
				)}

				<Flex xcss={containerStyles.text} gap="space.025" direction="column">
					<div css={containerStyles.item}>
						<Skeleton
							width="100%"
							height="round(1cap, 1px)"
							borderRadius={token('radius.full')}
							isShimmering
						/>
					</div>

					{hasDescription && (
						<div css={containerStyles.description}>
							<Skeleton
								width="100%"
								height="round(1cap, 1px)"
								borderRadius={token('radius.full')}
								isShimmering
							/>
						</div>
					)}
				</Flex>
			</Flex>
		</div>
	);
};
