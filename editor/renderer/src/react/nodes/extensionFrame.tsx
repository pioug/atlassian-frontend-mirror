/** @jsx jsx */

import { jsx, css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { N30 } from '@atlaskit/theme/colors';

import React from 'react';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { RendererContext } from '../types';
import type { Serializer } from '../..';
import type { ExtensionLayout } from '@atlaskit/adf-schema';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

export interface Props {
  serializer: Serializer<any>;
  extensionHandlers?: ExtensionHandlers;
  rendererContext: RendererContext;
  providers: ProviderFactory;
  extensionType: string;
  extensionKey: string;
  path?: PMNode[];
  originalContent?: any;
  parameters?: any;
  content?: any;
  layout?: ExtensionLayout;
  localId?: string;
}

const ExtensionFrame: React.FunctionComponent<Props> = (props) => {
  const containerCSS = css`
    border: 1px solid ${token('color.border', N30)};
    min-height: 100px;
  `;

  return (
    <div
      css={containerCSS}
      className="extension-frame"
      data-extension-frame="true"
      style={{ flexBasis: `100%` }}
    >
      {props.children}
    </div>
  );
};

export default ExtensionFrame;
