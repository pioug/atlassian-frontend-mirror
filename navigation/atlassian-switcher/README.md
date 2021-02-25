# Component template

This is where you make changes to the Atlassian switcher.

# Are you thinking of making a change to the Switcher?

That's great! Please read our [engagement model](https://product-fabric.atlassian.net/wiki/spaces/YW/pages/1953169670/Engagement+model+with+Your+Work+Start+Switcher+Recent+Activity+and+Notification+Frontend+Experience+FY21) and [contribution model](https://product-fabric.atlassian.net/wiki/spaces/YW/pages/1997669504/Contribution+Model+for+Your+Work) if you would like to make changes or raise a [JSM request](https://product-fabric.atlassian.net/servicedesk/customer/portal/92).

You can also reach out to us us in [#help-start-switcher](https://atlassian.slack.com/archives/C01EKJ3S7R8)

We want to stay informed about your intentions before you raise the PRs because a few reasons.

1. If you are updating the component APIs, we would like to explore the possibility of you either using existing functionality or making the changes re-usable for other products. This will help to minimize the effort of updating switcher every time a product needs some customization.
2. If you are adding a feature behind a feature flag, we would also like to hear from you! It is important that the feature flags work, but it is also important that they are cleaned up after an experiment is over!
3. If you talk to us early, it will also help us prioritise our time to review the PRs.

# Switcher development loop

Switcher is part of the Atlassian frontend repo, so in order to start developing in switcher you need to set up Atlassian frontend repo using this [guide](https://developer.atlassian.com/cloud/framework/atlassian-frontend/getting-started/00-getting-started/).

## Running switcher locally

In order to make changes to Switcher, you need to run Switcher examples locally using `yarn start:navigation` and access them at (http://localhost:9000/packages). For most changes, such as UI changes or adding support for a new product, updating existing examples should be enough. However, if you're adding a new experience it's worth making a separate example for it.

## Testing

Along with the rest of Atlassian Frontend, Switcher uses Jest for testing. You're expected to add unit tests for any change in the logic, and to update snapshot tests for UI changes.

You can run the tests for Switcher using `yarn test packages/navigation/atlassian-switcher` command.

You can learn more about Atlassian Frontend testing practices [here](https://developer.atlassian.com/cloud/framework/atlassian-frontend/development/04-testing/).

## Release process

Note that Switcher follows the continuous release model, so the branch containing your changes should be targeting `master`. Once a PR is created, reviewers from the Your Work team will be add to the PR automatically.

All components in Atlassian Frontend, including Switcher, follow semantic versioning. That means that every PR needs to include a changeset commit, describing the changes that made to the component. A changeset commit can be created by running `bolt changeset` command and picking `atlassian-switcher` as the package to be updated. You can learn more in the [Atlassian Frontend versioning guide](https://developer.atlassian.com/cloud/framework/atlassian-frontend/development/07-versioning/).

Once the branch is merged, a new version of Switcher will be released automatically. You then need to follow the [bumping instructions](https://product-fabric.atlassian.net/wiki/spaces/YW/pages/1719797663/Atlassian+Switcher+-+List+of+consumers+and+bumping+instructions) to update the version of Switcher in all of the products that require your change.

## Verifying changes in product

You can verify complex Switcher changes in-product by using branch deploys. Branch deploys are a way to publish changes to all packages you've made in your development branch to s3 as a published package bundle that can then be installed in any product.

An alternative method is to release a new version of Switcher containing the changes and use branch deploys to test in Jira and Confluence. This only works for the two products mentioned and should only be used as a verification method for relatively simple changes.

### Using branch deploys

- Raise a PR containing your changes in `atlassian-frontend`, wait for Default branch build to complete successfully, and note the commit hash of the most recent commit in your pull request.
- Follow these [instructions](https://developer.atlassian.com/cloud/framework/atlassian-frontend/development/build/01-branch-deploys/) to install `atlaskit-branch-installer`.
- Clone the frontend repository of the product you want to test Switcher in, e.g. `jira-frontend`
- In the product repository, run `atlaskit-branch-installer <commit-hash>`. This will create a temporary version of Switcher that contains your changes and inject it in product as a dependency. Check that the Switcher dependency in `package.json` looks similar to this: ` "@atlaskit/atlassian-switcher": "https://statlas.prod.atl-paas.net/atlassian-frontend/c607eee9bd14/dists/atlaskit-atlassian-switcher-8.10.0.tgz"`.
- Follow the specific product directions to run the product locally and verify your changes.

### Using a released version of switcher in Jira

- Merge your changes and release a new version of Switcher
- Make a branch off `master` in [Jira frontend repo](https://stash.atlassian.com/projects/JIRACLOUD/repos/jira-frontend/browse), update the version of switcher, and wait for builds to complete
- Pick the Webapp branch build and grab the fragments URL from the very end of the build log
- Inject the fragment location in jdog following these [instructions](https://hello.atlassian.net/wiki/spaces/JFP/pages/380768549/How+to+-+Inject+custom+version+of+jira-frontend+in+Jira)

### Using a released version of switcher in Confluence

- Merge your changes and release a new version of Switcher
- Make a branch off master in in JFE, update the version of switcher, and make a PR with no reviewers on it
- Once the builds are successful a super-soaker-bit will add a link to test the changes in Hello (see [Confluence Frontend - Branch Build Testing](https://hello.atlassian.net/wiki/spaces/PGT/pages/750246580/Confluence+Frontend+-+Branch+Build+Testing) for more details)

### Integrating Switcher with an Analytics Client

Switcher requires that a product provides its own instance of analytic clients.

For that, wrap your Switcher component into a `FabricListener`. Here's an example code below.

```
import FabricAnalyticsListeners, { FabricChannel } from '@atlaskit/analytics-listeners';


<FabricAnalyticsListeners
    client={analytics.getAnalyticsWebClient()}
    excludedChannels={[
        FabricChannel.atlaskit,
        FabricChannel.elements,
        FabricChannel.editor,
        FabricChannel.media
    ]}
>
    <Switcher />
</FabricAnalyticsListeners>

```

Without doing so, switcher will not be sending any analytic events. If you have any issues, please reach out to team that owns this component.
