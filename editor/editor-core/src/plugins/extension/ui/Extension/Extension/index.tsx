/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import type {
  ExtensionProvider,
  ReferenceEntity,
} from '@atlaskit/editor-common/extensions';
import { overflowShadow } from '@atlaskit/editor-common/ui';
import type { OverflowShadowProps } from '@atlaskit/editor-common/ui';
import { calcBreakoutWidth } from '@atlaskit/editor-common/utils';
import {
  wrapperStyle,
  header,
  content,
  contentWrapper,
  widerLayoutClassName,
} from './styles';
import { overlay } from '../styles';
import ExtensionLozenge from '../Lozenge';
import { pluginKey as widthPluginKey } from '../../../../width';
import { EditorAppearance } from '../../../../../types/editor-appearance';
import WithPluginState from '../../../../../ui/WithPluginState';
import classnames from 'classnames';
import { ThemeProps } from '@atlaskit/theme/types';
export interface Props {
  node: PmNode;
  view: EditorView;
  extensionProvider?: ExtensionProvider;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  children?: React.ReactNode;
  references?: ReferenceEntity[];
  hideFrame?: boolean;
  editorAppearance?: EditorAppearance;
}

const Extension = (props: Props & OverflowShadowProps) => {
  const {
    node,
    handleContentDOMRef,
    children,
    view,
    handleRef,
    shadowClassNames,
    hideFrame,
    editorAppearance,
  } = props;

  const hasBody = node.type.name === 'bodiedExtension';
  const isMobile = editorAppearance === 'mobile';
  const hasChildren = !!children;
  const removeBorder = (hideFrame && !isMobile && !hasBody) || false;

  const classNames = classnames(
    'extension-container',
    'block',
    shadowClassNames,
    {
      'with-overlay': !hasBody,
      'without-frame': removeBorder,
      [widerLayoutClassName]: ['full-width', 'wide'].includes(
        node.attrs.layout,
      ),
    },
  );

  const headerClassNames = classnames({
    'with-children': hasChildren,
    'without-frame': removeBorder,
  });

  return (
    <WithPluginState
      editorView={view}
      plugins={{
        widthState: widthPluginKey,
      }}
      render={({ widthState = { width: 0 } }) => {
        return (
          <div
            ref={handleRef}
            data-layout={node.attrs.layout}
            className={classNames}
            css={(theme: ThemeProps) => {
              const extensionWidth = calcBreakoutWidth(
                node.attrs.layout,
                widthState.width,
              );
              return wrapperStyle(theme, extensionWidth);
            }}
          >
            <div
              className={`extension-overflow-wrapper ${
                hasBody ? 'with-body' : ''
              }`}
            >
              <div css={overlay} className="extension-overlay" />
              <div
                css={header}
                contentEditable={false}
                className={headerClassNames}
              >
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
      }}
    />
  );
};

export default overflowShadow(Extension, {
  overflowSelector: '.extension-overflow-wrapper',
});
