import React, { FC } from 'react';

import { injectIntl, WrappedComponentProps } from 'react-intl-next';

import { macroExtensionHandlerKey } from './constants';
// import { ExtensionLinkComponent } from './ExtensionLinkComponent';
import {
  hasInlineImplementation,
  InlineMacroComponent,
} from './InlineMacroComponent';
import { InlineSSRMacroComponent } from './InlineSSRMacroComponent';
import {
  MacroFallbackCard,
  MacroFallbackComponent,
} from './MacroFallbackComponent';
import { PlaceholderComponent } from './PlaceholderComponent';
import { MacroComponentProps } from './types';

const BaseMacroComponent: FC<MacroComponentProps & WrappedComponentProps> = (
  props,
) => {
  const { extension, renderingStrategy } = props;

  const renderFallback = () => <MacroFallbackComponent {...props} />;

  const renderInline = () => <InlineMacroComponent {...props} />;

  const renderInlineStatic = () => (
    <InlineSSRMacroComponent
      outputDeviceType="MOBILE"
      renderFallback={renderFallback}
      {...props}
    />
  );

  const renderInlineDynamic = () => (
    <InlineSSRMacroComponent
      outputDeviceType="DESKTOP"
      renderFallback={renderFallback}
      {...props}
    />
  );

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

    case 'inlineStatic':
      return renderInlineStatic();

    case 'inlineDynamic':
      return renderInlineDynamic();

    case 'placeholderUrlImplementation':
      return (
        <PlaceholderComponent renderFallback={renderFallback} {...props} />
      );

    default:
      return renderFallback();
  }
};

export {
  InlineMacroComponent,
  InlineSSRMacroComponent,
  macroExtensionHandlerKey,
  MacroFallbackCard,
  MacroFallbackComponent,
};

export const MacroComponent = injectIntl(BaseMacroComponent);
