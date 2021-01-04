import React from 'react';
import { RendererContext } from '../types';
import { Serializer } from '../..';
import { ExtensionLayout } from '@atlaskit/adf-schema';
import { ExtensionHandlers, ProviderFactory } from '@atlaskit/editor-common';
import { renderExtension } from './extension';
import ExtensionRenderer from '../../ui/ExtensionRenderer';

export interface Props {
  serializer: Serializer<any>;
  extensionHandlers?: ExtensionHandlers;
  rendererContext: RendererContext;
  providers: ProviderFactory;
  extensionType: string;
  extensionKey: string;
  originalContent?: any;
  parameters?: any;
  content?: any;
  layout?: ExtensionLayout;
}

const BodiedExtension: React.StatelessComponent<Props> = props => {
  const { children, layout = 'default' } = props;

  const removeOverflow = React.Children.toArray<any>(children)
    .map(child => child!.props.nodeType === 'table')
    .every(Boolean);

  return (
    <ExtensionRenderer {...props} type="bodiedExtension">
      {({ result }) => {
        try {
          if (result && React.isValidElement(result)) {
            // Return the content directly if it's a valid JSX.Element
            return renderExtension(result, layout, undefined, removeOverflow);
          }
        } catch (e) {
          /** We don't want this error to block renderer */
          /** We keep rendering the default content */
        }

        // Always return default content if anything goes wrong
        return renderExtension(children, layout, undefined, removeOverflow);
      }}
    </ExtensionRenderer>
  );
};

export default BodiedExtension;
