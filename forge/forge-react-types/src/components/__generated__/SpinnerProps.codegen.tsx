/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SpinnerProps
 *
 * @codegen <<SignedSource::1d267baa392f56f63ccbd73bd0c5db1c>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/spinner/__generated__/index.partial.tsx <<SignedSource::0dd572b0415ac2558dcf04013cd2d8e5>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformSpinner from '@atlaskit/spinner/spinner';

type PlatformSpinnerProps = React.ComponentProps<typeof PlatformSpinner>;

export type SpinnerProps = Pick<
  PlatformSpinnerProps,
  'appearance' | 'delay' | 'label' | 'size' | 'testId'
>;

/**
 * A spinner is an animated spinning icon that lets users know content is being loaded.
 *
 * @see [Spinner](https://developer.atlassian.com/platform/forge/ui-kit/components/spinner/) in UI Kit documentation for more information
 */
export type TSpinner<T> = (props: SpinnerProps) => T;