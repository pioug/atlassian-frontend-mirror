# React UFO for Atlaskit

Parts of React UFO that need to be scoped within @atlaskit

<https://hello.atlassian.net/wiki/spaces/UFO/blog/2022/12/16/2280380649/react-UFO+A+deeper+understanding+of+performance>

<https://hello.atlassian.net/wiki/spaces/UFO/pages/2305847386/react-ufo+UFO+v2>


# Running integration test
```
cd platform && nvm use && yarn

yarn start:rspack react-ufo

# in a separate terminal 
cd platform && nvm use
yarn test:integration packages/react-ufo/atlaskit/__tests__/ --retries 0 --reporter list --reuse-dev-server --project=desktop-chromium --max-failures=0 
```