import React from 'react';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import { getResolvedAttributes } from '@atlaskit/link-analytics/resolved-attributes';
import { isFlexibleUiCard } from '../flexible';
import { CardDisplay } from '../../constants';
import { useSmartCardState as useSmartLinkState } from '../../state/store';
import { CardInnerAppearance } from '../../view/Card/types';
import { LinkAnalyticsContext } from './LinkAnalyticsContext';

type SmartLinkAnalyticsContextProps = {
  url: string;
  appearance: CardInnerAppearance;
  id?: string | undefined;
  source?: string;
  children?: React.ReactNode;
};

/**
 * Provides an analytics context to supply attributes to events based on a URL
 * and the link state in the store
 */
export const SmartLinkAnalyticsContext = (
  props: SmartLinkAnalyticsContextProps,
) => {
  const { children, appearance, url } = props;
  const { details, status } = useSmartLinkState(url);
  const attributes = getResolvedAttributes({ url }, details, status);
  const display = isFlexibleUiCard(children)
    ? CardDisplay.Flexible
    : appearance;

  return (
    <LinkAnalyticsContext {...props} display={display}>
      <AnalyticsContext
        data={{
          attributes,
        }}
      >
        {children}
      </AnalyticsContext>
    </LinkAnalyticsContext>
  );
};
