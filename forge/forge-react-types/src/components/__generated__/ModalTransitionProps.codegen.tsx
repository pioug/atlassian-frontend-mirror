/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalTransitionProps
 *
 * @codegen <<SignedSource::9380f9b9eeb9b5f386d2697093ac6324>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-transition.partial.tsx <<SignedSource::df5955dc012864835e8d86e75761fd15>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformModalTransition from '@atlaskit/modal-dialog/modal-transition';

type PlatformModalTransitionProps = React.ComponentProps<typeof PlatformModalTransition>;

export type ModalTransitionProps = Pick<
  PlatformModalTransitionProps,
  'children'
>;

/**
 * A modal transition wraps a modal to provide a fluid transition upon opening and closing.
 *
 * @see [ModalTransition](https://developer.atlassian.com/platform/forge/ui-kit/components/modal/#modal-transition) in UI Kit documentation for more information
 */
export type TModalTransition<T> = (props: ModalTransitionProps) => T;