/* eslint-disable @atlaskit/design-system/prefer-primitives */
/** @jsx jsx */

import React, { Fragment, useState } from 'react';

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
import {
  removeMarginsAndBorder,
  sharedMultiBodiedExtensionStyles,
} from '../../ui/MultiBodiedExtension';
import { calculateBreakoutStyles, getExtensionLozengeData } from '../../utils';
import { WithPluginState } from '../../with-plugin-state';
import ExtensionLozenge from '../Extension/Lozenge';
import type { ExtensionsPluginInjectionAPI } from '../types';

import { useMultiBodiedExtensionActions } from './action-api';
import { mbeExtensionWrapperCSSStyles, overlayStyles } from './styles';

const getContainerCssExtendedStyles = (
  activeChildIndex: number,
  showMacroInteractionDesignUpdates?: boolean,
) =>
  css(sharedMultiBodiedExtensionStyles.mbeExtensionContainer, {
    [`.multiBodiedExtension-content-dom-wrapper > [data-extension-frame='true']:nth-of-type(${
      activeChildIndex + 1
    })`]: css(
      sharedMultiBodiedExtensionStyles.extensionFrameContent,
      showMacroInteractionDesignUpdates && removeMarginsAndBorder,
    ),
  });

const imageStyles = css({
  maxHeight: '24px',
  maxWidth: '24px',
});

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
  showMacroInteractionDesignUpdates?: boolean;
  isNodeSelected?: boolean;
  isNodeHovered?: boolean;
  setIsNodeHovered?: (isHovered: boolean) => void;
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
const getWrapperTitleContent = (
  imageData: ImageData,
  title: string,
  showMacroInteractionDesignUpdates?: boolean,
) => {
  if (showMacroInteractionDesignUpdates) {
    return null;
  }
  if (imageData) {
    const { url, ...rest } = imageData;
    return (
      <div className="extension-title">
        <img css={imageStyles} src={url} {...rest} alt={title} />
        {title}
      </div>
    );
  }
  return (
    <div
      className="extension-title"
      data-testid={'multiBodiedExtension-default-lozenge'}
    >
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
  showMacroInteractionDesignUpdates,
  isNodeSelected,
  isNodeHovered,
  setIsNodeHovered,
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
    {
      'with-margin-styles': showMacroInteractionDesignUpdates,
      'with-border': showMacroInteractionDesignUpdates,
      'with-hover-border': showMacroInteractionDesignUpdates && isNodeHovered,
      'with-danger-overlay': showMacroInteractionDesignUpdates,
    },
  );

  const containerClassNames = classnames('multiBodiedExtension--container', {
    'remove-padding': showMacroInteractionDesignUpdates,
  });

  const navigationClassNames = classnames('multiBodiedExtension--navigation', {
    'remove-margins': showMacroInteractionDesignUpdates,
    'remove-border': showMacroInteractionDesignUpdates,
  });

  const handleMouseEvent = (didHover: boolean) => {
    if (setIsNodeHovered) {
      setIsNodeHovered(didHover);
    }
  };

  return (
    <Fragment>
      {showMacroInteractionDesignUpdates && (
        <ExtensionLozenge
          isNodeSelected={isNodeSelected}
          node={node}
          showMacroInteractionDesignUpdates={true}
          customContainerStyles={mbeWrapperStyles}
          isNodeHovered={isNodeHovered}
        />
      )}
      <div
        className={wrapperClassNames}
        css={mbeExtensionWrapperCSSStyles}
        data-testid="multiBodiedExtension--wrapper"
        style={mbeWrapperStyles}
        onMouseEnter={() => handleMouseEvent(true)}
        onMouseLeave={() => handleMouseEvent(false)}
      >
        <div css={overlayStyles} className="multiBodiedExtension--overlay" />
        {getWrapperTitleContent(
          imageData,
          title,
          showMacroInteractionDesignUpdates,
        )}
        <div
          className={containerClassNames}
          css={getContainerCssExtendedStyles(
            activeChildIndex,
            showMacroInteractionDesignUpdates,
          )}
          data-testid="multiBodiedExtension--container"
          data-active-child-index={activeChildIndex}
        >
          <nav
            className={navigationClassNames}
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
    </Fragment>
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
    // @ts-ignore - 'WithPluginState' cannot be used as a JSX component.
    // This error was introduced after upgrading to TypeScript 5
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
