/* eslint-disable @atlaskit/design-system/prefer-primitives */
/** @jsx jsx */

import { jsx } from '@emotion/react';
// eslint-disable-next-line @typescript-eslint/no-duplicate-imports
import { css } from '@emotion/react';

import { N40 } from '@atlaskit/theme/colors';
import React, { useState } from 'react';
import { renderExtension } from './extension';
import ExtensionRenderer from '../../ui/ExtensionRenderer';
import type {
  Mark as PMMark,
  Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import type { RendererContext } from '../types';
import type { Serializer } from '../..';
import type { ExtensionLayout } from '@atlaskit/adf-schema';
import type {
  ExtensionHandlers,
  MultiBodiedExtensionActions,
} from '@atlaskit/editor-common/extensions';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
  WidthConsumer,
  sharedMultiBodiedExtensionStyles,
} from '@atlaskit/editor-common/ui';
import { RendererCssClassName } from '../../consts';
import { calcBreakoutWidth } from '@atlaskit/editor-common/utils';
import { token } from '@atlaskit/tokens';

export type Props = React.PropsWithChildren<{
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
  marks?: PMMark[];
}>;

type ActionsProps = {
  updateActiveChild: (index: number) => boolean;
  children: any;
};
const useMultiBodiedExtensionActions = ({
  updateActiveChild,
  children,
}: ActionsProps) => {
  const actions: MultiBodiedExtensionActions = React.useMemo(() => {
    return {
      changeActive(index: number) {
        return updateActiveChild(index);
      },
      addChild() {
        return false;
      },
      getChildrenCount(): number {
        return children ? children?.length : 0;
      },
      removeChild(index: number) {
        return false;
      },
      updateParameters(parameters): boolean {
        return false;
      },
      getChildren(): Array<any> {
        return [];
      },
    };
  }, [updateActiveChild, children]);

  return actions;
};

const navigationCssExtended = css`
  ${sharedMultiBodiedExtensionStyles.mbeNavigation};
  margin-left: 0 !important;
  margin-right: 0 !important;
  .mbe-add-tab-button,
  .mbe-remove-tab {
    display: none;
  }
`;

const MultiBodiedExtension = (props: Props) => {
  const { children, layout = 'default', path = [] } = props;
  const [activeChildIndex, setActiveChildIndex] = useState<number>(0);

  const removeOverflow = React.Children.toArray(children)
    .map((child) =>
      React.isValidElement<any>(child)
        ? child.props.nodeType === 'table'
        : false,
    )
    .every(Boolean);
  const overflowContainerClass = !removeOverflow
    ? RendererCssClassName.EXTENSION_OVERFLOW_CONTAINER
    : '';
  const updateActiveChild = React.useCallback(
    (index: number) => {
      if (typeof index !== 'number') {
        // TODO: Make sure we log this somewhere if this happens
        setActiveChildIndex(0);
        return false;
      }

      setActiveChildIndex(index);
      return true;
    },
    [setActiveChildIndex],
  );

  const actions = useMultiBodiedExtensionActions({
    updateActiveChild,
    children,
  });
  const containerCssExtended = css`
    ${sharedMultiBodiedExtensionStyles.mbeExtensionContainer};
    .ak-renderer-extension {
      margin-top: 0 !important;
    }

    [data-layout='full-width'],
    [data-layout='wide'] {
      .multiBodiedExtension-navigation {
        border-right: 3px solid ${token('color.border', N40)} !important;
      }
    }

    .multiBodiedExtension--frames
      > [data-extension-frame='true']:nth-of-type(${activeChildIndex + 1}) {
      ${sharedMultiBodiedExtensionStyles.extensionFrameContent}
      margin-left: 0;
      margin-right: 0;
    }
  `;
  const isTopLevel = path.length < 1;
  const centerAlignClass =
    isTopLevel && ['wide', 'full-width'].includes(layout)
      ? RendererCssClassName.EXTENSION_CENTER_ALIGN
      : '';

  function renderMbeContent(width: number): React.ReactNode {
    return (
      <div
        className={`${RendererCssClassName.EXTENSION} ${centerAlignClass} ${overflowContainerClass}`}
        style={{
          width: isTopLevel ? calcBreakoutWidth(layout, width) : '100%',
        }}
        data-layout={layout}
      >
        <nav
          className="multiBodiedExtension-navigation"
          css={navigationCssExtended}
          data-testid="multiBodiedExtension-navigation"
        >
          <ExtensionRenderer
            {...props}
            actions={actions}
            type="multiBodiedExtension"
          >
            {({ result }) => {
              try {
                if (result && React.isValidElement(result)) {
                  // Return the content directly if it's a valid JSX.Element
                  return renderExtension(result, layout, {
                    isTopLevel: path.length < 1,
                  });
                }
              } catch (e) {
                /** We don't want this error to block renderer */
                /** We keep rendering the default content */
              }

              // Always return default content if anything goes wrong
              return renderExtension(children, layout, {
                isTopLevel: path.length < 1,
              });
            }}
          </ExtensionRenderer>
        </nav>
        <article
          data-testid="multiBodiedExtension--frames"
          className={`multiBodiedExtension--frames`}
        >
          {children}
        </article>
      </div>
    );
  }

  return (
    <section
      className="multiBodiedExtension--container"
      css={containerCssExtended}
      data-testid="multiBodiedExtension--container"
      data-active-child-index={activeChildIndex}
      data-layout={layout}
    >
      <WidthConsumer>{({ width }) => renderMbeContent(width)}</WidthConsumer>
    </section>
  );
};

export default MultiBodiedExtension;
