# Create Embedded Page

### App setup

Set up your application to interface with Confluence using OAuth. You will need to do this to call Confluence REST
APIs to retrieve the required data to create and display an embedded Confluence page in your application.
See [OAuth 2.0 (3LO) apps](https://developer.atlassian.com/cloud/confluence/oauth-2-3lo-apps/) for more details.

Your OAuth access token should grant the following scopes:

1. `write:page:confluence`
2. `read:space:confluence`

### Retrieve spaces

Because all Confluence pages must be created within a space, you must retrieve the spaces on the user’s Confluence site
by making a `GET` request to
the [/spaces API](https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-space/#api-spaces-get) using OAuth
2.0 authentication. Ask the user to select a space (or have your app select one automatically). We recommend allowing
the user to select a space to create in so that they’ll know where the new page is located. You’ll use the selected ` spaceId` and `spaceKey` in subsequent steps.

### Create page in 'draft' mode

Next your application needs to create a page in 'draft' mode. To do this, make a 'POST' request to
the [/pages](https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-page/#api-pages-post) API with OAuth 2.0
authentication using the user’s selected 'spaceId'.

Here’s an example of what the body of this request would look like:

```json
{
  "spaceId": 12345,
  "status": "draft",
  "body": {
    "representation": "atlas_doc_format",
    "value": "{\"version\":1,\"type\":\"doc\",\"content\":[]}"
  }
}
```

### Put the new page in edit mode

Take the response from
the [/pages](https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-page/#api-pages-post) API and grab the
following values to plug into the `EditPage` component:

1. `id`: use for EditPage’s `contentId`

2. `_links.editui`: extract the `draftShareId` query param to use for EditPage’s `draftShareId`

#### Example:

```json
{
  "_links": {
    "editui": "/pages/resumedraft.action?draftId=12345&draftShareId=12345-678910"
  }
}
```
