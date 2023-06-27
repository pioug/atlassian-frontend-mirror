/** @jsx jsx */
import { useMemo } from 'react';
import { css, jsx } from '@emotion/react';
import { Card } from '@atlaskit/smart-card';
import { UnsupportedBlock } from '@atlaskit/editor-common/ui';
import type { EventHandlers } from '@atlaskit/editor-common/ui';

import { getPlatform } from '../../utils';
import { CardErrorBoundary } from './fallback';
import { RendererAppearance } from '../../ui/Renderer/types';
import { getCardClickHandler } from '../utils/getCardClickHandler';
import { SmartLinksOptions } from '../../types/smartLinksOptions';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import {
  DatasourceAdfView,
  DatasourceTableView,
} from '@atlaskit/link-datasource';

import type { DatasourceAttributeProperties } from '@atlaskit/adf-schema/schema';

//  Temporary, until we add aspect ratio to the datasource table
const datasourceContainerStyle = css({
  height: '500px',
  overflow: 'auto',
});

export default function BlockCard(props: {
  url?: string;
  data?: object;
  eventHandlers?: EventHandlers;
  datasource?: DatasourceAttributeProperties;
  portal?: HTMLElement;
  rendererAppearance?: RendererAppearance;
  smartLinks?: SmartLinksOptions;
}) {
  const { url, data, eventHandlers, portal, rendererAppearance, smartLinks } =
    props;
  const { showServerActions } = smartLinks || {};
  const onClick = getCardClickHandler(eventHandlers, url);

  const platform = useMemo(
    () => getPlatform(rendererAppearance),
    [rendererAppearance],
  );

  const cardProps = { url, data, onClick, container: portal };

  const analyticsData = {
    attributes: {
      location: 'renderer',
    },
    // Below is added for the future implementation of Linking Platform namespaced analytic context
    location: 'renderer',
  };

  if (props.datasource) {
    const views = props.datasource.views as DatasourceAdfView[];
    const tableView = views.find((view) => view.type === 'table');
    if (tableView) {
      const visibleColumnKeys = tableView.properties?.columns.map(
        ({ key }) => key,
      );
      return (
        <AnalyticsContext data={analyticsData}>
          <div css={datasourceContainerStyle}>
            <CardErrorBoundary
              unsupportedComponent={UnsupportedBlock}
              {...cardProps}
            >
              <DatasourceTableView
                datasourceId={props.datasource.id}
                parameters={props.datasource.parameters}
                visibleColumnKeys={visibleColumnKeys}
                onVisibleColumnKeysChange={undefined}
              />
            </CardErrorBoundary>
          </div>
        </AnalyticsContext>
      );
    }
    return null;
  }

  const onError = ({ err }: { err?: Error }) => {
    if (err) {
      throw err;
    }
  };

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
            showActions={rendererAppearance !== 'mobile'}
            platform={platform}
            showServerActions={showServerActions}
            {...cardProps}
            onError={onError}
          />
        </CardErrorBoundary>
      </div>
    </AnalyticsContext>
  );
}
