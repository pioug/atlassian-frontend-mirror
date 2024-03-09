/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { akEditorGutterPadding } from '@atlaskit/editor-shared-styles';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { useSharedPluginState } from '../../../hooks';
import { createWidthContext, WidthContext } from '../../../ui';
import type { ExtensionsPluginInjectionAPI } from '../../types';
import ExtensionLozenge from '../Lozenge';
import { overlay } from '../styles';

import { inlineWrapperStyels, wrapperStyle } from './styles';

export interface Props {
  node: PmNode;
  pluginInjectionApi: ExtensionsPluginInjectionAPI;
  children?: React.ReactNode;
  showMacroInteractionDesignUpdates?: boolean;
  isNodeSelected?: boolean;
}

const InlineExtension = (props: Props) => {
  const {
    node,
    pluginInjectionApi,
    showMacroInteractionDesignUpdates,
    isNodeSelected,
    children,
  } = props;
  const { widthState } = useSharedPluginState(pluginInjectionApi, ['width']);

  const hasChildren = !!children;

  const className = hasChildren ? 'with-overlay with-children' : 'with-overlay';

  const rendererContainerWidth = widthState
    ? widthState.width - akEditorGutterPadding * 2
    : 0;

  const extendedInlineExtension =
    getBooleanFF('platform.editor.inline_extension.extended_lcqdn') || false;

  const inlineExtensionInternal = (
    <div
      css={[wrapperStyle, extendedInlineExtension && inlineWrapperStyels]}
      className={`extension-container inline ${className}`}
    >
      <div css={overlay} className="extension-overlay" />
      {children ? (
        children
      ) : (
        <ExtensionLozenge
          node={node}
          isNodeSelected={isNodeSelected}
          showMacroInteractionDesignUpdates={showMacroInteractionDesignUpdates}
        />
      )}
    </div>
  );
  if (extendedInlineExtension) {
    return (
      <WidthContext.Provider value={createWidthContext(rendererContainerWidth)}>
        {inlineExtensionInternal}
      </WidthContext.Provider>
    );
  }
  return inlineExtensionInternal;
};

export default InlineExtension;
