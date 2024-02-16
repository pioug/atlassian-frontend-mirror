/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LinkButtonProps
 *
 * @codegen <<SignedSource::e3fa155b7ca29460a45a17e30e0b1bd8>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/button/__generated__/link-button.partial.tsx <<SignedSource::d516ed440c441e31394b52f2a8df6b2f>>
 */
import { LinkButtonProps as PlatformLinkButtonProps } from '@atlaskit/button/new';
import React from 'react';

export type LinkButtonProps = Pick<PlatformLinkButtonProps, 'children' | 'target' | 'autoFocus' | 'overlay' | 'isDisabled' | 'isSelected' | 'onBlur' | 'onClick' | 'onFocus' | 'spacing' | 'testId' | 'shouldFitContainer' | 'appearance' > & {
  href?: string
  ref?: React.Ref<HTMLAnchorElement>
};