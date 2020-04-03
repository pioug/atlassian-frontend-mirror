import React from 'react';
import { md, code } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
This plugin is designed to make it easy to add a dropbox experience to a product. It uses
dropbox's native picker within a modal, and rendering a smart link on the page after it is
used.

To test how the plugin works, check out the [extension tester](/examples.html?groupId=editor&packageId=editor-core&exampleId=full-page-with-x-extensions), where you can use the
\`/dropbox\` action to check it.

## Installation

There are two parts to installing the dropbox extension: getting the plugin to run, and setting
up your own dropbox app.

### Installing the app

First, we assume you already have the editor set up - these are simply instructions on adding the extension.

Install the extension package:

${code`yarn add @atlaskit/editor-extension-dropbox`}

Second, you need to add the extension to your editor.

${code`import dropboxPluginManifest from "@atlaskit/editor-extension-dropbox"

pluginPlace: [dropboxPluginManifest('KEY_TO_THE_KINGDOM')]`}

where the key to the \`KEY_TO_THE_KINGDOM\` is the key of your dropbox app.

### Setting up your dropbox app

The plugin is designed to work with a dropbox app. This means that the maintainer needs access to dropbox.
See [using dropbox at atlassian](https://hello.atlassian.net/wiki/spaces/AtlasDesk/pages/132067318/Using+Dropbox+at+Atlassian)
for information on how to get the necessary permissions.

Once you have access, from [dropbox home](https://www.dropbox.com), click the ellipses at the bottom right of the page, and select
'developers' from the options available. Finally, clikc on 'app console' at the top right of the page, and you will be presented with
the 'create app' button.

On the next screen, select \`Dropbox API\` over \`Dropbox Business API\`, and select \`Full Dropbox\` fo the permissions type.

You should now have your app key for the above setup step, however there are still two more things you need to do before your app will
be usable.

In the dropbox form, you will need to add the domains you wish the plugin to run on to the \`Chooser/Saver domains\`

### Final important step
${(
  <>
    <p />
    <SectionMessage>
      Without this step, your extension will not render
    </SectionMessage>
  </>
)}

As we are mounting the dropbox picker in an iframe, dropbox needs to whitelist the domains on which it will run. You will need to
contact Anthony Marnell, or reach out to dropbox in the slack channel \`ext-dropbox-jira\` to dropbox directly. It may take a
few days to get the domains whitelisted for your app.

In addition to this, you need to make sure your security permissions for \`X-Frame-Options\` and a \`Content-Security-Policy\`, otherwise dropbox will deny permissiones for the app.

${(
  <>
    <p />
    <SectionMessage>
      You should likely set up two apps, one for local testing, and one for
      production - make sure each has its needed domains allowed.
    </SectionMessage>
  </>
)}
`;
