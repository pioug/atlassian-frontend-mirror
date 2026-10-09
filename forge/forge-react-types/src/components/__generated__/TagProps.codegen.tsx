/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TagProps
 *
 * @codegen <<SignedSource::0ce4d376a33be2e7548bab001cacf9de>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tag/__generated__/index.partial.tsx <<SignedSource::3ad5cf8f8aefc08bc5eab701d17d3bfe>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformRemovableTag from '@atlaskit/tag/removable-tag';

type PlatformRemovableTagProps = React.ComponentProps<typeof PlatformRemovableTag>;

export type RemovableTagProps = Pick<
  PlatformRemovableTagProps,
  'text' | 'appearance' | 'color' | 'elemBefore' | 'href' | 'testId' | 'isRemovable' | 'removeButtonLabel' | 'onAfterRemoveAction' | 'onBeforeRemoveAction'
>;

/**
 * A tag labels UI objects for quick recognition and navigation.
 *
 * @see [RemovableTag](https://developer.atlassian.com/platform/forge/ui-kit/components/tag/) in UI Kit documentation for more information
 */
export type TRemovableTag<T> = (props: RemovableTagProps) => T;