/** @jsx jsx */
import { ChangeEvent, Fragment, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import { AtlassianNavigation } from '../src';
import { NavigationSkeleton } from '../src/skeleton';

import { DefaultCreate } from './shared/create';
import { HelpPopup } from './shared/help-popup';
import { NotificationsPopup } from './shared/notifications-popup';
import { defaultPrimaryItems } from './shared/primary-items';
import { DefaultProductHome } from './shared/product-home';
import { ProfilePopup } from './shared/profile-popup';
import { DefaultSearch } from './shared/search';
import { DefaultSettings } from './shared/settings';
import { SwitcherPopup } from './shared/switcher-popup';

const controlsStyles = css({
  display: 'flex',
  margin: token('space.200', '1rem'),
  alignItems: 'center',
});

const labelStyles = css({
  margin: token('space.200', '1rem'),
});

const inputStyles = css({
  width: '3rem',
});

const InteractiveSkeletonExample = () => {
  const [isSkeleton, setIsSkeleton] = useState(true);
  const [itemCounts, setItemCounts] = useState({ primary: 4, secondary: 4 });
  const { primary, secondary } = itemCounts;
  const [shouldShowSearch, setShouldShowSearch] = useState(true);

  const setCounts =
    (key: string) =>
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
      setItemCounts({
        ...itemCounts,
        [key]: parseInt(value),
      });

  return (
    <Fragment>
      {isSkeleton ? (
        <NavigationSkeleton
          primaryItemsCount={primary}
          secondaryItemsCount={secondary}
          shouldShowSearch={shouldShowSearch}
        />
      ) : (
        <AtlassianNavigation
          label="site"
          primaryItems={defaultPrimaryItems}
          renderAppSwitcher={SwitcherPopup}
          renderCreate={DefaultCreate}
          renderHelp={HelpPopup}
          renderNotifications={NotificationsPopup}
          renderProductHome={DefaultProductHome}
          renderProfile={ProfilePopup}
          renderSearch={DefaultSearch}
          renderSettings={DefaultSettings}
        />
      )}
      <div css={controlsStyles}>
        <Button onClick={() => setIsSkeleton(!isSkeleton)}>
          Show {isSkeleton ? 'Navigation' : 'Skeleton'}
        </Button>
        <label css={labelStyles} htmlFor="primary">
          Primary Items
        </label>
        <input
          css={inputStyles}
          id="primary"
          max="4"
          min="0"
          onChange={setCounts('primary')}
          type="number"
          value={primary}
        />
        <label css={labelStyles} htmlFor="secondary">
          Secondary Items
        </label>
        <input
          css={inputStyles}
          id="secondary"
          max="4"
          min="0"
          onChange={setCounts('secondary')}
          type="number"
          value={secondary}
        />
        <label htmlFor="toggle-search">Toggle search</label>
        <input
          type="checkbox"
          checked={shouldShowSearch}
          onChange={() => setShouldShowSearch(!shouldShowSearch)}
          id="toggle-search"
        />
      </div>
    </Fragment>
  );
};

export default InteractiveSkeletonExample;
