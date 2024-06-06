# General Prerequisites

In order to properly view an Embedded Page, 3rd party products should make sure the Confluence
cookie is properly set while integrating with any of the components. The cookie should contain 2
tokens: `'atl.xsrf.token'`, and `'cloud.session.token'`.\
\
The cookie can be obtained upon logging in to
[Confluence](https://www.atlassian.com/software/confluence). Starting v2.0.0, the
Login/Authentication flow on Embedded Pages allows a user to login to Confluence and allow access to
cookies without having to open Confluence cloud in a new browser tab or manually changing the
browser settings.

## List of Prerequisites specific to Embedded Pages (EP) integration

- 3rd party product needs to install EP from the public NPM registry.

  - _Recommended \`Node.js\` version: **v16.14.2** or above_

- 3rd party platform needs to be able to support `React` and `iframes`.

  - _Recommended `React` version(s): **v16.8.0** to **v17.0.0**_

- 3rd party must already have a tenant properly allocated with Atlassian and have x amount of
  published pages that exist within their tenant that they want to display.

  - _Process to obtain a tenant/Atlassian ID/license is **not** included in this setup process._

- Needs to be integrated into applications that support browser environments. This can include most
  browsers and desktop applications.

  - _Embedded Confluence requires access to 3rd party cookies and for a user to be logged into
    Confluence beforehand. As of **v2.0.0**, there is a Login/Authentication flow supported for
    Embedded Pages which asks the user to allow Storage Access and login to Confluence using the
    Atlassian Identity Platform. (More details on this can be found in the Login/Authentication Flow
    section)._

- The 3rd party will need to reach out to Atlassian/an Atlassian representative via this
  [service desk request form](https://ecosystem.atlassian.net/servicedesk/customer/portal/34/group/106/create/567)
  and provide the domain(s) used by the 3rd party application for Atlassian to allowlist.

# Installation guide

`npm install @atlaskit/embedded-confluence`

OR

`yarn add @atlaskit/embedded-confluence`

Once the installation is successful, please refer the examples
[here](/packages/confluence/embedded-confluence-public/docs/components-of-Embedded-Pages) to
understand the usage of each component.
