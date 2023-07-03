/** @jsx jsx */
import React, { useCallback, useMemo } from 'react';
import { jsx } from '@emotion/react';
import { Popup } from '@atlaskit/editor-common/ui';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import CollapseIcon from '@atlaskit/icon/glyph/editor/collapse';
import ExpandIcon from '@atlaskit/icon/glyph/editor/expand';

import { WrappedComponentProps, injectIntl } from 'react-intl-next';
import { toolbarButtonWrapper } from './styled';
import {
  DatasourceTableLayout,
  LayoutButtonProps,
  LayoutButtonWrapperProps,
} from './types';
import { getDatasource } from './utils';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { setCardLayout } from '../../pm-plugins/actions';
import { getNextBreakoutMode, getTitle } from '@atlaskit/editor-common/utils';

export const LayoutButton: React.FC<LayoutButtonProps> = ({
  onLayoutChange,
  layout = 'center',
  intl: { formatMessage },
  mountPoint,
  boundariesElement,
  scrollableElement,
  targetElement,
  testId = 'datasource-table-layout-button',
}) => {
  const handleClick = useCallback(() => {
    onLayoutChange && onLayoutChange(getNextBreakoutMode(layout));
  }, [layout, onLayoutChange]);

  const title = useMemo(() => {
    return formatMessage(getTitle(layout));
  }, [formatMessage, layout]);

  if (!targetElement) {
    return null;
  }

  return (
    <Popup
      mountTo={mountPoint}
      boundariesElement={boundariesElement}
      scrollableElement={scrollableElement}
      target={targetElement}
      alignY="start"
      alignX="end"
      forcePlacement={true}
      stick={true}
      ariaLabel={title}
    >
      <ToolbarButton
        testId={testId}
        css={toolbarButtonWrapper}
        title={title}
        onClick={handleClick}
        iconBefore={
          layout === 'full-width' ? (
            <CollapseIcon label={title} />
          ) : (
            <ExpandIcon label={title} />
          )
        }
      />
    </Popup>
  );
};

const LayoutButtonWrapper: React.FC<
  LayoutButtonWrapperProps & WrappedComponentProps
> = ({
  editorView,
  mountPoint,
  scrollableElement,
  boundariesElement,
  intl,
  api,
}) => {
  const { cardState } = useSharedPluginState(api, ['card']);
  const { node, pos } = getDatasource(editorView);

  const { datasourceTableRef, layout = node?.attrs?.layout || 'center' } =
    cardState ?? {};

  const isDatasource = !!node?.attrs?.datasource;

  const onLayoutChange = (layout: DatasourceTableLayout) => {
    if (pos === undefined) {
      return;
    }

    const { state, dispatch } = editorView;

    const tr = state.tr.setNodeMarkup(pos, undefined, {
      ...node?.attrs,
      layout,
    });

    tr.setMeta('scrollIntoView', false);

    dispatch(setCardLayout(layout)(tr));
  };

  if (!isDatasource) {
    return null;
  }

  return (
    <LayoutButton
      mountPoint={mountPoint}
      scrollableElement={scrollableElement}
      boundariesElement={boundariesElement}
      targetElement={datasourceTableRef!}
      layout={layout}
      onLayoutChange={onLayoutChange}
      intl={intl}
    />
  );
};

export default injectIntl(LayoutButtonWrapper);
