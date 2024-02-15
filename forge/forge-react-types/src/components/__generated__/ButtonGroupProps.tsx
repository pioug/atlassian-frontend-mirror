/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ButtonGroupProps
 *
 * @codegen <<SignedSource::c15ba63a6c057b08d5e3f07fd8b6d0c8>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/button/__generated__/button-group.partial.tsx <<SignedSource::cc53737d6835f3b738922c54757a917e>>
 */
import React from 'react';
import { ButtonGroup as PlatformButtonGroup } from '@atlaskit/button';

type PlatformButtonGroupProps = React.ComponentProps<typeof PlatformButtonGroup>;

export type ButtonGroupProps = Pick<
  PlatformButtonGroupProps,
  'appearance' | 'children' | 'testId' | 'label' | 'titleId'
>;