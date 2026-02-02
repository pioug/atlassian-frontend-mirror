/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import { Flex } from '@atlaskit/primitives/compiled';
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
    text: {
        paddingInlineStart: token('space.050'),
        paddingInlineEnd: token('space.050'),
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

const skeletonStyles = cssMap({
    item: {
        backgroundColor: token('color.skeleton'),
        borderRadius: token('radius.full'),
        width: '100px',
        height: '1cap',
    },
    elemBefore: {
        backgroundColor: token('color.skeleton'),
        borderRadius: token('radius.small'),
        width: '20px',
        height: '20px',
    },
    description: {
        backgroundColor: token('color.skeleton'),
        borderRadius: token('radius.full'),
        width: '60px',
        height: '1cap',
    }
});

export interface SkeletonMenuItemProps {
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
 * __Skeleton menu item__
 *
 * A skeleton menu item is used to display a loading state for a side nav menu item.
 * This component can have an icon element skeleton, and a description skeleton included.
 */
export const SkeletonMenuItem = (props: SkeletonMenuItemProps) => {
    const { hasDescription = false, hasElemBefore = false, testId } = props;

    return (
        <div
            css={[
                containerStyles.root,
                hasDescription && containerStyles.hasDescription
            ]}
            data-testid={testId}
        >
            <Flex alignItems="center">
                {hasElemBefore &&
                    <div css={containerStyles.elemBefore}>
                        <div css={skeletonStyles.elemBefore} />
                    </div>
                }

                <Flex xcss={containerStyles.text} gap="space.025" direction="column">
                    <div css={containerStyles.item}>
                        <div css={skeletonStyles.item} />
                    </div>

                    {hasDescription && (
                        <div css={containerStyles.description}>
                            <div css={skeletonStyles.description} />
                        </div>
                    )}
                </Flex>
            </Flex>
        </div>
    )
};
