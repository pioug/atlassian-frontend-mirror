import React from 'react';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import {
  calcBreakoutWidth,
  overflowShadow,
  OverflowShadowProps,
  ExtensionProvider,
} from '@atlaskit/editor-common';
import { ADFEntity } from '@atlaskit/adf-utils';
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
import WithPluginState from '../../../../../ui/WithPluginState';
import classnames from 'classnames';
export interface Props {
  node: PmNode;
  view: EditorView;
  extensionProvider?: ExtensionProvider;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  children?: React.ReactNode;
  refNode?: ADFEntity;
}

const Extension = (props: Props & OverflowShadowProps) => {
  const {
    node,
    handleContentDOMRef,
    children,
    view,
    handleRef,
    shadowClassNames,
  } = props;

  const hasBody = node.type.name === 'bodiedExtension';
  const hasChildren = !!children;

  const classNames = classnames(
    'extension-container',
    'block',
    shadowClassNames,
    {
      'with-overlay': !hasBody,
      [widerLayoutClassName]: ['full-width', 'wide'].includes(
        node.attrs.layout,
      ),
    },
  );

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
              <Header
                contentEditable={false}
                className={hasChildren ? 'with-children' : ''}
              >
                <ExtensionLozenge node={node} />
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
