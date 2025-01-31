/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SpinnerProps
 *
 * @codegen <<SignedSource::4e5a68490063fadaa3ca7fb88f04cb94>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/spinner/__generated__/index.partial.tsx <<SignedSource::d6138d211e143990a6133754180f565c>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformSpinner from '@atlaskit/spinner';

type PlatformSpinnerProps = React.ComponentProps<typeof PlatformSpinner>;

export type SpinnerProps = Pick<
  PlatformSpinnerProps,
  'appearance' | 'delay' | 'label' | 'size' | 'testId'
>;

/**
 * A spinner is an animated spinning icon that lets users know content is being loaded.
 */
export type TSpinner<T> = (props: SpinnerProps) => T;