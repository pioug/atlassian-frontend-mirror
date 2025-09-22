# @atlaskit/interaction-context

## 3.1.0

### Minor Changes

- [`012e311801a01`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/012e311801a01) -
  ensure singleton bundling of the package

## 3.0.0

### Major Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

## 2.6.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

## 2.5.0

### Minor Changes

- [#99207](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99207)
  [`59963df2ae2f3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/59963df2ae2f3) -
  Experimental UFO holds

## 2.4.0

### Minor Changes

- [#182829](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/182829)
  [`38eb19b4da809`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/38eb19b4da809) -
  Revert Experimental UFO holds

## 2.3.0

### Minor Changes

- [#180750](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/180750)
  [`a876090daed20`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a876090daed20) -
  Experimental UFO holds the third iteration

## 2.2.0

### Minor Changes

- [#176642](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176642)
  [`66ae71c3d1e72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/66ae71c3d1e72) -
  Revert "AFO-3080: NO-ISSUE Experimental UFO holds and TTAI - 2nd iteration"

## 2.1.7

### Patch Changes

- [#173211](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/173211)
  [`202bc8df0c75a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/202bc8df0c75a) -
  Experimental UFO holds, VC90 and TTAI metrics

## 2.1.6

### Patch Changes

- [#141583](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141583)
  [`2573c7152094d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2573c7152094d) -
  Package.json dependecies update

## 2.1.5

### Patch Changes

- [#134143](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134143)
  [`d39c874b29fbb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d39c874b29fbb) -
  Support team reassigning and clearing out unused packages in

## 2.1.4

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 2.1.3

### Patch Changes

- [#39629](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39629)
  [`e2cad1162d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2cad1162d6) - Enrol
  packages on push model consumption

## 2.1.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 2.1.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 2.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

## 2.0.0

### Major Changes

- [#26712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26712)
  [`bf3e9dfd711`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf3e9dfd711) - Create a
  interaction context for tracking experience

### Patch Changes

- [`94909536ed2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/94909536ed2) - Enable
  Spinner to be able to hold during an interaction
