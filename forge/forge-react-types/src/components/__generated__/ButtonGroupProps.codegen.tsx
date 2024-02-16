/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ButtonGroupProps
 *
 * @codegen <<SignedSource::19af9b93152efbb073d884ff4fac1f61>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/button/__generated__/button-group.partial.tsx <<SignedSource::0503cf417784c7976c74427bd182fb5b>>
 */
import React from 'react';
import { ButtonGroup as PlatformButtonGroup } from '@atlaskit/button';

type PlatformButtonGroupProps = React.ComponentProps<typeof PlatformButtonGroup>;

export type ButtonGroupProps = Pick<
  PlatformButtonGroupProps,
  'appearance' | 'children' | 'testId' | 'label' | 'titleId'
>;