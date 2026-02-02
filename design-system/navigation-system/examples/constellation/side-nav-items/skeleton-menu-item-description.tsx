/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { jsx } from '@atlaskit/css';
import { Stack, Text } from '@atlaskit/primitives/compiled';
import { SkeletonMenuItem } from '@atlaskit/side-nav-items/skeleton';

export function SkeletonMenuItemDescriptionExample(): React.JSX.Element {
    return (
        <Stack space="space.300">
            <Stack space="space.050">
                <Text size="small" color="color.text.subtlest">
                    Without description
                </Text>
                <SkeletonMenuItem />
            </Stack>
            <Stack space="space.050">
                <Text size="small" color="color.text.subtlest">
                    With description
                </Text>
                <SkeletonMenuItem hasDescription />
            </Stack>
        </Stack>
    )
};

export default SkeletonMenuItemDescriptionExample;
