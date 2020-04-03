import React from 'react';
import { RendererContext } from '..';
import { renderNodes, Serializer } from '../..';
import { ExtensionLayout } from '@atlaskit/adf-schema';
import ExtensionRenderer from '../../ui/ExtensionRenderer';

import {
  ADNode,
  calcBreakoutWidth,
  ExtensionHandlers,
  overflowShadow,
  OverflowShadowProps,
  WidthConsumer,
  ProviderFactory,
} from '@atlaskit/editor-common';
import { RendererCssClassName } from '../../consts';

export interface Props {
  serializer: Serializer<any>;
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
) => {
  return (
    <WidthConsumer>
      {({ width }) => (
        <div
          ref={options && options.handleRef}
          className={`${RendererCssClassName.EXTENSION} ${options &&
            options.shadowClassNames}`}
          style={{
            width: calcBreakoutWidth(layout, width),
          }}
          data-layout={layout}
        >
          <div className={RendererCssClassName.EXTENSION_OVERFLOW_CONTAINER}>
            {content}
          </div>
        </div>
      )}
    </WidthConsumer>
  );
};

const Extension: React.StatelessComponent<Props &
  OverflowShadowProps> = props => {
  const {
    serializer,
    rendererContext,
    text,
    layout = 'default',
    handleRef,
    shadowClassNames,
  } = props;
  return (
    <ExtensionRenderer {...props} type="extension">
      {({ result }) => {
        try {
          switch (true) {
            case result && React.isValidElement(result):
              // Return the result directly if it's a valid JSX.Element
              return renderExtension(result, layout, {
                handleRef,
                shadowClassNames,
              });
            case !!result:
              // We expect it to be Atlassian Document here
              const nodes = Array.isArray(result) ? result : [result];
              return renderNodes(
                nodes as ADNode[],
                serializer,
                rendererContext.schema,
                'div',
              );
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
