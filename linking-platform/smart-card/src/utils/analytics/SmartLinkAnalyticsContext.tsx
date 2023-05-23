import React, { FC, useMemo } from 'react';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import {
  getResolvedAttributes,
  getUrlAttributes,
} from '@atlaskit/link-analytics/resolved-attributes';
import { isFlexibleUiCard } from '../flexible';
import { CardDisplay } from '../../constants';
import { useSmartCardState as useSmartLinkState } from '../../state/store';
import { CardInnerAppearance } from '../../view/Card/types';

type SmartLinkAnalyticsContextProps = {
  url: string;
  appearance: CardInnerAppearance;
  id: string | undefined;
  source?: string;
};

export const SmartLinkAnalyticsContext: FC<SmartLinkAnalyticsContextProps> = ({
  children,
  url,
  appearance,
  id,
  source,
}) => {
  const { details, status } = useSmartLinkState(url);
  const resolvedAttributes = getResolvedAttributes({ url }, details, status);
  const { urlHash } = getUrlAttributes(url);

  const isFlexibleUi = useMemo(() => isFlexibleUiCard(children), [children]);
  const display = isFlexibleUi ? CardDisplay.Flexible : appearance;

  return (
    <AnalyticsContext
      data={{
        source,
        attributes: {
          ...resolvedAttributes,
          urlHash,
          display,
          id,
        },
      }}
    >
      {children}
    </AnalyticsContext>
  );
};
