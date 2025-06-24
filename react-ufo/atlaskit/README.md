# React UFO for Atlaskit

Parts of React UFO that need to be scoped within @atlaskit

<https://hello.atlassian.net/wiki/spaces/UFO/blog/2022/12/16/2280380649/react-UFO+A+deeper+understanding+of+performance>

<https://hello.atlassian.net/wiki/spaces/UFO/pages/2305847386/react-ufo+UFO+v2>

# Running integration test

In one terminal:

```shell
cd platform && nvm use && yarn
yarn start:rspack react-ufo
```

This will start the dev server, accessible via http://localhost:9000.

Then in a separate terminal:

```shell
cd platform && nvm use
yarn test:integration packages/react-ufo/atlaskit/__tests__/ --retries 0 --reporter list --reuse-dev-server --project=desktop-chromium --max-failures=0
```

To ensure the test is not flaky, refer to the following page:
[HOWTO: Fix & remove flaky tests](https://hello.atlassian.net/wiki/spaces/afm/pages/3153691982/HOWTO+Fix+remove+flaky+tests#3.-How-can-I-verify-/-reproduce-flakiness?)

Essentially, to simulate CI-like environment in local for Playwright to parallelise load, we can
increase the following:

- The number of times to repeat each test
- The number of workers

Example:

```shell
yarn test:integration packages/react-ufo/atlaskit/__tests__/playwright/base.spec.ts --retries 0 --reporter list --reuse-dev-server --project=desktop-chromium --max-failures=0 --repeat-each 50 --workers 50
```
