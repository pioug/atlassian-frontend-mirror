import { md } from '@atlaskit/docs';

export default md`
## Notes for contributers (Atlassian internal)

### Concepts & design

- https://product-fabric.atlassian.net/wiki/spaces/FS/pages/840564849/
- https://product-fabric.atlassian.net/wiki/spaces/FS/pages/856852513/

Naming in the code:

- "form share" refers to the use of the form: pick users, add message, "share button"
- "copy link" refers to the use of the "copy" button

### analytics

documented here https://hello.atlassian.net/wiki/spaces/PData/pages/401815409/Minimum+event+spec+-+Share

### SSR

We shouldn't have to worry about SSR since this component is loaded asynchronously.

If needed: to test SSR in JIRA, see \`<jira repo>/services/jira-frontend-ssr/README.md\`.

## Decisions

### Should origin Id be regenerated on each click on "copy"?

Clicking the “copy” button is not really a share action, the share happens when the url is pasted somewhere…
Since we have no control over the actual share action, it shouldn’t be needed to re-generate on each “copy” click.

## Quick dev commands

In the repo root dir:

~~~bash
bolt start share
bolt lint
bolt lint:eslint
bolt typecheck
bolt run test ./packages/elements/share/src/__tests__/*
bolt run test ./packages/elements/share/src/__tests__/unit/components/ShareDialogWithTriggerSpec.tsx
~~~

In the package dir: (subset, faster)

~~~bash
yarn prettier  --no-editorconfig --write "**/*.{js,ts,tsx}"
yarn eslint  --fix '**/*.{js,ts,tsx}'
yarn stylelint  '**/*.{js,ts,tsx}'
~~~
`;
