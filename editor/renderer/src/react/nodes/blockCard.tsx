/** @jsx jsx */
import { useMemo } from 'react';
import { css, jsx } from '@emotion/react';
import { Card } from '@atlaskit/smart-card';
import {
  UnsupportedBlock,
  UnsupportedInline,
  WidthConsumer,
} from '@atlaskit/editor-common/ui';
import type { EventHandlers } from '@atlaskit/editor-common/ui';

import { getPlatform } from '../../utils';
import { CardErrorBoundary } from './fallback';
import type { RendererAppearance } from '../../ui/Renderer/types';
import { getCardClickHandler } from '../utils/getCardClickHandler';
import type { SmartLinksOptions } from '../../types/smartLinksOptions';
import InlineCard from './inlineCard';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import type { DatasourceAdfView } from '@atlaskit/link-datasource';
import { DatasourceTableView } from '@atlaskit/link-datasource';

import type { DatasourceAttributeProperties } from '@atlaskit/adf-schema/schema';
import { token } from '@atlaskit/tokens';
import { N40 } from '@atlaskit/theme/colors';
import {
  calcBreakoutWidth,
  canRenderDatasource,
} from '@atlaskit/editor-common/utils';

//  Temporary, until we add aspect ratio to the datasource table
const datasourceContainerStyle = css({
  borderRadius: `${token('border.radius.200', '8px')}`,
  border: `1px solid ${token('color.border', N40)}`,
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
  marginLeft: '50%',
  transform: 'translateX(-50%)',
});

export default function BlockCard(props: {
  url?: string;
  data?: object;
  eventHandlers?: EventHandlers;
  datasource?: DatasourceAttributeProperties;
  portal?: HTMLElement;
  rendererAppearance?: RendererAppearance;
  smartLinks?: SmartLinksOptions;
  layout?: string;
  isNodeNested?: boolean;
}) {
  const {
    url,
    data,
    eventHandlers,
    portal,
    rendererAppearance,
    smartLinks,
    isNodeNested,
  } = props;
  const { showServerActions, actionOptions } = smartLinks || {};
  const onClick = getCardClickHandler(eventHandlers, url);

  const platform = useMemo(
    () => getPlatform(rendererAppearance),
    [rendererAppearance],
  );

  const cardProps = {
    url,
    data,
    onClick,
    container: portal,
    isDatasource: !!props.datasource,
    actionOptions,
    showServerActions,
  };

  const analyticsData = {
    attributes: {
      location: 'renderer',
    },
    // Below is added for the future implementation of Linking Platform namespaced analytic context
    location: 'renderer',
  };

  const onError = ({ err }: { err?: Error }) => {
    if (err) {
      throw err;
    }
  };

  if (props.datasource) {
    if (platform === 'mobile') {
      return <InlineCard {...props} />;
    }

    const views = props.datasource.views as DatasourceAdfView[];
    const tableView = views.find((view) => view.type === 'table');
    const shouldRenderDatasource =
      tableView && canRenderDatasource(props.datasource.id);

    if (shouldRenderDatasource) {
      const visibleColumnKeys = tableView.properties?.columns.map(
        ({ key }) => key,
      );

      const columnCustomSizesEntries = tableView.properties?.columns
        .filter((c): c is { key: string; width: number } => !!c.width)
        .map<[string, number]>(({ key, width }) => [key, width]);

      const columnCustomSizes = columnCustomSizesEntries?.length
        ? Object.fromEntries<number>(columnCustomSizesEntries)
        : undefined;

      const { datasource, layout } = props;

      return (
        <AnalyticsContext data={analyticsData}>
          <CardErrorBoundary
            unsupportedComponent={UnsupportedInline}
            datasourceId={props.datasource.id}
            {...cardProps}
          >
            <WidthConsumer>
              {({ width }) => (
                <div
                  css={datasourceContainerStyle}
                  data-testid="renderer-datasource-table"
                  style={{
                    width: isNodeNested
                      ? '100%'
                      : calcBreakoutWidth(layout, width),
                  }}
                >
                  <DatasourceTableView
                    datasourceId={datasource.id}
                    parameters={datasource.parameters}
                    visibleColumnKeys={visibleColumnKeys}
                    columnCustomSizes={columnCustomSizes}
                    url={url}
                  />
                </div>
              )}
            </WidthConsumer>
          </CardErrorBoundary>
        </AnalyticsContext>
      );
    }

    return <InlineCard data={data} url={url} />;
  }

  return (
    <AnalyticsContext data={analyticsData}>
      <div
        className="blockCardView-content-wrap"
        data-block-card
        data-card-data={data ? JSON.stringify(data) : undefined}
        data-card-url={url}
      >
        <CardErrorBoundary
          unsupportedComponent={UnsupportedBlock}
          {...cardProps}
        >
          <Card
            appearance="block"
            platform={platform}
            {...cardProps}
            onError={onError}
          />
        </CardErrorBoundary>
      </div>
    </AnalyticsContext>
  );
}
