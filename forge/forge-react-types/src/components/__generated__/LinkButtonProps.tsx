/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LinkButtonProps
 *
 * @codegen <<SignedSource::944d0c7686c2050c3d5586b92bf6716f>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/button/__generated__/link-button.partial.tsx <<SignedSource::3e4e4b56ef4f08eeb08f0a7f9347aca6>>
 */
import { LinkButtonProps as PlatformLinkButtonProps } from '@atlaskit/button/new';
import React from 'react';

export type LinkButtonProps = Pick<PlatformLinkButtonProps, 'children' | 'target' | 'autoFocus' | 'overlay' | 'isDisabled' | 'isSelected' | 'onBlur' | 'onClick' | 'onFocus' | 'spacing' | 'testId' | 'shouldFitContainer' | 'appearance' > & {
  href?: string
  ref?: React.Ref<HTMLAnchorElement>
};