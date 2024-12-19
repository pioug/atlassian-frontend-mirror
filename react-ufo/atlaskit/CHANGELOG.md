# @atlaskit/ufo-interaction-ignore

## 2.7.0

### Minor Changes

- [#179617](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/179617)
  [`755cc79765ae8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/755cc79765ae8) -
  Added API to support SSR whitelist

## 2.6.0

### Minor Changes

- [#180750](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/180750)
  [`a876090daed20`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a876090daed20) -
  Experimental UFO holds the third iteration

### Patch Changes

- Updated dependencies

## 2.5.3

### Patch Changes

- [#179859](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/179859)
  [`3685feff446c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3685feff446c1) -
  Use getBoundingClientRect instead of value from intersectionObserver for the purpose of checking
  layout shift for SSR placeholders.

## 2.5.2

### Patch Changes

- [#179378](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/179378)
  [`0c54148687bda`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c54148687bda) -
  move filtering of components log to allow for ufo:vc:next observation

## 2.5.1

### Patch Changes

- [#172505](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/172505)
  [`e43cba2a879aa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e43cba2a879aa) -
  Remove explicit jest extension with .toBeAccessible matcher

## 2.5.0

### Minor Changes

- [#176642](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176642)
  [`66ae71c3d1e72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/66ae71c3d1e72) -
  Revert "AFO-3080: NO-ISSUE Experimental UFO holds and TTAI - 2nd iteration"

### Patch Changes

- [#174793](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174793)
  [`abbfbb3b49665`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/abbfbb3b49665) -
  remove VC observations after TTAI
- Updated dependencies

## 2.4.7

### Patch Changes

- [#175818](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175818)
  [`1401a5646d271`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1401a5646d271) -
  Add experimentalTTAI and experimentalVC90 to custom.post-interaction-log
- [#173211](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/173211)
  [`202bc8df0c75a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/202bc8df0c75a) -
  Experimental UFO holds, VC90 and TTAI metrics
- [#175826](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175826)
  [`b5c5bf59d1cff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b5c5bf59d1cff) -
  add rate limiting to experimental interaction metrics

## 2.4.6

### Patch Changes

- [#174829](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174829)
  [`381735c03773b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/381735c03773b) -
  add ufo: prefix to error count and stylesheet count metrics
- [#174760](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174760)
  [`0c5bbf0079bee`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c5bbf0079bee) -
  Remove display style attribute mutation check

## 2.4.5

### Patch Changes

- [#172240](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/172240)
  [`db973dafd5ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db973dafd5ae2) -
  correctly feature flag and optimise buildSegmentTree function
- [#172231](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/172231)
  [`de6f706c54af6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/de6f706c54af6) -
  [ED-25937] Skip TTVC calculation from changes that comes from the Editor container

## 2.4.4

### Patch Changes

- [`a03da52505965`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a03da52505965) -
  Remove the flag from test files as well as its not present on LD or Statsig

## 2.4.3

### Patch Changes

- [#171491](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171491)
  [`85cd3e428869a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85cd3e428869a) -
  observe attributes VC90 impact via ufo:vc:next

## 2.4.2

### Patch Changes

- [#171586](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171586)
  [`abec7f72a0d71`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/abec7f72a0d71) -
  add experimental as a noop prop to UFO hold

## 2.4.1

### Patch Changes

- [#170689](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170689)
  [`960d36f94739d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/960d36f94739d) -
  [React UFO] Fix sessionStorage no access error

## 2.4.0

### Minor Changes

- [#169410](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/169410)
  [`70969d8e13353`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/70969d8e13353) -
  Optimising React UFO payload size by referncing segments tree

## 2.3.3

### Patch Changes

- [#169231](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/169231)
  [`bf7c1455e4d57`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bf7c1455e4d57) -
  allow for custom VC abort reasons

## 2.3.2

### Patch Changes

- [#167556](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167556)
  [`63da6ebbd7549`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/63da6ebbd7549) -
  add try catch to sessionStorage access within ufo init script

## 2.3.1

### Patch Changes

- [#166517](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166517)
  [`c50bc0f9a3564`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c50bc0f9a3564) -
  Add VC calculations for without invisible elements

## 2.3.0

### Minor Changes

- [#164782](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/164782)
  [`1be7ad59ff332`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1be7ad59ff332) -
  fixing ssr attribute in vc observer config

## 2.2.3

### Patch Changes

- [#163513](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163513)
  [`740148acc161b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/740148acc161b) -
  add feature flag override support for Criterion

## 2.2.2

### Patch Changes

- [#160261](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160261)
  [`f147e45fb1a5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f147e45fb1a5a) -
  Extends VC90 detector to include editor lazy node view accomodations

## 2.2.1

### Patch Changes

- [#162445](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162445)
  [`19a11c825b2fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/19a11c825b2fe) -
  enable additional performance marks in performance tab

## 2.2.0

### Minor Changes

- [#160594](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160594)
  [`4a91df26ce837`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4a91df26ce837) -
  Capture Style display changes

## 2.1.0

### Minor Changes

- [#160884](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160884)
  [`52e16a1e398bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/52e16a1e398bf) -
  Exposing VC Media Wrapper Props object

### Patch Changes

- [#160884](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160884)
  [`52e16a1e398bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/52e16a1e398bf) -
  Renamed entry point for VC Media export

## 2.0.9

### Patch Changes

- [#154926](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154926)
  [`33fd71f8d4196`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/33fd71f8d4196) -
  Reporting VC with HTML attributes updates as separate field

## 2.0.8

### Patch Changes

- [#159176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159176)
  [`b682bf3a24cd4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b682bf3a24cd4) -
  Remove include_node_counts_in_ttvc_metric and no_ssr_placeholder_check_when_not_intersecting

## 2.0.7

### Patch Changes

- [#155785](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155785)
  [`0c6d7f8285d34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c6d7f8285d34) -
  moved atlaskit ufo-interaction-ignore to atlaskit/react-ufo

## 2.0.6

### Patch Changes

- [#157418](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157418)
  [`e6939ccf435a3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e6939ccf435a3) -
  Add payload size as part of UFO payload

## 2.0.5

### Patch Changes

- [#158480](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158480)
  [`fcbd1c4e6293b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fcbd1c4e6293b) -
  Sending `custom.post-interaction-log` event for certain Perf Push experiences

## 2.0.4

### Patch Changes

- [#157826](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157826)
  [`cd0465f950cb6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cd0465f950cb6) -
  Added count of network calls

## 2.0.3

### Patch Changes

- [#157758](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157758)
  [`0a582096048e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0a582096048e6) -
  add vc clean field to post interaction log

## 2.0.2

### Patch Changes

- [#157063](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157063)
  [`e710d292f8921`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e710d292f8921) -
  manually track mount phase in UFO segments

## 2.0.1

### Patch Changes

- [#156904](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156904)
  [`285da5f8a4b0b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/285da5f8a4b0b) -
  use weakref for VC observer debug elements

## 2.0.0

### Major Changes

- [#156392](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156392)
  [`c4b79c6ef2fe1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c4b79c6ef2fe1) -
  previous update should've been a major version, this update is a patch however for fixing late
  mutation logic

### Minor Changes

- [#156171](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156171)
  [`cac81bd740336`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cac81bd740336) -
  Re-exporting atlaskit/react-ufo within atlassian/react-ufo

### Patch Changes

- [#156442](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156442)
  [`e74a468fad66a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e74a468fad66a) -
  add switch for compact payload
- [#156476](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156476)
  [`c06bb2cd9e5d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c06bb2cd9e5d1) -
  make time window for late mutations and rerenders to be configurable

## 1.1.0

### Minor Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`e5a96535fa143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e5a96535fa143) -
  addCustomSpans accepts optional custom LabelStak object

## 1.0.1

### Patch Changes

- [#151377](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151377)
  [`3c4d80ac5a938`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3c4d80ac5a938) -
  use @atlaskit/react-ufo custom spans within @atlassian/react-ufo create payload

## 1.0.0

### Major Changes

- [#150292](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150292)
  [`98a2d26a620c5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/98a2d26a620c5) -
  new package for parts of react ufo that need to be atlaskit scoped

## 1.3.2

### Patch Changes

- [#141583](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141583)
  [`2573c7152094d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2573c7152094d) -
  Package.json dependecies update

## 1.3.1

### Patch Changes

- [#134143](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134143)
  [`d39c874b29fbb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d39c874b29fbb) -
  Support team reassigning and clearing out unused packages in

## 1.3.0

### Minor Changes

- [#133335](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133335)
  [`45749cd6f091e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/45749cd6f091e) -
  Rexporting separate packages to the consolidated one

## 1.2.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

## 1.1.2

### Patch Changes

- [#120008](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120008)
  [`044c4997c2aaf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/044c4997c2aaf) -
  Upgrading react version to 18

## 1.1.1

### Patch Changes

- [#101141](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101141)
  [`3af71d3c80fd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3af71d3c80fd) -
  add afm-jira tsconfig for jira consumption

## 1.1.0

### Minor Changes

- [#88895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88895)
  [`a48b908e2bf6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a48b908e2bf6) -
  Add integration of React UFO to not hold react-ufo measurement when media is not in viewport
