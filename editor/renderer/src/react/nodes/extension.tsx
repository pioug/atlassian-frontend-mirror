import React from 'react';
import { Node as PMNode } from 'prosemirror-model';
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
  path?: PMNode[];
  text?: string;
  parameters?: any;
  layout?: ExtensionLayout;
  localId?: string;
}

type AllOrNone<T> = T | { [K in keyof T]?: never };

type RenderExtensionOptions = {
  isTopLevel?: boolean;
} & AllOrNone<OverflowShadowProps>;

export const renderExtension = (
  content: any,
  layout: string,
  options: RenderExtensionOptions = {},
  removeOverflow?: boolean,
) => {
  const overflowContainerClass = !removeOverflow
    ? RendererCssClassName.EXTENSION_OVERFLOW_CONTAINER
    : '';

  // by default, we assume the extension is at top level, (direct child of doc node)
  const { isTopLevel = true } = options || {};
  const centerAlignClass =
    isTopLevel && ['wide', 'full-width'].includes(layout)
      ? RendererCssClassName.EXTENSION_CENTER_ALIGN
      : '';

  return (
    <WidthConsumer>
      {({ width }) => (
        <div
          ref={options.handleRef}
          className={`${RendererCssClassName.EXTENSION} ${options.shadowClassNames} ${centerAlignClass}`}
          style={{
            width: isTopLevel ? calcBreakoutWidth(layout, width) : '100%',
          }}
          data-layout={layout}
        >
          <div className={overflowContainerClass}>{content}</div>
        </div>
      )}
    </WidthConsumer>
  );
};

const Extension: React.FunctionComponent<Props & OverflowShadowProps> = (
  props,
) => {
  const {
    text,
    layout = 'default',
    handleRef,
    shadowClassNames,
    path = [],
  } = props;

  return (
    <ExtensionRenderer {...props} type="extension">
      {({ result }) => {
        try {
          // Return the result directly if it's a valid JSX.Element
          if (result && React.isValidElement(result)) {
            return renderExtension(result, layout, {
              isTopLevel: path.length < 1,
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
          isTopLevel: path.length < 1,
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
