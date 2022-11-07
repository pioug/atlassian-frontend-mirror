/** @jsx jsx */
import React, { CSSProperties } from 'react';
import { jsx } from '@emotion/react';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
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
import {
  pluginKey as widthPluginKey,
  WidthPluginState,
} from '../../../../width';
import { ProsemirrorGetPosHandler } from '../../../../../nodeviews';
import { EditorAppearance } from '../../../../../types/editor-appearance';
import WithPluginState from '../../../../../ui/WithPluginState';
import classnames from 'classnames';

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

  const hasBody = node.type.name === 'bodiedExtension';
  const isMobile = editorAppearance === 'mobile';
  const hasChildren = !!children;
  const removeBorder = (hideFrame && !isMobile && !hasBody) || false;
  const shouldBreakout =
    // Extension should breakout when the layout is set to 'full-width' or 'wide'.
    ['full-width', 'wide'].includes(node.attrs.layout) &&
    // Extension breakout state should only be respected for top level nodes.
    props.view.state.doc.resolve(props.getPos()).depth === 0 &&
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

  let customContainerStyles: CSSProperties = {};

  if (shouldBreakout) {
    const { type, ...breakoutStyles } = calculateBreakoutStyles({
      mode: node.attrs.layout,
      widthStateWidth: widthState.width,
      widthStateLineLength: widthState.lineLength,
    });

    customContainerStyles = breakoutStyles;
  }
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
          <div css={contentWrapper}>
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

export default overflowShadow(Extension, {
  overflowSelector: '.extension-overflow-wrapper',
});
