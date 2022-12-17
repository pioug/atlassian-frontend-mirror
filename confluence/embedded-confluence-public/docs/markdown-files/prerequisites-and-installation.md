# General Prerequisites

In order to properly view an Embedded Page, 3rd party products should make sure the Confluence cookie is properly set while integrating with any of the components. The cookie should contain 2 tokens: \`'atl.xsrf.token'\`, and \`'cloud.session.token'\`.\
\
The cookie can be obtained upon logging in to [Confluence](https://www.atlassian.com/software/confluence).

## List of Prerequisites specific to Embedded Pages (EP) integration

- 3rd party product needs to install EP from the public NPM registry.

  - _Recommended \`Node.js\` version: **v16.14.2** or above_

- 3rd party platform needs to be able to support `React` and `iframes`.

  - _Recommended `React` version(s): **v16.8.0** to **v17.0.0**_

- 3rd party must already have a tenant properly allocated with Atlassian and have x amount of published pages that exist within their tenant that they want to display.

  - _Process to obtain a tenant/Atlassian ID/license is **not** included in this setup process._

- Needs to be integrated into applications that support browser environments. This can include most browsers and desktop applications.

  - _Certain 3rd party cookie restrictions may need to be disabled in order to function properly. \*_

- The 3rd party will need to reach out to Atlassian/an Atlassian representative and provide the domain(s) used by the 3rd party application for Atlassian to allowlist.\
   For example: _**“acmeexample.com”**_ , _**" \*.acme-testing.com"**_. \
   (_**NOTE: We currently only support "https://" domains.**_)
  - _If applicable, please also provide the Confluence tenant resource(s) for the Confluence pages that the 3rd party application is trying to load via Embedded Pages. For example, **\*.atlassian.net** or **\*.services.atlassian.com**_
  - _The embedding product should use an agreed upon key to set the required property,_ \`parentProduct\` _for EP components. This key is used to check for the whitelisted domains and tenants for the parent product. For example: **JSM** has to set_ \`parentProduct={'JSM'}\` _as a property for_ \`ViewPage\` _and_ \`EditPage\` _components._

## Temporary Prerequisite \*

- On top of successfully logging in to Confluence, an end user may need to enable all cookies, including 3rd party cookies, on their browsers while loading Embedded Pages.

# Installation guide

`npm install @atlaskit/embedded-confluence`

OR

`yarn add @atlaskit/embedded-confluence`

Once the installation is successful, please refer the examples [here](/packages/confluence/embedded-confluence-public/docs/components-of-Embedded-Pages) to understand the usage of each component.
