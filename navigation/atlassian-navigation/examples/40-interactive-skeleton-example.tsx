/** @jsx jsx */
import { ChangeEvent, Fragment, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';

import { AtlassianNavigation } from '../src';
import { NavigationSkeleton } from '../src/skeleton';

import { DefaultCreate } from './shared/Create';
import { HelpPopup } from './shared/HelpPopup';
import { NotificationsPopup } from './shared/NotificationsPopup';
import { defaultPrimaryItems } from './shared/PrimaryItems';
import { DefaultProductHome } from './shared/ProductHome';
import { ProfilePopup } from './shared/ProfilePopup';
import { DefaultSearch } from './shared/Search';
import { DefaultSettings } from './shared/Settings';
import { SwitcherPopup } from './shared/SwitcherPopup';

const controlsStyles = css({
  display: 'flex',
  margin: '1rem',
  alignItems: 'center',
});

const labelStyles = css({
  margin: '1rem',
});

const inputStyles = css({
  width: '3rem',
});

const InteractiveSkeletonExample = () => {
  const [isSkeleton, setIsSkeleton] = useState(true);
  const [itemCounts, setItemCounts] = useState({ primary: 4, secondary: 4 });
  const { primary, secondary } = itemCounts;
  const [shouldShowSearch, setShouldShowSearch] = useState(true);

  const setCounts = (key: string) => ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) =>
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
