import React from 'react';
import { md, code, Props, AtlassianInternalWarning } from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}
  
  A search component that connects to the Atlassian cross-product search backend.

  ## Usage (GlobalQuickSearch)

  Primary use case for the component is to be displayed in Navigation. Put in the drawers prop of the Navigation component as follows:

  ${code`
  import { GlobalQuickSearch, SearchSessionProvider } from '@atlaskit/global-search';

    <Navigation
      drawers={[
        <AkSearchDrawer ...props>
          <SearchSessionProvider>
            <GlobalQuickSearch cloudId="{cloudId} />
          </SearchSessionProvider>
        </AkSearchDrawer>,
      ]}
    </Navigation>
  `}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/GlobalQuickSearch')}
    />
  )}

  ## Usage (SearchSessionProvider)
  
  This is used to ensure that the GlobalQuickSearch produces the correct analytics. 

  It is recommended that the SearchSessionProvider is always used though it is not required. The SearchSessionProvider 
  should live just beneath the navigation draw component to ensure that it is mounted (and unmounted) if and only if 
  the draw itself is unmounted.
`;
