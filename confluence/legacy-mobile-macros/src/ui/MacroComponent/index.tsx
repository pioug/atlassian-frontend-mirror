import React, { FC } from 'react';

import { injectIntl, WrappedComponentProps } from 'react-intl-next';

import { macroExtensionHandlerKey } from './constants';
// import { ExtensionLinkComponent } from './ExtensionLinkComponent';
import {
  hasInlineImplementation,
  InlineMacroComponent,
} from './InlineMacroComponent';
import {
  MacroFallbackCard,
  MacroFallbackComponent,
} from './MacroFallbackComponent';
import { MacroComponentProps } from './types';

const BaseMacroComponent: FC<MacroComponentProps & WrappedComponentProps> = (
  props,
) => {
  const { extension, renderingStrategy } = props;

  const renderFallback = () => <MacroFallbackComponent {...props} />;

  const renderInline = () => <InlineMacroComponent {...props} />;

  switch (renderingStrategy) {
    // NOTE: Rendering as link disabled until we can fix setContent overriding
    //       nested renderer content
    // case 'link':
    //   return (<ExtensionLinkComponent extension={extension} render={nestedRender} />)

    case 'fallback':
      return renderFallback();

    case 'inline':
      return hasInlineImplementation(extension.extensionKey)
        ? renderInline()
        : renderFallback();

    default:
      return renderFallback();
  }
};

export {
  InlineMacroComponent,
  macroExtensionHandlerKey,
  MacroFallbackCard,
  MacroFallbackComponent,
};

export const MacroComponent = injectIntl(BaseMacroComponent);
