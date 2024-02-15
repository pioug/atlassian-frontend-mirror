/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalHeaderProps
 *
 * @codegen <<SignedSource::96059a2bdff6a177279c7dc955ce4ac7>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/modal/__generated__/modal-header.partial.tsx <<SignedSource::823540a93ecd4ea60920eba0343f23a9>>
 */
import React from 'react';
import { ModalHeader as PlatformModalHeader } from '@atlaskit/modal-dialog';

type PlatformModalHeaderProps = React.ComponentProps<typeof PlatformModalHeader>;

export type ModalHeaderProps = Pick<
  PlatformModalHeaderProps,
  'children' | 'testId'
>;