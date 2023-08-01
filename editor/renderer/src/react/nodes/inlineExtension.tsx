import React from 'react';
import { RendererContext } from '../types';
import ExtensionRenderer from '../../ui/ExtensionRenderer';
import { Mark as PMMark } from '@atlaskit/editor-prosemirror/model';

import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

export interface Props {
  extensionHandlers?: ExtensionHandlers;
  providers: ProviderFactory;
  rendererContext: RendererContext;
  extensionType: string;
  extensionKey: string;
  text?: string;
  parameters?: any;
  localId?: string;
  marks?: PMMark[];
}

const InlineExtension: React.StatelessComponent<Props> = (props) => {
  const { text } = props;

  return (
    <ExtensionRenderer {...props} type="inlineExtension">
      {({ result }) => {
        try {
          // Return the result directly if it's a valid JSX.Element
          if (result && React.isValidElement(result)) {
            return <span>{result}</span>;
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
