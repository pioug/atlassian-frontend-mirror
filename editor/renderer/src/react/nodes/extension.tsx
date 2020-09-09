import React from 'react';
import { RendererContext } from '../types';
import { ExtensionLayout } from '@atlaskit/adf-schema';
import ExtensionRenderer from '../../ui/ExtensionRenderer';

import {
  calcBreakoutWidth,
  ExtensionHandlers,
  overflowShadow,
  OverflowShadowProps,
  WidthConsumer,
  ProviderFactory,
} from '@atlaskit/editor-common';
import { RendererCssClassName } from '../../consts';

export interface Props {
  extensionHandlers?: ExtensionHandlers;
  providers: ProviderFactory;
  rendererContext: RendererContext;
  extensionType: string;
  extensionKey: string;
  text?: string;
  parameters?: any;
  layout?: ExtensionLayout;
}

export const renderExtension = (
  content: any,
  layout: string,
  options?: OverflowShadowProps,
  removeOverflow?: boolean,
) => {
  const overflowContainerClass = !removeOverflow
    ? RendererCssClassName.EXTENSION_OVERFLOW_CONTAINER
    : '';
  return (
    <WidthConsumer>
      {({ width }) => (
        <div
          ref={options && options.handleRef}
          className={`${RendererCssClassName.EXTENSION} ${
            options && options.shadowClassNames
          }`}
          style={{
            width: calcBreakoutWidth(layout, width),
          }}
          data-layout={layout}
        >
          <div className={overflowContainerClass}>{content}</div>
        </div>
      )}
    </WidthConsumer>
  );
};

const Extension: React.StatelessComponent<
  Props & OverflowShadowProps
> = props => {
  const { text, layout = 'default', handleRef, shadowClassNames } = props;
  return (
    <ExtensionRenderer {...props} type="extension">
      {({ result }) => {
        try {
          // Return the result directly if it's a valid JSX.Element
          if (result && React.isValidElement(result)) {
            return renderExtension(result, layout, {
              handleRef,
              shadowClassNames,
            });
          }
        } catch (e) {
          /** We don't want this error to block renderer */
          /** We keep rendering the default content */
        }

        // Always return default content if anything goes wrong
        return renderExtension(text || 'extension', layout, {
          handleRef,
          shadowClassNames,
        });
      }}
    </ExtensionRenderer>
  );
};

export default overflowShadow(Extension, {
  overflowSelector: `.${RendererCssClassName.EXTENSION_OVERFLOW_CONTAINER}`,
});
