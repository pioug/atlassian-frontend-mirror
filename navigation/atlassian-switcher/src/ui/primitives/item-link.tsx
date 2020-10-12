import React from 'react';
import Button, { ButtonProps } from '@atlaskit/button';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import {
  WithAnalyticsEventsProps,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { UI_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import { SwitcherItemType } from '../../common/utils/links';
import {
  createAndFireNavigationEvent,
  SWITCHER_ITEM_SUBJECT,
} from '../../common/utils/analytics';

type ItemLinkOwnProps = {
  actionSubject?: string;
  css?: ButtonProps['css'];
  iconAfter?: ButtonProps['iconAfter'];
  testId?: ButtonProps['testId'];
};

type ItemLinkProps = Pick<
  SwitcherItemType,
  Exclude<Exclude<keyof SwitcherItemType, 'Icon'>, 'key'>
> &
  WithAnalyticsEventsProps &
  ItemLinkOwnProps & { onClick?: Function };

const ItemLink = ({ label, href, css, testId, onClick }: ItemLinkProps) => {
  return (
    <Button
      appearance="link"
      href={href}
      css={css}
      className="section-link"
      target="_blank"
      rel="noopener noreferrer"
      iconAfter={<ShortcutIcon size="small" label="" />}
      onClick={onClick ? (e, a) => onClick(e, a) : undefined}
      testId={testId}
    >
      {label}
    </Button>
  );
};

export default withAnalyticsEvents({
  onClick: createAndFireNavigationEvent({
    eventType: UI_EVENT_TYPE,
    action: 'clicked',
    actionSubject: SWITCHER_ITEM_SUBJECT,
  }),
})(ItemLink);
