/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ButtonGroupProps
 *
 * @codegen <<SignedSource::deffbe53f69e34bd1ebdb1c45b7920a2>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/button/__generated__/button-group.partial.tsx <<SignedSource::74a3b0f82730111c707e2fccc2233ab6>>
 */
import React from 'react';
import { ButtonGroup as PlatformButtonGroup } from '@atlaskit/button';

type PlatformButtonGroupProps = React.ComponentProps<typeof PlatformButtonGroup>;

export type ButtonGroupProps = Pick<
  PlatformButtonGroupProps,
  'appearance' | 'children' | 'testId' | 'label' | 'titleId'
>;