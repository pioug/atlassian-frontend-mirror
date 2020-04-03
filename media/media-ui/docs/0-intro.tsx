import React from 'react';
import {
  md,
  code,
  Example,
  Props,
  AtlassianInternalWarning,
} from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}

  This package includes common components and utilities used by other media packages.

  It exports two componets:

  - BlockCard
  - InlineCard

  Each of them expose the list of sub-views:

  - Resolving
  - Forbidden
  - Unauthorised
  - Errored
  - Resolved

  ## Usage

  ### InlineCard

  ${code`import {
    InlineCardResolvedView,
    InlineCardResolvingView,
    InlineCardErroredView,
    InlineCardForbiddenView,
    InlineCardUnauthorizedView,
  } from '@atlaskit/media-ui';`}

  ### BlockCard

  ${code`import {
    BlockCardResolvingView,
    BlockCardErroredView,
    BlockCardUnauthorisedView,
    BlockCardForbiddenView,
    BlockCardResolvedView,
  } from '@atlaskit/media-ui';`}

    ${(
      <Example
        Component={require('../examples/inline-card-view').default}
        title="Inline Card View"
        source={require('!!raw-loader!../examples/inline-card-view')}
      />
    )}

    ${(
      <Props
        heading="LinkView Props"
        props={require('!!extract-react-types-loader!../src/LinkView')}
      />
    )}

    ${(
      <Props
        heading="InlineCard ResolvingView Props"
        props={require('!!extract-react-types-loader!../src/InlineCard/ResolvingView')}
      />
    )}

    ${(
      <Props
        heading="InlineCard ResolvedView Props"
        props={require('!!extract-react-types-loader!../src/InlineCard/ResolvedView')}
      />
    )}

    ${(
      <Props
        heading="InlineCard ErroredView Props"
        props={require('!!extract-react-types-loader!../src/InlineCard/ErroredView')}
      />
    )}

    ${(
      <Props
        heading="InlineCard ForbiddenView Props"
        props={require('!!extract-react-types-loader!../src/InlineCard/ForbiddenView')}
      />
    )}

    ${(
      <Props
        heading="InlineCard Frame Props"
        props={require('!!extract-react-types-loader!../src/InlineCard/Frame')}
      />
    )}

    ${(
      <Props
        heading="InlineCard UnauthorisedView Props"
        props={require('!!extract-react-types-loader!../src/InlineCard/UnauthorisedView')}
      />
    )}

    ${(
      <Props
        heading="BlockCard ResolvingView Props"
        props={require('!!extract-react-types-loader!../src/BlockCard/views/ResolvingView')}
      />
    )}

    ${(
      <Props
        heading="BlockCard ResolvedView Props"
        props={require('!!extract-react-types-loader!../src/BlockCard/views/ResolvedView')}
      />
    )}

    ${(
      <Props
        heading="BlockCard ErroredView Props"
        props={require('!!extract-react-types-loader!../src/BlockCard/views/ErroredView')}
      />
    )}

    ${(
      <Props
        heading="BlockCard ForbiddenView Props"
        props={require('!!extract-react-types-loader!../src/BlockCard/views/ForbiddenView')}
      />
    )}

    ${(
      <Props
        heading="BlockCard UnauthorisedView Props"
        props={require('!!extract-react-types-loader!../src/BlockCard/views/UnauthorizedView')}
      />
    )}
    

`;
// TODO: Add props for each subviews using Props from extract react-type
