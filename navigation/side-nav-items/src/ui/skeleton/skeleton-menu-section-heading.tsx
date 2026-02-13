/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const containerStyles = cssMap({
    root: {
        minHeight: '24px',
        paddingInlineStart: token('space.075'),
        paddingInlineEnd: token('space.050'),
        paddingBlockStart: token('space.050'),
        paddingBlockEnd: token('space.050'),
        display: 'flex',
        alignItems: 'center',
    },
    item: {
        font: token('font.heading.xxsmall'),
        height: '1lh',
        display: 'flex',
        alignItems: 'center',
    },
});

const skeletonStyles = cssMap({
    item: {
        backgroundColor: token('color.skeleton'),
        borderRadius: token('radius.full'),
        width: '60px',
        height: 'round(1cap, 1px)',
    },
});

export interface SkeletonMenuSectionHeadingProps {
    /**
     * A unique string that appears as data attribute data-testid in the
     * rendered code, serving as a hook for automated tests.
     */
    testId?: string;
}

/**
 * __Skeleton menu section heading__
 * 
 * A skeleton menu section heading is used to display a loading state for a side nav menu
 * section heading.
 *
 */
export const SkeletonMenuSectionHeading = (props: SkeletonMenuSectionHeadingProps) => {
    const { testId } = props;

    return (
        <div css={containerStyles.root} data-testid={testId}>
            <div css={containerStyles.item}>
                <div css={skeletonStyles.item} />
            </div>
        </div>
    )
};
