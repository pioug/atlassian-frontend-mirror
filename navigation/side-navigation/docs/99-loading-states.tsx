import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Occasionally you will need to asynchronously load some of your side nav.
  There are a few things to take care of:

  1. Only use skeletons when you're quite certain of what the loaded state will look like.
  The majority of items that would appear in side navigation are probably fine to use with skeletons,
  for example \`@atlaskit/tree\`
  1. When transitioning from loading skeleton to loaded items try to ensure the jump does not look janky - use the equivalent skeleton item that is appropriate and be careful of things jumping around by a few pixels
  We should be striving for UI that **feels solid**,
  which means it doesn't jump around
  1. Ensure loading does not take _too_ long - try to anticipate if a user will look at your menu via hover events and the like and pre-load the data as soon as you can
  1. When content is loading in make sure it all loads in at once altogether - our minds aren't fast enough to distinguish each item loading individually for example,
  and it would appear slower to the majority of users

  For a more in-depth look at how to approach loading states have our _work in progress_ [Skeleton exploration](https://hello.atlassian.net/wiki/spaces/ADG/pages/598816601/Loading+experiences+-+3.4+-+Guideline+exploration+-+Skeleton#Exploration-(spec)) (only Atlassians will be able to access this link unfortuntely).

  ${code`highlight=1,9-17,21
import {
  LoadingItems,
  SectionHeading,
  SkeletonItem
} from '@atlaskit/side-navigation';

<SideNavigation>
  <NavigationContent>
    <LoadingItems
      isLoading={isLoading}
      fallback={
        <>
          <SectionHeading>Project settings</SectionHeading>
          <SkeletonItem />
        </>
      }
    >
      <Section title="Project settings">
        <ButtonItem>Details</ButtonItem>
      </Section>
    </LoadingItems>
  <NavigationContent>
<SideNavigation>
  `}

  ${(
    <Example
      title=""
      Component={require('../examples/07-loading-section.tsx').default}
      source={require('!!raw-loader!../examples/07-loading-section.tsx')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/LoadingItems')}
    />
  )}

  ## React Suspense

  If you're using [Suspense](https://reactjs.org/docs/code-splitting.html#reactlazy) you'll want to use it instead of using the loading items component.
  Unfortunately you won't be able to cross-fade between states,
  but you will simplify your code quite a bit.

  ${code`highlight=1,6-15
import { Suspense } from 'react';
import { SectionHeading, SkeletonItem } from '@atlaskit/side-navigation';

<SideNavigation>
  <NavigationContent>
    <Suspense
      fallback={
        <>
          <SectionHeading>Project settings</SectionHeading>
          <SkeletonItem />
        </>
      }
    >
      <LazyItems />
    </Suspense>
  <NavigationContent>
<SideNavigation>
  `}

  ${(
    <Example
      title=""
      Component={require('../examples/08-suspense-loading-section.tsx').default}
      source={require('!!raw-loader!../examples/08-suspense-loading-section.tsx')}
    />
  )}
`;
