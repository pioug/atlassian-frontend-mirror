import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  This package contains a number of components to help highlight product changes to users.
  These components can be used together to implement various
  [First Impressions](https://atlassian.design/guidelines/product/first-impressions/first-impressions-overview)
  patterns.

  ## Usage

  ${code`import {
  Modal,
  Spotlight,
  SpotlightCard,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
  SpotlightPulse
} from '@atlaskit/onboarding';`}

  ## Spotlight

  This component can be used implement a spotlight tour.

  ${(
    <Example
      packageName="@atlaskit/onboarding"
      Component={require('../examples/10-spotlight-basic').default}
      title="Spotlight Tour"
      source={require('!!raw-loader!../examples/10-spotlight-basic')}
    />
  )}

  ${(
    <Props
      heading="Spotlight Props"
      props={require('!!extract-react-types-loader!../src/components/Spotlight')}
    />
  )}

  ## SpotlightCard

  The example below the number of appearances.

  ${(
    <Example
      packageName="@atlaskit/onboarding"
      Component={require('../examples/00-different-spotlights').default}
      title="Spotlight Cards"
      source={require('!!raw-loader!../examples/00-different-spotlights')}
    />
  )}

  ${(
    <Props
      heading="SpotlightCard Props"
      props={require('!!extract-react-types-loader!../src/components/SpotlightCard')}
    />
  )}

  ## Benefits Modal

  If the product change is large enough, this component can be used to outline the
  benefits of the change to the user.

  ${(
    <Example
      packageName="@atlaskit/onboarding"
      Component={require('../examples/99-modal-basic').default}
      title="Benefits Modal"
      source={require('!!raw-loader!../examples/99-modal-basic')}
    />
  )}

  ${(
    <Props
      heading="Benefits Modal Props"
      props={require('!!extract-react-types-loader!../src/components/Modal')}
    />
  )}

`;
