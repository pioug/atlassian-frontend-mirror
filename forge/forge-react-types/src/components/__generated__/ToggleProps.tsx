/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ToggleProps
 *
 * @codegen <<SignedSource::cf8a864ab7058a3b1005b8a41e01649b>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/toggle/__generated__/index.partial.tsx <<SignedSource::f44a0cdbc5ddd14809d002528f848f37>>
 */
import React from 'react';
import PlatformToggle from '@atlaskit/toggle';

type PlatformToggleProps = React.ComponentProps<typeof PlatformToggle>;

export type ToggleProps = Pick<
  PlatformToggleProps,
  'size' | 'testId' | 'defaultChecked' | 'isChecked' | 'label'
 | 'id' | 'isDisabled' | 'onChange' | 'onBlur' | 'onFocus' | 'value' | 'name'
>;