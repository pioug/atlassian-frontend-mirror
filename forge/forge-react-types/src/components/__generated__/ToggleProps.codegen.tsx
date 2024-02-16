/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ToggleProps
 *
 * @codegen <<SignedSource::3725fc15575cc31d6f57a976cbb10297>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/toggle/__generated__/index.partial.tsx <<SignedSource::00ab09d4c92a9047a164a1063e7b52de>>
 */
import React from 'react';
import PlatformToggle from '@atlaskit/toggle';

type PlatformToggleProps = React.ComponentProps<typeof PlatformToggle>;

export type ToggleProps = Pick<
  PlatformToggleProps,
  'size' | 'testId' | 'defaultChecked' | 'isChecked' | 'label'
 | 'id' | 'isDisabled' | 'onChange' | 'onBlur' | 'onFocus' | 'value' | 'name'
>;