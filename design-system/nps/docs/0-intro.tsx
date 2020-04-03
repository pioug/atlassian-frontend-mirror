import React from 'react';
import { code, md, Example, Props } from '@atlaskit/docs';

export default md`

  NPS provides a component to render an NPS survey.

  ## Usage

${code`
import NPSCollector, { NPS } from '@atlaskit/nps';
`}

  For the most basic usage of the package, the default export provides a preconfigured NPS experience. This will give you the NPS survey with built in defaults for almost everything. The only configuration required is the name of the product the survey is for, and a callback for when the survey is completed.

  ${(
    <Example
      packageName="@atlaskit/nps"
      Component={require('../examples/00-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}

  You can also attach more granular callbacks for submissions to individual pages of the survey, or updates to individual properties.

  ${(
    <Example
      packageName="@atlaskit/nps"
      Component={require('../examples/01-basic-more-config').default}
      title="Usage with more props"
      source={require('!!raw-loader!../examples/01-basic-more-config')}
    />
  )}

  If you need more customization than what the default export provides, for example providing custom messages for internationalization, you can import the NPS component that the default export wraps.

  ${(
    <Example
      packageName="@atlaskit/nps"
      Component={require('../examples/02-advanced').default}
      title="Advanced"
      source={require('!!raw-loader!../examples/02-advanced')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/DefaultNPS')}
      heading="NPS Default Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/NPS')}
      heading="NPS Named Props"
    />
  )}
`;
