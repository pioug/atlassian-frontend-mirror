/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalTransitionProps
 *
 * @codegen <<SignedSource::8871b6ff7439f8172716d94cf7bc14fc>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-transition.partial.tsx <<SignedSource::eb295d3ce9d9acba04d56272c469097a>>
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