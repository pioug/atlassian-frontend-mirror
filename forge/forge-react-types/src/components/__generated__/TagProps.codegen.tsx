/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TagProps
 *
 * @codegen <<SignedSource::f081b87ce4dccc2b1abdf15493c83667>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tag/__generated__/index.partial.tsx <<SignedSource::bcea9145b6416dcd13aab6551757751f>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformSimpleTag from '@atlaskit/tag/tag/simple';

type PlatformSimpleTagProps = React.ComponentProps<typeof PlatformSimpleTag>;

export type SimpleTagProps = Pick<
  PlatformSimpleTagProps,
  'text' | 'appearance' | 'color' | 'elemBefore' | 'href' | 'testId'
>;

/**
 * A tag labels UI objects for quick recognition and navigation.
 *
 * @see [SimpleTag](https://developer.atlassian.com/platform/forge/ui-kit/components/tag/) in UI Kit documentation for more information
 */
export type TSimpleTag<T> = (props: SimpleTagProps) => T;