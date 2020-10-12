import React, { Fragment } from 'react';

import { NavigationSkeleton } from '../src/skeleton';

import { themes } from './shared/themes';

const primary = 4;
const secondary = 4;

const ThemedSkeletonExample = () => (
  <div>
    {themes.map((theme, i) => (
      <Fragment key={i}>
        <NavigationSkeleton
          primaryItemsCount={primary}
          secondaryItemsCount={secondary}
          showSiteName
          theme={theme}
        />
        {i < themes.length - 1 && <br />}
      </Fragment>
    ))}
  </div>
);

export default ThemedSkeletonExample;
