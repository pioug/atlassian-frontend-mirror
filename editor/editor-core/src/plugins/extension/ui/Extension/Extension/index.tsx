/** @jsx jsx */
import type { CSSProperties } from 'react';
import React from 'react';
import { jsx } from '@emotion/react';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
  ExtensionProvider,
  ReferenceEntity,
} from '@atlaskit/editor-common/extensions';
import { overflowShadow } from '@atlaskit/editor-common/ui';
import type { OverflowShadowProps } from '@atlaskit/editor-common/ui';
import { calculateBreakoutStyles } from '@atlaskit/editor-common/utils';
import {
  wrapperStyle,
  header,
  content,
  contentWrapper,
  widerLayoutClassName,
} from './styles';
import { overlay } from '../styles';
import ExtensionLozenge from '../Lozenge';
import type { ProsemirrorGetPosHandler } from '@atlaskit/editor-common/react-node-view';
import classnames from 'classnames';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type {
  WidthPlugin,
  WidthPluginState,
} from '@atlaskit/editor-plugin-width';
import type {
  PluginInjectionAPIWithDependency,
  EditorAppearance,
} from '@atlaskit/editor-common/types';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export interface Props {
  node: PmNode;
  getPos: ProsemirrorGetPosHandler;
  view: EditorView;
  extensionProvider?: ExtensionProvider;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  children?: React.ReactNode;
  references?: ReferenceEntity[];
  hideFrame?: boolean;
  editorAppearance?: EditorAppearance;
  pluginInjectionApi: PluginInjectionAPIWithDependency<WidthPlugin> | undefined;
}

type WidthStateProps = { widthState?: WidthPluginState };
interface ExtensionWithPluginStateProps
  extends Props,
    OverflowShadowProps,
    WidthStateProps {}
function ExtensionWithPluginState(props: ExtensionWithPluginStateProps) {
  const {
    node,
    handleContentDOMRef,
    children,
    widthState = { width: 0 },
    handleRef,
    shadowClassNames,
    hideFrame,
    editorAppearance,
  } = props;
  let isMultiBodiedExtension = false;
  if (getBooleanFF('platform.editor.multi-bodied-extension_0rygg')) {
    isMultiBodiedExtension = true;
  }

  //TODO: clean-up after removing multi-bodied-extension FF
  const hasBody =
    node.type.name === 'bodiedExtension' ||
    (isMultiBodiedExtension && node.type.name === 'multiBodiedExtension');

  const isMobile = editorAppearance === 'mobile';
  const hasChildren = !!children;
  const removeBorder = (hideFrame && !isMobile && !hasBody) || false;

  const { getPos, view } = props;
  const isTopLevelNode = React.useMemo(() => {
    const pos: number | undefined =
      typeof getPos === 'function' ? getPos() : undefined;

    return (
      typeof pos !== 'undefined' &&
      !isNaN(pos) &&
      view.state.doc.resolve(pos).depth === 0
    );

    return false;
  }, [view, getPos]);

  const shouldBreakout =
    // Extension should breakout when the layout is set to 'full-width' or 'wide'.
    ['full-width', 'wide'].includes(node.attrs.layout) &&
    // Extension breakout state should only be respected for top level nodes.
    isTopLevelNode &&
    // Extension breakout state should not be respected when the editor appearance is full-width mode
    editorAppearance !== 'full-width';

  const classNames = classnames(
    'extension-container',
    'block',
    shadowClassNames,
    {
      'with-overlay': !hasBody,
      'without-frame': removeBorder,
      [widerLayoutClassName]: shouldBreakout,
    },
  );

  const headerClassNames = classnames({
    'with-children': hasChildren,
    'without-frame': removeBorder,
  });

  let customContainerStyles: CSSProperties = {
    width: '100%',
  };

  let newContentStyles = {};

  if (shouldBreakout) {
    const { type, ...breakoutStyles } = calculateBreakoutStyles({
      mode: node.attrs.layout,
      widthStateWidth: widthState.width,
      widthStateLineLength: widthState.lineLength,
    });

    newContentStyles = { ...breakoutStyles };

    customContainerStyles = breakoutStyles;
  }

  newContentStyles = {
    ...newContentStyles,
    ...contentWrapper,
  };

  return (
    <div
      ref={handleRef}
      data-layout={node.attrs.layout}
      className={classNames}
      css={wrapperStyle}
      style={customContainerStyles}
    >
      <div
        className={`extension-overflow-wrapper ${hasBody ? 'with-body' : ''}`}
      >
        <div css={overlay} className="extension-overlay" />
        <div css={header} contentEditable={false} className={headerClassNames}>
          {!removeBorder && <ExtensionLozenge node={node} />}
          {children}
        </div>
        {hasBody && (
          <div css={newContentStyles}>
            <div
              css={content}
              ref={handleContentDOMRef}
              className="extension-content block"
            />
          </div>
        )}
      </div>
    </div>
  );
}

const Extension = (props: Props & OverflowShadowProps) => {
  // TODO: ED-17836 This code is here because confluence injects
  // the `editor-referentiality` plugin via `dangerouslyAppendPlugins`
  // which cannot access the `pluginInjectionApi`. When we move
  // Confluence to using presets we can remove this workaround.
  const { pluginInjectionApi } = props;
  return pluginInjectionApi === undefined ? (
    <ExtensionDeprecated {...props} />
  ) : (
    <ExtensionWithSharedState {...props} />
  );
};

const ExtensionWithSharedState = (props: Props & OverflowShadowProps) => {
  const { pluginInjectionApi } = props;
  const { widthState } = useSharedPluginState(pluginInjectionApi, ['width']);
  return <ExtensionWithPluginState widthState={widthState} {...props} />;
};

import { WithPluginState } from '@atlaskit/editor-common/with-plugin-state';
import type {
  PluginKey,
  EditorState,
} from '@atlaskit/editor-prosemirror/state';
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
const ExtensionDeprecated = (props: Props & OverflowShadowProps) => {
  return (
    <WithPluginState
      editorView={props.view}
      plugins={{
        widthState: widthPluginKey,
      }}
      render={({ widthState }) => (
        <ExtensionWithPluginState widthState={widthState} {...props} />
      )}
    />
  );
};
/**
 * End workaround
 */

export default overflowShadow(Extension, {
  overflowSelector: '.extension-overflow-wrapper',
});
