import React from 'react';
import { code, md } from '@atlaskit/docs';

import { ContentsProvider, H } from './shared';

export default (
  <ContentsProvider>{md`

  ${(<H>Entrypoints</H>)}

  These are entrypoints for specific components to be used carefully by the consumers. If you're using one of these entrypoints we are assuming you know what you are doing. So it means that code-splitting and tree-shaking should be done on the consumer/product side.

  ${(<H>Creating an entrypoint</H>)}

  You just need to create a file in the root of \`src\` folder exporting your component and it will be available for your consumers after publish. By default all the entrypoints are using \`esm\` bundles.

  EX:

  At \`src/LayoutManagerWithViewController.js\` we have a file with content of


  And, in build time, the import will be changed to point to \`./dist/esm\`

  ${code`
  
  export {
    default as LayoutManagerWithViewController,
  } from './components/connected/LayoutManagerWithViewController';

  `}

  ${(<H>How to use it</H>)}

  ${code`
  import { LayoutManagerWithViewController } from '@atlaskit/navigation-next/LayoutManagerWithViewController';
  import { ItemsRenderer } from '@atlaskit/navigation-next/ItemsRenderer';
  import { SkeletonContainerView } from '@atlaskit/navigation-next/SkeletonContainerView';
  import { NavigationProvider } from '@atlaskit/navigation-next/NavigationProvider';
  import { AsyncLayoutManagerWithViewController } from '@atlaskit/navigation-next/AsyncLayoutManagerWithViewController';
  import {
    ViewController,
    ViewControllerSubscriber,
    withNavigationViewController,
    viewReducerUtils,
  } from '@atlaskit/navigation-next/view-controller';
  import {
    UIController,
    UIControllerSubscriber,
    withNavigationUIController,
  } from '@atlaskit/navigation-next/ui-controller';
  `}

  ## Exposed entrypoints

  * \`atlaskit/navigation-next/LayoutManagerWithViewController\`
  * \`atlaskit/navigation-next/ItemsRenderer\`
  * \`atlaskit/navigation-next/SkeletonContainerView\`
  * \`atlaskit/navigation-next/NavigationProvider\`
  * \`atlaskit/navigation-next/AsyncLayoutManagerWithViewController\`
  * \`atlaskit/navigation-next/GlobalNavigationSkeleton\`
  * \`atlaskit/navigation-next/view-controller\`
  * \`atlaskit/navigation-next/ui-controller\`

`}</ContentsProvider>
);
