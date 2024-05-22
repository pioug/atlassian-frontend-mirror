/** @jsx jsx */
import { useCallback, useMemo } from 'react';

import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { Popup } from '@atlaskit/editor-common/ui';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import { getNextBreakoutMode, getTitle } from '@atlaskit/editor-common/utils';
import CollapseIcon from '@atlaskit/icon/glyph/editor/collapse';
import ExpandIcon from '@atlaskit/icon/glyph/editor/expand';
import { DATASOURCE_DEFAULT_LAYOUT } from '@atlaskit/linking-common';
import { B300, N20A, N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { setCardLayout } from '../../pm-plugins/actions';

import type {
  DatasourceTableLayout,
  LayoutButtonProps,
  LayoutButtonWrapperProps,
} from './types';
import { getDatasource } from './utils';

const toolbarButtonWrapperStyles = css({
  background: `${token('color.background.neutral', N20A)}`,
  color: `${token('color.icon', N300)}`,
  ':hover': {
    background: `${token('color.background.neutral.hovered', B300)}`,
    color: `${token('color.icon', 'white')} !important`,
  },
});

export const LayoutButton = ({
  onLayoutChange,
  layout = DATASOURCE_DEFAULT_LAYOUT,
  intl: { formatMessage },
  mountPoint,
  boundariesElement,
  scrollableElement,
  targetElement,
  testId = 'datasource-table-layout-button',
}: LayoutButtonProps) => {
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
        css={toolbarButtonWrapperStyles}
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

const LayoutButtonWrapper = ({
  editorView,
  mountPoint,
  scrollableElement,
  boundariesElement,
  intl,
  api,
}: LayoutButtonWrapperProps & WrappedComponentProps) => {
  const { cardState } = useSharedPluginState(api, ['card']);
  const { node, pos } = getDatasource(editorView);

  //  If layout doesn't exist in ADF it returns null, we want to change to undefined
  //  which results in default parameter value being used in LayoutButton.
  const { datasourceTableRef, layout = node?.attrs?.layout || undefined } =
    cardState ?? {};

  const isDatasource = !!node?.attrs?.datasource;

  const onLayoutChange = (layout: DatasourceTableLayout) => {
    if (pos === undefined) {
      return;
    }

    const { state, dispatch } = editorView;
    // If the button does not re-render due to no card state change, node reference will be stale
    const datasourceNode = getDatasource(editorView).node ?? node;

    const tr = state.tr.setNodeMarkup(pos, undefined, {
      ...datasourceNode?.attrs,
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
