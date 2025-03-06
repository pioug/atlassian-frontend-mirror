/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalTransitionProps
 *
 * @codegen <<SignedSource::fbd2e79db623371d79d173ce8c807737>>
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
 */
export type TModalTransition<T> = (props: ModalTransitionProps) => T;