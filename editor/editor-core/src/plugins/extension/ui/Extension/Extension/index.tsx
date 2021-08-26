import React from 'react';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import {
  calcBreakoutWidth,
  overflowShadow,
  OverflowShadowProps,
  ExtensionProvider,
  ReferenceEntity,
} from '@atlaskit/editor-common';
import {
  Wrapper,
  Header,
  Content,
  ContentWrapper,
  widerLayoutClassName,
} from './styles';
import { Overlay } from '../styles';
import ExtensionLozenge from '../Lozenge';
import { pluginKey as widthPluginKey } from '../../../../width';
import { EditorAppearance } from '../../../../../types/editor-appearance';
import WithPluginState from '../../../../../ui/WithPluginState';
import classnames from 'classnames';
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
          <Wrapper
            innerRef={handleRef}
            data-layout={node.attrs.layout}
            className={classNames}
            extensionWidth={calcBreakoutWidth(
              node.attrs.layout,
              widthState.width,
            )}
          >
            <div
              className={`extension-overflow-wrapper ${
                hasBody ? 'with-body' : ''
              }`}
            >
              <Overlay className="extension-overlay" />
              <Header contentEditable={false} className={headerClassNames}>
                {!removeBorder && <ExtensionLozenge node={node} />}
                {children}
              </Header>
              {hasBody && (
                <ContentWrapper>
                  <Content
                    innerRef={handleContentDOMRef}
                    className="extension-content block"
                  />
                </ContentWrapper>
              )}
            </div>
          </Wrapper>
        );
      }}
    />
  );
};

export default overflowShadow(Extension, {
  overflowSelector: '.extension-overflow-wrapper',
});
