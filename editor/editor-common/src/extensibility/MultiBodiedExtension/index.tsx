/* eslint-disable @atlaskit/design-system/prefer-primitives */
/** @jsx jsx */

import React, { useState } from 'react';

import { css, jsx } from '@emotion/react';
import classnames from 'classnames';

import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  PluginKey,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import EditorFileIcon from '@atlaskit/icon/glyph/editor/file';

import type { EventDispatcher } from '../../event-dispatcher';
import type { MultiBodiedExtensionActions } from '../../extensions';
import { useSharedPluginState } from '../../hooks';
import type { EditorAppearance, EditorContainerWidth } from '../../types';
import type { OverflowShadowProps } from '../../ui';
import { sharedMultiBodiedExtensionStyles } from '../../ui/MultiBodiedExtension';
import { calculateBreakoutStyles, getExtensionLozengeData } from '../../utils';
import { WithPluginState } from '../../with-plugin-state';
import type { ExtensionsPluginInjectionAPI } from '../types';

import { useMultiBodiedExtensionActions } from './action-api';
import { mbeExtensionWrapperCSS } from './styles';

export type TryExtensionHandlerType = (
  actions: MultiBodiedExtensionActions | undefined,
) => React.ReactElement | null;

type Props = {
  node: PmNode;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  editorView: EditorView;
  getPos: () => number | undefined;
  tryExtensionHandler: TryExtensionHandlerType;
  eventDispatcher?: EventDispatcher;
  pluginInjectionApi?: ExtensionsPluginInjectionAPI;
  editorAppearance?: EditorAppearance;
};

type PropsWithWidth = Props & {
  widthState?: EditorContainerWidth;
};

interface CustomImageData {
  url: string;
  height?: number;
  width?: number;
}
type ImageData = CustomImageData | undefined;

// Similar to the one in platform/packages/editor/editor-common/src/extensibility/Extension/Lozenge.tsx
const getWrapperTitleContent = (imageData: ImageData, title: string) => {
  if (imageData) {
    const { url, ...rest } = imageData;
    return (
      <div className="extension-title">
        <img
          css={css`
            max-height: 24px;
            max-width: 24px;
          `}
          src={url}
          {...rest}
          alt={title}
        />
        {title}
      </div>
    );
  }
  return (
    <div className="extension-title">
      <EditorFileIcon label={title} />
      {title}
    </div>
  );
};

const MultiBodiedExtensionWithWidth = ({
  node,
  handleContentDOMRef,
  getPos,
  tryExtensionHandler,
  editorView,
  eventDispatcher,
  widthState,
  editorAppearance,
}: PropsWithWidth) => {
  const { parameters, extensionKey } = node.attrs;
  const title =
    (parameters && parameters.extensionTitle) ||
    (parameters &&
      parameters.macroMetadata &&
      parameters.macroMetadata.title) ||
    extensionKey ||
    node.type.name;
  const imageData: ImageData = getExtensionLozengeData({ node, type: 'image' });

  const [activeChildIndex, setActiveChildIndex] = useState<number>(0);
  // Adding to avoid aliasing `this` for the callbacks
  const updateActiveChild = React.useCallback(
    (index: number) => {
      if (typeof index !== 'number') {
        setActiveChildIndex(0);
        throw new Error('Index is not valid');
      }

      setActiveChildIndex(index);
      return true;
    },
    [setActiveChildIndex],
  );

  const actions = useMultiBodiedExtensionActions({
    updateActiveChild,
    editorView,
    getPos,
    eventDispatcher,
    node,
  });

  const extensionHandlerResult = React.useMemo(() => {
    return tryExtensionHandler(actions);
  }, [tryExtensionHandler, actions]);

  const articleRef = React.useCallback(
    (node: HTMLElement | null) => {
      return handleContentDOMRef(node);
    },
    [handleContentDOMRef],
  );

  const containerCssExtended = css`
    ${sharedMultiBodiedExtensionStyles.mbeExtensionContainer};
    .multiBodiedExtension-content-dom-wrapper
      > [data-extension-frame='true']:nth-of-type(${activeChildIndex + 1}) {
      ${sharedMultiBodiedExtensionStyles.extensionFrameContent}
    }
  `;

  const shouldBreakout =
    // Extension should breakout when the layout is set to 'full-width' or 'wide'.
    ['full-width', 'wide'].includes(node.attrs.layout) &&
    // Extension breakout state should not be respected when the editor appearance is full-width mode
    editorAppearance !== 'full-width';

  let mbeWrapperStyles = {};
  if (shouldBreakout) {
    const { ...breakoutStyles } = calculateBreakoutStyles({
      mode: node.attrs.layout,
      widthStateLineLength: widthState?.lineLength,
      widthStateWidth: widthState?.width,
    });
    mbeWrapperStyles = breakoutStyles;
  }

  const wrapperClassNames = classnames(
    'multiBodiedExtension--wrapper',
    'extension-container',
    'block',
  );

  return (
    <div
      className={wrapperClassNames}
      css={mbeExtensionWrapperCSS}
      data-testid="multiBodiedExtension--wrapper"
      style={mbeWrapperStyles}
    >
      {getWrapperTitleContent(imageData, title)}
      <div
        className="multiBodiedExtension--container"
        css={containerCssExtended}
        data-testid="multiBodiedExtension--container"
        data-active-child-index={activeChildIndex}
      >
        <nav
          className="multiBodiedExtension-navigation"
          css={sharedMultiBodiedExtensionStyles.mbeNavigation}
          data-testid="multiBodiedExtension-navigation"
        >
          {extensionHandlerResult}
        </nav>

        <article
          className="multiBodiedExtension--frames"
          data-testid="multiBodiedExtension--frames"
          ref={articleRef}
        />
      </div>
    </div>
  );
};

const MultiBodiedExtensionWithSharedState = (
  props: Props & OverflowShadowProps,
) => {
  const { pluginInjectionApi } = props;
  const { widthState } = useSharedPluginState(pluginInjectionApi, ['width']);
  return <MultiBodiedExtensionWithWidth widthState={widthState} {...props} />;
};

// Workaround taken from platform/packages/editor/editor-core/src/plugins/extension/ui/Extension/Extension/index.tsx
const MultiBodiedExtension = (props: Props & OverflowShadowProps) => {
  // TODO: ED-17836 This code is here because confluence injects
  // the `editor-referentiality` plugin via `dangerouslyAppendPlugins`
  // which cannot access the `pluginInjectionApi`. When we move
  // Confluence to using presets we can remove this workaround.
  const { pluginInjectionApi } = props;
  return pluginInjectionApi === undefined ? (
    <MultiBodiedExtensionDeprecated {...props} />
  ) : (
    <MultiBodiedExtensionWithSharedState {...props} />
  );
};

// TODO: ED-17836 This code is here because Confluence injects
// the `editor-referentiality` plugin via `dangerouslyAppendPlugins`
// which cannot access the `pluginInjectionApi`. When we move
// Confluence to using presets we can remove this workaround.
// @ts-ignore
const widthPluginKey = {
  key: 'widthPlugin$',
  getState: (state: EditorState) => {
    return (state as any)['widthPlugin$'];
  },
} as PluginKey;
const MultiBodiedExtensionDeprecated = (props: Props & OverflowShadowProps) => {
  return (
    <WithPluginState
      editorView={props.editorView}
      plugins={{
        widthState: widthPluginKey,
      }}
      render={({ widthState }) => (
        <MultiBodiedExtensionWithWidth widthState={widthState} {...props} />
      )}
    />
  );
};
/**
 * End workaround
 */

export default MultiBodiedExtension;
