/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalTransitionProps
 *
 * @codegen <<SignedSource::4df20ec54754f56f2bdaeafb075be019>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-transition.partial.tsx <<SignedSource::9a5d35aaedbe614414c801acffdbeeff>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { ModalTransition as PlatformModalTransition } from '@atlaskit/modal-dialog';

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