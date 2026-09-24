/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SpinnerProps
 *
 * @codegen <<SignedSource::19d52bc6a9f97b75401b9eb6879c4993>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/spinner/__generated__/index.partial.tsx <<SignedSource::6f10584d0f1579d9eb99f8ea5738958c>>
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