import React from 'react';
import { RendererContext } from '..';
import { renderNodes, Serializer } from '../..';
import ExtensionRenderer from '../../ui/ExtensionRenderer';

import {
  ADNode,
  ExtensionHandlers,
  ProviderFactory,
} from '@atlaskit/editor-common';

export interface Props {
  serializer: Serializer<any>;
  extensionHandlers?: ExtensionHandlers;
  providers: ProviderFactory;
  rendererContext: RendererContext;
  extensionType: string;
  extensionKey: string;
  text?: string;
  parameters?: any;
}

const InlineExtension: React.StatelessComponent<Props> = props => {
  const { serializer, rendererContext, text } = props;

  return (
    <ExtensionRenderer {...props} type="inlineExtension">
      {({ result }) => {
        try {
          switch (true) {
            case result && React.isValidElement(result):
              // Return the result directly if it's a valid JSX.Element
              return <span>{result}</span>;
            case !!result:
              // We expect it to be Atlassian Document here
              const nodes = Array.isArray(result) ? result : [result];
              return renderNodes(
                nodes as ADNode[],
                serializer,
                rendererContext.schema,
                'span',
              );
          }
        } catch (e) {
          /** We don't want this error to block renderer */
          /** We keep rendering the default content */
        }

        // Always return default content if anything goes wrong
        return <span>{text || 'inlineExtension'}</span>;
      }}
    </ExtensionRenderer>
  );
};

export default InlineExtension;
