import { md } from '@atlaskit/docs';

export default md`
  # Prerequisites

  Parent products should make sure the Confluence cookie is properly set while integrating with any of the components. The cookie should contain 2 tokens: \`'atl.xsrf.token'\`, and either \`'cloud.session.token'\` (in production) or \`'cloud.session.token.stg'\` (in staging) based on the environment. The cookie can be obtained upon login to [Confluence](https://www.atlassian.com/software/confluence).

  ## List of Prerequisites specific to Embedded Pages (EP)

  - Third party product needs to install EP using NPM.

    - _Recommended \`Node.js\` version: **v16.14.2** or above_

  - Third party platform needs to be in React as EP only provides \`React\` Components currently.

    - _Recommended version: **v16.8.0** to **v17.0.0**_

  - Third party must already have a tenant properly allocated with Atlassian and have x amount of published pages that exist within their tenant that they want to display through EP.

    - _Process to obtain a tenant/Atlassian ID/license is **not** included within the given scope._

  - Needs to be integrated into applications with browser environments. This can include most browsers and desktop applications.

    - _Certain cookie restrictions may need to be disabled. \*_

  - Parent product will need to reach out to Atlassian to whitelist their domain.
    - _This may include a list of valid tenants_
    - _Third parties require a product name which is to be used as a value for the \`parentProduct\` prop while consuming EP components._

  ## Temporary Prerequisite \*

  - On top of successfully logging in to Confluence, a user may need to enable all cookies, including 3rd party cookies, on their browsers while loading Embedded Pages.

  # Installation guide

  \`npm install @atlaskit/embedded-confluence\`

  OR

  \`yarn add @atlaskit/embedded-confluence\`

  Once the installation is successful, please refer the examples [here](/packages/confluence/embedded-confluence-public/docs/components-of-Embedded-Pages) to understand the usage of each component.
`;
