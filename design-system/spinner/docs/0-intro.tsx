import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Spinners are used for showing a system process of unknown length going on
  that ends with the system displaying results to the user.

  ## Usage

  ${code`import Spinner from '@atlaskit/spinner';`}

  ${(
    <Example
      packageName="@atlaskit/spinner"
      Component={require('../examples/0-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-basic')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/spinner"
      Component={require('../examples/1-sizes').default}
      title="Different sizes"
      source={require('!!raw-loader!../examples/1-sizes')}
    />
  )}

  ## Theming

  A spinner will respect the current theme. You can invert the color of a spinner by setting \`appearance="invert"\`. This is useful when you are displaying a spinner on a background that is not the same mode as the body.

  ${(
    <Example
      packageName="@atlaskit/spinner"
      Component={require('../examples/theming').default}
      title="Theming"
      source={require('!!raw-loader!../examples/theming')}
    />
  )}

  ## Animation 🤹‍♀️

  A spinner will always animate itself in. For graceful exit animations we recommend that you use \`<FadeIn />\` from [@atlaskit/motion](/packages/design-system/motion)

  ${(
    <Example
      packageName="@atlaskit/spinner"
      Component={require('../examples/animated-exit').default}
      title="Animated exit"
      source={require('!!raw-loader!../examples/animated-exit')}
    />
  )}

  ## Delaying a spinner

  Sometimes you might want to delay showing a spinner when loading something asynchronously.

  ### Spinner flashing

  The \`<Spinner />\` is only visible to a user after \`150-200ms\` of being rendered because of it's opacity fade in. There is no need to delay a spinner to prevent it quickly flashing on an initial load. If you are concerned about having a spinner flash quickly and then harshly be removed, we recommend that you use \`<FadeIn />\` from [@atlaskit/motion](/packages/design-system/motion) to gracefully animate the unmount of a spinner.

  ### Long pausing

  Sometimes you will want to delay a spinner from showing for a longer period of time. React solves this problem at a library level with [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html). However, given that Suspense is still experimental, you might not want to lean into it just yet.

  A spinner has a \`delay\` prop that can be used to achieve long pausing. You can set the value to \`500-1000+ ms\` to prevent a spinner from being shown for a longer period of time.

  For best results, use \`<FadeIn />\` from [@atlaskit/motion](/packages/design-system/motion) to fade out the spinner. It is still possible for the spinner to show briefly when your async operation takes slightly longer than your long delay. So fading out your spinner will always look the nicest

  ${(
    <Example
      packageName="@atlaskit/spinner"
      Component={require('../examples/delaying').default}
      title="Delaying"
      source={require('!!raw-loader!../examples/delaying')}
    />
  )}


  ${(
    <Props
      heading="Spinner Props"
      props={require('!!extract-react-types-loader!../src')}
    />
  )}
`;
