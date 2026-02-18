# @atlaskit/ufo-interaction-ignore

## 5.2.5

### Patch Changes

- [`71b455c1a8ddd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/71b455c1a8ddd) -
  Trim UFO payload if size exceeds max size threshold

## 5.2.4

### Patch Changes

- [`596fad901c189`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/596fad901c189) -
  Add routeName to ufo terminal error metric & exclude client network errors
- [`615a53a036cf9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/615a53a036cf9) -
  FG cleanup - platform_ufo_ttvc_v4_speed_index

## 5.2.3

### Patch Changes

- [`c7cf6502b98d5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c7cf6502b98d5) -
  FG cleanup - platform_ufo_dedupe_repeated_vc_offenders

## 5.2.2

### Patch Changes

- [`f2fec0bde1efb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2fec0bde1efb) -
  Detect (and have fix ready) for bug in VC aborting event detection during SSR time

## 5.2.1

### Patch Changes

- [`de657e97bdb75`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/de657e97bdb75) -
  FG cleanup - platform_ufo_vc_ignore_display_none_mutations

## 5.2.0

### Minor Changes

- [`b7f9d9f2e93dc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b7f9d9f2e93dc) -
  Detect browser throttling in UFO client

### Patch Changes

- [`03e2c7f2a7b38`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/03e2c7f2a7b38) -
  Remove `featureFlags` field in the list of fields trimmed in the event of payload size exceeding
  240KB

## 5.1.4

### Patch Changes

- [`aa7b28d013b4f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/aa7b28d013b4f) -
  Add Speed Index metric using TTVC v4 ruleset
- [`e565e9abbe8fd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e565e9abbe8fd) -
  Added Previous Interaction information to terminal error metric

## 5.1.3

### Patch Changes

- [`376606c3c8197`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/376606c3c8197) -
  FG cleanup - platform_ufo_enable_media_for_ttvc_v3

## 5.1.2

### Patch Changes

- [`6ddf2105a76b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6ddf2105a76b8) -
  FG cleanup - platform_ufo_native_pagevisibility_monitoring

## 5.1.1

### Patch Changes

- [`4ebbeaeb5454b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4ebbeaeb5454b) -
  FG cleanup - platform_ufo_is_opened_in_background

## 5.1.0

### Minor Changes

- [`c4ed6da74c937`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c4ed6da74c937) -
  OBSRVE-2971 Adding the OTel Context Manager to handle trace context for React UFO tracing

### Patch Changes

- [`cd27ffb264a01`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cd27ffb264a01) -
  Added config option for sending the terminal error metric
- [`ac82093b2419b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ac82093b2419b) -
  bugfixes with disabling TTVC v3

## 5.0.13

### Patch Changes

- [`3f0729c82ac47`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3f0729c82ac47) -
  FG cleanup - platform_ufo_disable_vcnext_observations, remove getMutatedElements fn

## 5.0.12

### Patch Changes

- [`898be43686c8a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/898be43686c8a) -
  FG cleanup - platform_ufo_fix_post_interaction_check_vc_debug
- [`36667747cf1b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/36667747cf1b8) -
  FG cleanup - platform_ufo_auto_add_ssr_entry_in_ttvc_v4
- [`18a9917b5d23d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/18a9917b5d23d) -
  FG cleanup - platform_ufo_round_vc_ratios

## 5.0.11

### Patch Changes

- [`1818e2c8ca066`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1818e2c8ca066) -
  FG cleanup - platform_ufo_fix_ttvc_v4_attribute_exclusions

## 5.0.10

### Patch Changes

- [`fd0346f95f6bd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fd0346f95f6bd) -
  Distinguish events opened in background vs opened in foreground and later backgrounded

## 5.0.9

### Patch Changes

- [`ff09fea96cf45`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ff09fea96cf45) -
  Add custom terminal error reporting metric

## 5.0.8

### Patch Changes

- [`eeb197f1a3f0c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eeb197f1a3f0c) -
  Track whether event would be dropped by native page visibility monitoring before setup

## 5.0.7

### Patch Changes

- [`d962c32704964`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d962c32704964) -
  FG cleanup - platform_ufo_remove_ssr_placeholder_in_ttvc_v4
- [`6367a096e4f17`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6367a096e4f17) -
  FG cleanup - platform_ufo_vcnext_for_ttvc_v5

## 5.0.6

### Patch Changes

- [`32b7ffaaecbca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/32b7ffaaecbca) -
  add page visibility hidden timestamp field in UFO payload

## 5.0.5

### Patch Changes

- [`d3ed1b65a2181`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d3ed1b65a2181) -
  Add @atlassian/a11y-jest-testing to devDependencies.

## 5.0.4

### Patch Changes

- [`461f1fb9cf949`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/461f1fb9cf949) -
  FG cleanup - platform_ufo_add_segment_names_to_dom_offenders

## 5.0.3

### Patch Changes

- [`0c485e6a6efa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0c485e6a6efa4) -
  round off reported VC ratios

## 5.0.2

### Patch Changes

- [`a394e2061cccd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a394e2061cccd) -
  classify attribute changes from routing as mutation:attribute:framework-routing in VC observer,
  and exclude it from TTVC v3 onwards

## 5.0.1

### Patch Changes

- [`60444262e8606`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/60444262e8606) -
  Deduplicate reported VC offenders in UFO payload

## 5.0.0

### Major Changes

- [`f06d1289b0fbd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f06d1289b0fbd) -
  Decouple fy26.04 and vcNext TTVC revisions, default revision to be fy26.04

## 4.17.1

### Patch Changes

- [`0310b1753d4b1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0310b1753d4b1) -
  FG cleanup - platform_ufo_enable_trimmed_payload

## 4.17.0

### Minor Changes

- [`9f645244e3aba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9f645244e3aba) -
  Fixed two related problems:
  - The additional metric which fires on the search page was not correctly ignoring smart answer
    mutations
  - fy26.04 metric was not propagating argument to exclude smart answer mutations

## 4.16.8

### Patch Changes

- [`4272868869ef8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4272868869ef8) -
  Updated threshold for observations and keep SSR entry

## 4.16.7

### Patch Changes

- [`b59c796cf683e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b59c796cf683e) -
  Aborting post-interaction logs also when original event is already finished

## 4.16.6

### Patch Changes

- [`2b80f43fe0ea7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2b80f43fe0ea7) -
  Add platform feature gate check for collecting more accurate page visibility

## 4.16.5

### Patch Changes

- [`bf458fce99aca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bf458fce99aca) -
  refactor page visibility tracking

## 4.16.4

### Patch Changes

- [`101200422febe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/101200422febe) -
  Clean up vc_v3_ssr_ratio_fixed_range

## 4.16.3

### Patch Changes

- [`4f8a657618dc5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4f8a657618dc5) -
  add data-is-hovered attribute to list of non-visual excluded attributes for TTVC v4

## 4.16.2

### Patch Changes

- [`0a9debbd75b87`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0a9debbd75b87) -
  use getVisibilityStateFromPerformance for page visibility

## 4.16.1

### Patch Changes

- [`bfcf360d7d973`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bfcf360d7d973) -
  FG cleanup - platform_ufo_ttvc_v4_exclude_input_name_mutation

## 4.16.0

### Minor Changes

- [`904c5b49342ff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/904c5b49342ff) -
  Adds event population config.

## 4.15.19

### Patch Changes

- [`99c161ec39db8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/99c161ec39db8) -
  Send third party holds data when raw data handler is enabled

## 4.15.18

### Patch Changes

- [`4bd92b550a0c8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4bd92b550a0c8) -
  Drop vc details data when raw data event is enabled

## 4.15.17

### Patch Changes

- [`3171d275a7161`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3171d275a7161) -
  FG cleanup - platform_ufo_detect_zero_dimension_rectangles

## 4.15.16

### Patch Changes

- [`1f10952beb116`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1f10952beb116) -
  replace 'next' revision with 'fy26.04'

## 4.15.15

### Patch Changes

- [`e50c3c4b27b3d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e50c3c4b27b3d) -
  Added even data to raw data handler

## 4.15.14

### Patch Changes

- [`8671d72bf688c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8671d72bf688c) -
  add attribute exclusion list for mutation:display-contents-children-attribute

## 4.15.13

### Patch Changes

- [`b7caf41846c8c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b7caf41846c8c) -
  Prevent keypresses from aborting press interactions in react ufo

## 4.15.12

### Patch Changes

- [`19af60b5294cd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/19af60b5294cd) -
  Reduces eagerness of ssr placeholder checking

## 4.15.11

### Patch Changes

- [`5d72bfce82052`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5d72bfce82052) -
  Fix ufo v4 to work with ssr placeholders

## 4.15.10

### Patch Changes

- [`3929544facf86`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3929544facf86) -
  FG cleanup - platform_ufo_default_ssr_edge_timings

## 4.15.9

### Patch Changes

- [`1aacb45a2b77f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1aacb45a2b77f) -
  exclude input name mutations for TTVC v4 due to React/Chromium bug

## 4.15.8

### Patch Changes

- [`7d0c880400e92`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7d0c880400e92) -
  Add segment and labelstack information to TTVC DOM offenders
- [`533c8404f5973`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/533c8404f5973) -
  Fix offset for vc raw data

## 4.15.7

### Patch Changes

- [`eb8e5acf00c10`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eb8e5acf00c10) -
  fix placeholder matching for TTVC v4 display contents elements

## 4.15.6

### Patch Changes

- [`946a6c9f935fa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/946a6c9f935fa) -
  Trim UFO payload if size exceeds max size threshold

## 4.15.5

### Patch Changes

- [`80ea06acdd0ac`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/80ea06acdd0ac) -
  Add entrypoints framework detection for TTVC observer
- [`c4c9659ad7ccd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c4c9659ad7ccd) -
  refactor display:contents element detection

## 4.15.4

### Patch Changes

- [`81a0f341fac4f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/81a0f341fac4f) -
  Platformise Jira's SSR Render Profiler timings

## 4.15.3

### Patch Changes

- [`bf14a236a3255`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bf14a236a3255) -
  Platformise SSR edge timings within UFO

## 4.15.2

### Patch Changes

- [`e2f8161f78f47`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e2f8161f78f47) -
  Fix the media data-cursor exclusion to correctly identify `data-cursor` attribute

## 4.15.1

### Patch Changes

- [`30a6e92ff3dda`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/30a6e92ff3dda) -
  disable usage of getComputedStyle in VC observer

## 4.15.0

### Minor Changes

- [`5bd9159b5173c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5bd9159b5173c) -
  Change fy25_03 media measurement to correctly exclude cursor styles

## 4.14.8

### Patch Changes

- [`60636efa6fba9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/60636efa6fba9) -
  exclude media mutation from ttvc if matching DnD style change, localId and contenteditable
  attribute change, as they are non-visual changes

## 4.14.7

### Patch Changes

- [`ae14db0f1f0c7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ae14db0f1f0c7) -
  Add isDnDStyleMutation back to attribute change detection in vc observer

## 4.14.6

### Patch Changes

- [`95ab6a9cc653c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/95ab6a9cc653c) -
  Auto add SSR entry for TTVC v4 onwards

## 4.14.5

### Patch Changes

- [`7fa9699d9340f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7fa9699d9340f) -
  Marks first ufo segment load time

## 4.14.4

### Patch Changes

- [`e52ace29dfa64`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e52ace29dfa64) -
  Enable raw vc data for React UFO

## 4.14.3

### Patch Changes

- [`666790c2fd8dd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/666790c2fd8dd) -
  Remove SSR placeholder exclusions for VC next

## 4.14.2

### Patch Changes

- [`dd1f939b8a7f7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dd1f939b8a7f7) -
  FG cleanup - react_ufo_unified_search_ignoring_sain_metric

## 4.14.1

### Patch Changes

- [`1cd3b31cac6ef`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1cd3b31cac6ef) -
  FG cleanup - platform_ufo_ssr_placeholders_for_display_contents

## 4.14.0

### Minor Changes

- [`55c867098e0ab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/55c867098e0ab) -
  Added battery info and webdriver

## 4.13.1

### Patch Changes

- [`8dedd89369b84`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8dedd89369b84) -
  Exclude 3p from attribute change behind feature gate

## 4.13.0

### Minor Changes

- [`b0fe1aee585a6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b0fe1aee585a6) -
  Updated ssrRatio to 0-1 from 0-100 to be backwards compatibile

## 4.12.5

### Patch Changes

- [`5976942ba053c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5976942ba053c) -
  Additional fixes for display contents children handling in TTVC

## 4.12.4

### Patch Changes

- [`189df14145d27`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/189df14145d27) -
  Handle elements that are both display: contents and SSR placeholder replacement

## 4.12.3

### Patch Changes

- [`5f70b8e74f5f3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5f70b8e74f5f3) -
  tidy up feature flag platform_editor_tables_scaling_css

## 4.12.2

### Patch Changes

- [`62fd2a70c6b2a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/62fd2a70c6b2a) -
  FG cleanup - platform_ufo_vc_next_filter_ls_entries_same_rect

## 4.12.1

### Patch Changes

- [`eec573b4a7a6a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eec573b4a7a6a) -
  Excluded data-test* data-file* and data-context\* attributes from media fy25_03 as they are non
  visual change required internally for testing and supporting copy and paste functionality

## 4.12.0

### Minor Changes

- [`1c7d57038910d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1c7d57038910d) -
  Adds react-ufo out of band concept, and prevents flags from impacting visual complete calculations

## 4.11.8

### Patch Changes

- [`29629e6bfc4be`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/29629e6bfc4be) -
  FG cleanup - platform_ufo_vcnext_v4_enabled
- [`0e2fae38334fe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0e2fae38334fe) -
  FG cleanup - platform_ufo_enable_timeout_config

## 4.11.7

### Patch Changes

- [`273616f4575b7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/273616f4575b7) -
  FG cleanup - platform_ufo_enable_minor_interactions

## 4.11.6

### Patch Changes

- [`b629e44ac5c35`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b629e44ac5c35) -
  Do not send prior fg for press interactions

## 4.11.5

### Patch Changes

- [`c7f300b3eed72`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c7f300b3eed72) -
  FG cleanup of display contents tracking flags

## 4.11.4

### Patch Changes

- [`0e311a2eaf943`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0e311a2eaf943) -
  Fixed reporting ssrRatio in v3

## 4.11.3

### Patch Changes

- [`be9b699c35606`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/be9b699c35606) -
  deprecate UFO segment highlighting

## 4.11.2

### Patch Changes

- [`2237400c3b932`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2237400c3b932) -
  FG cleanup - platform_ufo_unify_abort_status_in_ttvc_debug_data

## 4.11.1

### Patch Changes

- [`89aa5e2bb9363`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/89aa5e2bb9363) -
  Mark layout-shift entries with same-rect in VC observer

## 4.11.0

### Minor Changes

- [`53cdd8bde9bff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/53cdd8bde9bff) -
  add optional errorStatusCode param to ufo's addError() and addErrorToAll() api

## 4.10.2

### Patch Changes

- [`4b8df6fc79b12`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4b8df6fc79b12) -
  Add interactionType to VC debugData
- [`4b8df6fc79b12`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4b8df6fc79b12) -
  bugfixes on VC debug data

## 4.10.1

### Patch Changes

- [`092ad737a2396`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/092ad737a2396) -
  handle nested display contents elements in TTVC v4
- [`63743e34fad29`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/63743e34fad29) -
  Add an optional arg to func addError and addErrorToAll so that to error hash can be included in
  UFO messages

## 4.10.0

### Minor Changes

- [`012e311801a01`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/012e311801a01) -
  ensure singleton bundling of the package

### Patch Changes

- Updated dependencies

## 4.9.1

### Patch Changes

- [`70c6ad9a84f0a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/70c6ad9a84f0a) -
  filter out layout shifts where every source is the same rectangle

## 4.9.0

### Minor Changes

- [`c9fb4a692dc7d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c9fb4a692dc7d) -
  Added opt-in functionality to fire an additional metric on Rovo search page loads. This additional
  metric excludes smart answers related data."

## 4.8.0

### Minor Changes

- [`fed39716487e7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fed39716487e7) -
  calculate VCNext (TTVC v4) metric behind FG

## 4.7.6

### Patch Changes

- [`71df791f80bf5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/71df791f80bf5) -
  Remove TTVC debug data for post-interaction-log events

## 4.7.5

### Patch Changes

- [`1a2a53c0d8141`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1a2a53c0d8141) -
  Ignore style mutations from adding drag and drop anchor names

## 4.7.4

### Patch Changes

- [`5c0461336c286`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5c0461336c286) -
  Add config to set finish on transition

## 4.7.3

### Patch Changes

- [`0a9ee11a008bd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0a9ee11a008bd) -
  FG cleanup - platform_ufo_abort_timestamp_by_revision
- [`8127ae8dc5d5b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8127ae8dc5d5b) -
  FG cleanup - ufo_disable_aborted_new_interaction_on_confluence
- [`53e3c6f5e41ac`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/53e3c6f5e41ac) -
  Check vc clean before sending custom.interaction-extra-metrics

## 4.7.2

### Patch Changes

- [`d1ac995997b02`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d1ac995997b02) -
  FG cleanup - platform_ufo_ssr_placeholder_resolution_ttvc_v3
- [`c7980ce6abb45`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c7980ce6abb45) -
  FG cleanup - platform_ufo_serialise_ttvc_v3_debug_data

## 4.7.1

### Patch Changes

- [`8f8b18e77c187`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8f8b18e77c187) -
  Add more timings info into interaction-extra-metrics

## 4.7.0

### Minor Changes

- [`dbde6617644d6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dbde6617644d6) -
  [NO-ISSUE] Exclude contenteditable, data-has-collab-initialised, and translate attributes from VC
  calculation

## 4.6.2

### Patch Changes

- [`4dd6789885500`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4dd6789885500) -
  Fix unhandled hidden timing error
- [`25fbcd6f57e2f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/25fbcd6f57e2f) -
  clean up fg

## 4.6.1

### Patch Changes

- [`a308f1abf3cf2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a308f1abf3cf2) -
  unify abort status within TTVC debug data

## 4.6.0

### Minor Changes

- [`a5c2905c301d6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a5c2905c301d6) -
  add tracking of minor interactions

### Patch Changes

- [`135fc7330f9f3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/135fc7330f9f3) -
  serialise TTVC v3 debug data rectangles

## 4.5.12

### Patch Changes

- [`2c7a56c2db1f8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2c7a56c2db1f8) -
  cleanup platform_ufo_no_vc_on_aborted

## 4.5.11

### Patch Changes

- [`4b87ec99869df`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4b87ec99869df) -
  Added data-vc information to unknown interactions

## 4.5.10

### Patch Changes

- [`071602112aa5e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/071602112aa5e) -
  Set default unknown interaction rate when it is not configured

## 4.5.9

### Patch Changes

- [`7cd8d49ea4953`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7cd8d49ea4953) -
  update parameters for useUFOReportError callback

## 4.5.8

### Patch Changes

- [`9b558aefd6806`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9b558aefd6806) -
  Reset extra interaction metrics when adding new interaction

## 4.5.7

### Patch Changes

- [`93b3a250fa490`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/93b3a250fa490) -
  Remove analysis code and add track for display contents occurrence

## 4.5.6

### Patch Changes

- [`ae5b58482107e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ae5b58482107e) -
  Clean up fg React UFO

## 4.5.5

### Patch Changes

- [`d2a5fe501a90f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d2a5fe501a90f) -
  useUFOReportError hook for centrally managed error reporting for UFO

## 4.5.4

### Patch Changes

- [`f438ecb761bb1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f438ecb761bb1) -
  Move check for initial page load earlier for React hydration stats

## 4.5.3

### Patch Changes

- [`5c1bb03531687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5c1bb03531687) -
  FG cleanup - platform_ufo_handle_non_react_element_for_3p

## 4.5.2

### Patch Changes

- [`4dc561b657a31`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4dc561b657a31) -
  FG cleanup - platform_ufo_report_non_htmlelement_selectors
- [`0251aa356dcf9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0251aa356dcf9) -
  fix logic on checkIfExistedAndSizeMatchingV3 function

## 4.5.1

### Patch Changes

- [`b0a4a5983f4e8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b0a4a5983f4e8) -
  Update extra metrics onComplete logic and modify its payload

## 4.5.0

### Minor Changes

- [`2a4662d3e7eb5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2a4662d3e7eb5) -
  fixing Grammarly extension name and adding common browser extensions to exclude list for TTVC

## 4.4.6

### Patch Changes

- [`0feed18feb110`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0feed18feb110) -
  Add sample rate config for extraInteractionMetrics

## 4.4.5

### Patch Changes

- [`b773a6a1dad0f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b773a6a1dad0f) -
  add TTVC abort timestamp to payload
- [`80ff64c68bc70`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/80ff64c68bc70) -
  Clean up feature gate platform_ufo_post_interaction_check_name

## 4.4.4

### Patch Changes

- [`bd5fbbc05c329`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bd5fbbc05c329) -
  Enable TTVC and TTAI for third party segment
- [`7ed8bff88d7c4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7ed8bff88d7c4) -
  FG cleanup - ufo_chrome_devtools_uplift
- [`c86a0e501d31c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c86a0e501d31c) -
  FG cleanup - platform_ufo_ssr_size_field

## 4.4.3

### Patch Changes

- [`fc8202b0f6195`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fc8202b0f6195) -
  FG cleanup - platform_ufo_abort_measurement_fix

## 4.4.2

### Patch Changes

- [`896ce28eae730`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/896ce28eae730) -
  experiment on removing abort by new interactions in confluence

## 4.4.1

### Patch Changes

- [`32ac245da116d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/32ac245da116d) -
  exclude data-is-observed attribute mutation from TTVC

## 4.4.0

### Minor Changes

- [`0bd8e0b53dd60`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0bd8e0b53dd60) -
  Adds Grammarly data attribute to exclusions list

## 4.3.3

### Patch Changes

- [`c25a6c65bfd6d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c25a6c65bfd6d) -
  Add unmount count to segment

## 4.3.2

### Patch Changes

- [`7cf45d7a0ce8d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7cf45d7a0ce8d) -
  Include elements with display:contents css property in TTVC

## 4.3.1

### Patch Changes

- [`3f6614a936a5e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3f6614a936a5e) -
  Send vc100

## 4.3.0

### Minor Changes

- [`45299e3f3ebab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/45299e3f3ebab) -
  Add React hydration property to UFO metrics for initial page load

## 4.2.6

### Patch Changes

- [#201076](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/201076)
  [`eda3ae04eeeb4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eda3ae04eeeb4) -
  FG clean up React UFO

## 4.2.5

### Patch Changes

- [#200712](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/200712)
  [`018d190fdbed5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/018d190fdbed5) -
  FG clean up React UFO

## 4.2.4

### Patch Changes

- [#199942](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/199942)
  [`260cb0fb9e934`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/260cb0fb9e934) -
  Fix ssr placeholder size/dimension check resolution in TTVC v3

## 4.2.3

### Patch Changes

- [#199487](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/199487)
  [`65e285a7a4cbc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/65e285a7a4cbc) -
  Added segments threshold when creating React UFO payload

## 4.2.2

### Patch Changes

- [`9675be5a4df37`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9675be5a4df37) -
  FG cleanup - platform_ufo_ttvc_exclude_data_test_attribute

## 4.2.1

### Patch Changes

- [`e4fd6ff836b97`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e4fd6ff836b97) -
  Update `error` selector return by TTVC offenders reporting

## 4.2.0

### Minor Changes

- [#195899](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195899)
  [`ab2e2b57fa3fc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ab2e2b57fa3fc) -
  Deprecating optional, experimental API about disabling SSR placeholder check of size and position

## 4.1.13

### Patch Changes

- [#195513](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195513)
  [`49b7bf5d4e698`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/49b7bf5d4e698) -
  Added reactUFO as marks to Dev Tools

## 4.1.12

### Patch Changes

- [#195371](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195371)
  [`928a3cc316c8f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/928a3cc316c8f) -
  Fix post interaction log naming issue

## 4.1.11

### Patch Changes

- [`690db8120453b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/690db8120453b) -
  Grouped reactUFO spans for chrome devtools

## 4.1.10

### Patch Changes

- [#193091](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193091)
  [`7e879ace28cec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7e879ace28cec) -
  AFO-4081 cleanup ttvc v3 ff

## 4.1.9

### Patch Changes

- [#192603](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/192603)
  [`75c6397ec21b6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/75c6397ec21b6) -
  Clean fg observer per interaction

## 4.1.8

### Patch Changes

- [#192707](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/192707)
  [`400679111bbaf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/400679111bbaf) -
  AFO-39898 cleanup ff platform_ufo_rll_placeholder_ignore

## 4.1.7

### Patch Changes

- [#190129](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/190129)
  [`396971b979d5d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/396971b979d5d) -
  FG cleanup - platform_ufo_ignore_extra_attributes
- [#190121](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/190121)
  [`5541b82436020`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5541b82436020) -
  FG cleanup - platform_ufo_timeout_simplification

## 4.1.6

### Patch Changes

- [#192382](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/192382)
  [`5f4f054f58647`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5f4f054f58647) -
  Add hard limit for findReactFiber

## 4.1.5

### Patch Changes

- [#191818](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191818)
  [`f8f8080d07991`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f8f8080d07991) -
  clean up ff platform_ufo_rev_ratios

## 4.1.4

### Patch Changes

- [#191244](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191244)
  [`2d701ec4a7166`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2d701ec4a7166) -
  fix name values used for post-interaction-log rate limiting

## 4.1.3

### Patch Changes

- [#190712](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/190712)
  [`20c54200a3179`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/20c54200a3179) -
  Stop the post interaction observer properly

## 4.1.2

### Patch Changes

- [#188412](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188412)
  [`4c4fdba396a9f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4c4fdba396a9f) -
  Clean up fg for unknown elements

## 4.1.1

### Patch Changes

- [#187972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187972)
  [`fff3f06f3e5e1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fff3f06f3e5e1) -
  FG cleanup - platform_ufo_emit_vc_debug_data

## 4.1.0

### Minor Changes

- [#185569](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185569)
  [`1c7b682d3bd6a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1c7b682d3bd6a) -
  Adds UFOCustomCohortData component and addUFOCustomCohortData function to separate cohorting data
  (important for analytics) from general debugging data.

## 4.0.3

### Patch Changes

- [#186813](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/186813)
  [`b0dd8177f1f10`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b0dd8177f1f10) -
  HOT-119287 only produce critical metrics for root and successful interaction

## 4.0.2

### Patch Changes

- [#185693](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185693)
  [`c8e0df9e675c4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c8e0df9e675c4) -
  FG cleanup platform_ufo_post_interaction_most_recent_vc_rev

## 4.0.1

### Patch Changes

- [#184818](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/184818)
  [`a4cc23a9d8a35`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a4cc23a9d8a35) -
  FG cleanup - platform_ufo_report_cpu_usage

## 4.0.0

### Major Changes

- [#185849](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185849)
  [`5570de66b8d30`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5570de66b8d30) -
  change default TTVC version to v3, remove deprecated config fields, deprecate Placeholder
  component

## 3.14.15

### Patch Changes

- [#184833](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/184833)
  [`009166bfcdca7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/009166bfcdca7) -
  FG cleanup - platform_ufo_report_memory_usage

## 3.14.14

### Patch Changes

- [#184795](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/184795)
  [`ce7944d6a2a96`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ce7944d6a2a96) -
  centrally exclude all data-test\* attribute mutations for TTVC v3

## 3.14.13

### Patch Changes

- [#184565](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/184565)
  [`c08127cbd5494`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c08127cbd5494) -
  Fix the third party elements excluded from metric logic for non-react rendered components

## 3.14.12

### Patch Changes

- [#183928](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/183928)
  [`d9580eee2eedc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d9580eee2eedc) -
  Suppress Sentry NotAllowedError on observe PressureObserver

## 3.14.11

### Patch Changes

- [#183338](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/183338)
  [`890b79158a11b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/890b79158a11b) -
  FG cleanup - platform_ufo_vc_observer_new_ssr_abort_listener

## 3.14.10

### Patch Changes

- [#180425](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/180425)
  [`b932e1047acb7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b932e1047acb7) -
  Check if responsiveness exists before updating for press interactions

## 3.14.9

### Patch Changes

- [#180517](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/180517)
  [`cba15052f7278`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cba15052f7278) -
  AFO-4101 properly aborting previous interacttion

## 3.14.8

### Patch Changes

- [#179381](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/179381)
  [`05fa3d08ecda9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/05fa3d08ecda9) -
  User vc observer per interaction

## 3.14.7

### Patch Changes

- [#179438](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/179438)
  [`b0d336b1f78b3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b0d336b1f78b3) -
  AFO-4081 support ssr-placeholder for ttvc v3

## 3.14.6

### Patch Changes

- [#179156](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/179156)
  [`81f5605b925fc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/81f5605b925fc) -
  AFO-4081 ufo vc ignore if no layout shift marker

## 3.14.5

### Patch Changes

- [#179205](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/179205)
  [`69957bbb117c8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/69957bbb117c8) -
  Enable media as part of TTVC v3 calculation

## 3.14.4

### Patch Changes

- [#175348](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175348)
  [`1efcee7c6bc60`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1efcee7c6bc60) -
  AFO-4012 react ufo to produce ciritical metrics payload

## 3.14.3

### Patch Changes

- [#178297](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/178297)
  [`f7360c64ca98f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f7360c64ca98f) -
  Add segment type to ineteraction metrics

## 3.14.2

### Patch Changes

- [#175460](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175460)
  [`57eff35bc7a50`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/57eff35bc7a50) -
  Cleanup platform_ufo_filter_out_aui_attribute_changes flag

## 3.14.1

### Patch Changes

- [#175174](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175174)
  [`56303bfa2ee79`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/56303bfa2ee79) -
  Add new component UFOThirdPartySegment to react-ufo

## 3.14.0

### Minor Changes

- [#176314](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/176314)
  [`9c32e96190532`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9c32e96190532) -
  report memory usage via UFO

## 3.13.28

### Patch Changes

- [#173121](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173121)
  [`0d5a766d0f501`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0d5a766d0f501) -
  Track unknown interactions elements

## 3.13.27

### Patch Changes

- [#175316](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175316)
  [`a2a93696df1b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a2a93696df1b8) -
  Add extra non-visual attributes to UFO ignore list
- [#173438](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173438)
  [`03117ec2ea74c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/03117ec2ea74c) -
  Update README

## 3.13.26

### Patch Changes

- [#175577](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175577)
  [`ab132e5fd6642`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ab132e5fd6642) -
  ensure post-interaction-log events are only for page_load and transition events
- [#175545](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175545)
  [`b16b0a70a3516`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b16b0a70a3516) -
  bugfix: correctly layout shift entry sources being undefined in TTVC v3 logic

## 3.13.25

### Patch Changes

- [#174299](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/174299)
  [`d5a2065348f4d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d5a2065348f4d) -
  Use most recent VC revision for post interaction log late mutation

## 3.13.24

### Patch Changes

- [#174440](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/174440)
  [`8354b610a7617`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8354b610a7617) -
  Adds displayName to ufo segment to help with component tracking

## 3.13.23

### Patch Changes

- [#173171](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173171)
  [`e60305b08b528`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e60305b08b528) -
  Added fg to enable new interaction metrics in jsm portal

## 3.13.22

### Patch Changes

- [#169345](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/169345)
  [`6fab3e0da9d68`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6fab3e0da9d68) -
  Added API to disable checks for size and position of SSR placeholders

## 3.13.21

### Patch Changes

- [#169263](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/169263)
  [`42bff795e359c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/42bff795e359c) -
  Add vc to interactions

## 3.13.20

### Patch Changes

- [#169139](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/169139)
  [`b4d6e4e5e7a39`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b4d6e4e5e7a39) -
  AFO-4009 simplify UFO timeout to be 60s uniformly (behind fg)

## 3.13.19

### Patch Changes

- [#166738](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166738)
  [`0a681029d17a9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0a681029d17a9) -
  AFO-3998 TTVC ignore RLL hydration

## 3.13.18

### Patch Changes

- [#167243](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/167243)
  [`63819af8c6eca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/63819af8c6eca) -
  emit TTVC debug data from UFO

## 3.13.17

### Patch Changes

- [#160542](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160542)
  [`eadf6fec0762d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eadf6fec0762d) -
  Added extension to VC v3 to include SSR

## 3.13.16

### Patch Changes

- [#164300](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164300)
  [`cd25a7f650fa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cd25a7f650fa4) -
  AFO-3919 cleanup platform_ufo_hold_cross_interaction

## 3.13.15

### Patch Changes

- [#164015](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164015)
  [`80c4ba68b4085`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/80c4ba68b4085) -
  AFO-3362 cleanup platform_ufo_ttvc_v3_devtool fg
- [#164070](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164070)
  [`a5066408a954b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a5066408a954b) -
  AFO-3913 clean up platform_ufo_v3_add_start_entry

## 3.13.14

### Patch Changes

- [#163414](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163414)
  [`7d52256cb4dbd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7d52256cb4dbd) -
  AFO-3910 ufo:vc:rev to have ratios
- [#164039](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164039)
  [`94c4e7a609b45`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/94c4e7a609b45) -
  AFO-3905 clean up fg platform_ufo_ignore_non_vis_attributes

## 3.13.13

### Patch Changes

- [#162094](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/162094)
  [`c755719e1423d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c755719e1423d) -
  FG cleanup - platform_ufo_add_vc_abort_reason_by_revisions

## 3.13.12

### Patch Changes

- [#161803](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161803)
  [`71ce852a73a06`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/71ce852a73a06) -
  AFO-3919 make DefaultInteractionID global singleton

## 3.13.11

### Patch Changes

- [#161290](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161290)
  [`26388d9d5e089`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/26388d9d5e089) -
  AFO-3919 fix pre-existing UFOLoadHold not registering to new interaction

## 3.13.10

### Patch Changes

- [#160800](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160800)
  [`3763aa7aadc8c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3763aa7aadc8c) -
  AFO-3913 fix transitio VC v3 not reaching 100 in VC Chart

## 3.13.9

### Patch Changes

- [#161064](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161064)
  [`26461e98f0825`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/26461e98f0825) -
  Fix enabling marking page-layour as a SSR placeholder
- [#161052](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161052)
  [`a16bd256e0ae6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a16bd256e0ae6) -
  Clean up fg platform_ufo_use_offscreen_canvas

## 3.13.8

### Patch Changes

- [#160478](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160478)
  [`e79a796bb3b5a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e79a796bb3b5a) -
  Add id to ttvc v3 attribute ignore list

## 3.13.7

### Patch Changes

- [#160483](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160483)
  [`b814d89d571f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b814d89d571f0) -
  Extending VC to report how much SSR contributes to VC

## 3.13.6

### Patch Changes

- [#160721](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160721)
  [`5116c586702ba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5116c586702ba) -
  FG cleanup - platform_ufo_post_interaction_use_vc_rev

## 3.13.5

### Patch Changes

- [#160658](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160658)
  [`de856e19257ac`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/de856e19257ac) -
  AFO-3905 exclude data-auto-scrollable from ttvc v3

## 3.13.4

### Patch Changes

- [#159955](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159955)
  [`1d25081acf6c5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1d25081acf6c5) -
  ignore non visual attribute changes
- [#159937](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159937)
  [`d0801dd8e4ef8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d0801dd8e4ef8) -
  pass interactionID correctly

## 3.13.3

### Patch Changes

- [#159817](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159817)
  [`b0c2c870bc291`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b0c2c870bc291) -
  [HOT-117391] Ignore mutations from data-aui-version

## 3.13.2

### Patch Changes

- [#159297](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159297)
  [`9669e0bb8bda1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9669e0bb8bda1) -
  Make VCObserverNew (TTVC v3) listens to abort events from ssr mark

## 3.13.1

### Patch Changes

- [#156888](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156888)
  [`42a74b76ffd2b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/42a74b76ffd2b) -
  FG cleanup - platform_ufo_vc_enable_revisions_by_experience

## 3.13.0

### Minor Changes

- [#156673](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156673)
  [`27ecf5244d858`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/27ecf5244d858) -
  Added API to account for page layout in VC calculation

## 3.12.5

### Patch Changes

- [#156815](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156815)
  [`a6856b45ef58f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a6856b45ef58f) -
  make ttvc v3 more debugable

## 3.12.4

### Patch Changes

- [#156458](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156458)
  [`98659a9117f77`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/98659a9117f77) -
  FG cleanup - platform_ufo_post_interaction_use_vc_rev

## 3.12.3

### Patch Changes

- [#155959](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155959)
  [`eeaa8485061ce`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eeaa8485061ce) -
  Add further error handling to CPU monitoring logic

## 3.12.2

### Patch Changes

- [#152526](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152526)
  [`418c1f18e4a6e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/418c1f18e4a6e) -
  FG cleanup for platform_ufo_set_event_failed_status_in_client and
  platform_ufo_ignore_bm3_tti_event_status

## 3.12.1

### Patch Changes

- [#155148](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155148)
  [`ae195d27027a7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ae195d27027a7) -
  [HOT-117381] Remove circular dependency on HTMLElement by using an array of WeakRef

## 3.12.0

### Minor Changes

- [#155304](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155304)
  [`8208673d5be30`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8208673d5be30) -
  add CPU usage metrics as part of UFO payload

## 3.11.2

### Patch Changes

- [#153697](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153697)
  [`e513d2cda4042`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e513d2cda4042) -
  AFO-3823 improve VCObserver stop() performance

## 3.11.1

### Patch Changes

- [#154164](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154164)
  [`59249901f5291`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/59249901f5291) -
  align logic for UFO events and watchdog event

## 3.11.0

### Minor Changes

- [#152178](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152178)
  [`b61bda55f25b4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b61bda55f25b4) -
  Enable TTVC revision logic by experience

## 3.10.4

### Patch Changes

- [#152686](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152686)
  [`d4b943e998cff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d4b943e998cff) -
  AFO-3823 improve VCObserverNew perf overhead

## 3.10.3

### Patch Changes

- [#148578](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148578)
  [`d0ee548642b3e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d0ee548642b3e) -
  Use `ufo:vc:rev` for late mutations post interaction log

## 3.10.2

### Patch Changes

- [#151997](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/151997)
  [`d8723519dfff4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d8723519dfff4) -
  Fix memory leak on TTVC v3

## 3.10.1

### Patch Changes

- [#150909](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150909)
  [`3fca421422bb6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3fca421422bb6) -
  FF cleanup - platform_ufo_vc_observer_new
- [#150909](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150909)
  [`568e2ae966df9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/568e2ae966df9) -
  FF cleanup - platform_ufo_vc_observer_new

## 3.10.0

### Minor Changes

- [#150556](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150556)
  [`b6a8637092517`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b6a8637092517) -
  Add VC abort reason per TTVC revision

## 3.9.5

### Patch Changes

- [#149485](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149485)
  [`e496da2bdb127`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e496da2bdb127) -
  AFO-3615 cleanup fg platform_ufo_log_attr_mutation_values

## 3.9.4

### Patch Changes

- [#148802](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148802)
  [`47aa048599ddc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/47aa048599ddc) -
  FF cleanup - ufo_capture_stylesheet_metrics

## 3.9.3

### Patch Changes

- [#149225](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149225)
  [`212d1bc6cd2a7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/212d1bc6cd2a7) -
  set the FAILED status client side, and ignore BM3 TTI event status
- [#148864](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148864)
  [`93b2b5271da55`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/93b2b5271da55) -
  FF cleanup: platform_ufo_custom_data_structured_clone

## 3.9.2

### Patch Changes

- [#149337](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149337)
  [`cf5be62e3c4a3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cf5be62e3c4a3) -
  clean up fg platform_ufo_vc_ttai_on_paint
- [#148259](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148259)
  [`5504072998c27`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5504072998c27) -
  Fixed a performance regression in SPA transitions when feature gate
  'platform_ufo_no_vc_on_aborted' is enabled. The issue was caused by not properly stopping the VC
  observer when returning early for aborted/invisible interactions, which led to background observer
  processes interfering with subsequent interactions. The fix ensures proper cleanup of the VC
  observer in all code paths.

## 3.9.1

### Patch Changes

- [#147978](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/147978)
  [`af8b516786ee8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/af8b516786ee8) -
  FF cleanup ufo-calc-speed-index

## 3.9.0

### Minor Changes

- [#147017](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/147017)
  [`cd0798d2a9a3d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cd0798d2a9a3d) -
  Enable VC revisions by UFO config

## 3.8.0

### Minor Changes

- [#146843](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/146843)
  [`34bd7506b5f71`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/34bd7506b5f71) -
  remove editor LNV handling, since we already have TTVC v3

## 3.7.0

### Minor Changes

- [#144155](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144155)
  [`328fc686d8e34`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/328fc686d8e34) -
  Added inp and input delay to React UFO press interactions

## 3.6.7

### Patch Changes

- [#146024](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/146024)
  [`f796438651e2d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f796438651e2d) -
  copy UFO custom data via structuredClone, instead of passing the object directly

## 3.6.6

### Patch Changes

- [#144081](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144081)
  [`ef2a781b069a3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ef2a781b069a3) -
  FF cleanup - ufo_support_other_resource_type_js

## 3.6.5

### Patch Changes

- [#145191](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145191)
  [`cd21ebedb9a08`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cd21ebedb9a08) -
  Internal change to move towards Compiled CSS-in-JS styling.

## 3.6.4

### Patch Changes

- [#144654](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144654)
  [`f01bae7a69fc9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f01bae7a69fc9) -
  remove withProfiling wrappers for intersection observer callbacks

## 3.6.3

### Patch Changes

- [#141647](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141647)
  [`66f1d049bd2ea`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/66f1d049bd2ea) -
  cleanup ff platform_ufo_vc_fix_ignore_image_mutation
- [#143633](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/143633)
  [`16db0c6d6329c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/16db0c6d6329c) -
  FF cleanup - enable-react-ufo-payload-segment-compressed

## 3.6.2

### Patch Changes

- [#143078](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/143078)
  [`194c184c53045`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/194c184c53045) -
  FF cleanup - platform-ufo-add-segment-use-effect and ufo_chr_config

## 3.6.1

### Patch Changes

- [#142398](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142398)
  [`0f2c78fab5f90`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0f2c78fab5f90) -
  FF cleanup - platform_editor_ed-25937_ignore_mutations_for_ttvc
- [#142273](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142273)
  [`21456ac374d24`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21456ac374d24) -
  AFO-3610 cleanup ff platform_ufo_vc_ignore_same_value_mutation

## 3.6.0

### Minor Changes

- [#142786](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142786)
  [`056a68c075470`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/056a68c075470) -
  Added check before applying filter to postInteractionFinshVCUpdates

## 3.5.3

### Patch Changes

- [#141178](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141178)
  [`c85827a02e305`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c85827a02e305) -
  clean up fg platform_ufo_vc_filter_ignored_items

## 3.5.2

### Patch Changes

- [#140777](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140777)
  [`8fa57c7e71b24`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8fa57c7e71b24) -
  Filtering out assets with NaN values reported as file size

## 3.5.1

### Patch Changes

- [#140795](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140795)
  [`e1887df1f2005`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e1887df1f2005) -
  FF cleanup - platform_ufo_ssr_placeholder_round_rect_size_check
- [#141104](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141104)
  [`186bbb54cfa80`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/186bbb54cfa80) -
  ff clean up
- [#141125](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141125)
  [`489dcb094d563`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/489dcb094d563) -
  FF cleanup - platform_ufo_fix_vc_observer_rounding_error

## 3.5.0

### Minor Changes

- [#137917](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137917)
  [`fc0581899e9ff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fc0581899e9ff) -
  add self profiling to internal functions

## 3.4.14

### Patch Changes

- [#136647](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/136647)
  [`9d50aee5de4c6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9d50aee5de4c6) -
  Fix bug on ufo:vc:dom that would include element selector that is ignored

## 3.4.13

### Patch Changes

- [#136326](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/136326)
  [`df5ce1960f52f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/df5ce1960f52f) -
  add null check for vc90 result

## 3.4.12

### Patch Changes

- [#134926](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134926)
  [`707705f102735`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/707705f102735) -
  clean up platform_ufo_fix_v2_reported_vc90 FG

## 3.4.11

### Patch Changes

- [#134206](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134206)
  [`073d4d11dd3d6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/073d4d11dd3d6) -
  add FG to disable TTVC v1 calculations

## 3.4.10

### Patch Changes

- [#134112](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134112)
  [`b993bf17b9c1b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b993bf17b9c1b) -
  Ignore same value attribute mutation

## 3.4.9

### Patch Changes

- [#134300](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134300)
  [`5fb9bf529d095`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5fb9bf529d095) -
  SSR placeholder rectangle size comparison to ignore decimal places

## 3.4.8

### Patch Changes

- [#133350](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/133350)
  [`9873ae0c37080`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9873ae0c37080) -
  clean up LCP featrue flags

## 3.4.7

### Patch Changes

- [#132798](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132798)
  [`b337a06491cd8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b337a06491cd8) -
  fix page visibility check on VC observer

## 3.4.6

### Patch Changes

- [#131564](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131564)
  [`e4cc2be4d7e50`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e4cc2be4d7e50) -
  Fix get element name to use data vc by default unless specifically disabled

## 3.4.5

### Patch Changes

- [#130268](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130268)
  [`597d9e0c5582d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/597d9e0c5582d) -
  use requestIdleCallback for payload creation if its available

## 3.4.4

### Patch Changes

- [#127813](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127813)
  [`8b9582e990f11`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8b9582e990f11) -
  Adding additional check to ensure that process variable is defined

## 3.4.3

### Patch Changes

- [#127288](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127288)
  [`ee26211b6cd7a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee26211b6cd7a) -
  Optimisation for VC v3

## 3.4.2

### Patch Changes

- [#126657](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/126657)
  [`801d3cfb7f8d0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/801d3cfb7f8d0) -
  Added LCP to page load events

## 3.4.1

### Patch Changes

- [#124988](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/124988)
  [`fa5bc92ae734d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fa5bc92ae734d) -
  Deduplicate nth-child(n) selectors produced by TTVC v3 debug info

## 3.4.0

### Minor Changes

- [#124334](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/124334)
  [`419c4451a0c0f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/419c4451a0c0f) -
  Updated assets config to include different types of requests

## 3.3.3

### Patch Changes

- [#123538](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/123538)
  [`2dd75c16ca0c4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2dd75c16ca0c4) -
  fix handling of potentially invalid selectors in TTVC v3

## 3.3.2

### Patch Changes

- [#122448](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122448)
  [`e3c0eec530ab2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e3c0eec530ab2) -
  do not produce VC info on failed, aborted, or non active tab events

## 3.3.1

### Patch Changes

- [#122115](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122115)
  [`b39ca387a9eb6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b39ca387a9eb6) -
  Remove VC multiheatmap FG

## 3.3.0

### Minor Changes

- [#120083](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120083)
  [`25a022df71ba2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/25a022df71ba2) -
  add UFO devtools chrome extension api for more events

## 3.2.0

### Minor Changes

- [#121664](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121664)
  [`20d171c15fa73`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/20d171c15fa73) -
  Adding foundations for TTVC v3

## 3.1.4

### Patch Changes

- [#121016](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121016)
  [`1e57491bd2e34`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1e57491bd2e34) -
  Allowing 'other' type of requests with .js to have information of cache calculated

## 3.1.3

### Patch Changes

- [#120623](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120623)
  [`c225bc1a5daf7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c225bc1a5daf7) -
  fix ufo labelstack formatting by version

## 3.1.2

### Patch Changes

- [#119178](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119178)
  [`f0b97fc480d38`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0b97fc480d38) -
  dedupe DOM element selectors within VC debug data
- [#119697](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119697)
  [`62268803ec9e6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/62268803ec9e6) -
  refactor logic to get react ufo version

## 3.1.1

### Patch Changes

- [#119087](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119087)
  [`24baefc255cbc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/24baefc255cbc) -
  Rename revision name

## 3.1.0

### Minor Changes

- [#118212](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/118212)
  [`7a1ec3e0fb496`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7a1ec3e0fb496) -
  Updating logic to track resource timings to include 'other' type which includes '.js'

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

### Patch Changes

- [#117324](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117324)
  [`921179f5ee66d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/921179f5ee66d) -
  Remove FG from CHR API
- Updated dependencies

## 2.16.1

### Patch Changes

- [#116098](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116098)
  [`9650ffb0c42b2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9650ffb0c42b2) -
  Revert: [AFO-3379] Make the DefaultInteractionID trully global across multiple bundles

  # Impact

  No impact since the flag was never rolled out

## 2.16.0

### Minor Changes

- [#109616](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109616)
  [`5feb3a695a6d9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5feb3a695a6d9) -
  Add Assets API to rUFO

## 2.15.0

### Minor Changes

- [#115462](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115462)
  [`17a3ace9d5f67`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/17a3ace9d5f67) -
  Moved addSegment to useEffect to prevent it added multiple times when running on concurrent mode

### Patch Changes

- Updated dependencies

## 2.14.3

### Patch Changes

- [#112416](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112416)
  [`7bc761ae449f4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7bc761ae449f4) -
  VC ratio calculation precision fix

## 2.14.2

### Patch Changes

- Updated dependencies

## 2.14.1

### Patch Changes

- [#109596](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109596)
  [`496dea881c42e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/496dea881c42e) -
  [AFO-3379] Make the DefaultInteractionID trully global across multiple bundles

## 2.14.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 2.13.0

### Minor Changes

- [#106329](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106329)
  [`251d8f2b8d4a9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/251d8f2b8d4a9) -
  Added ufo:vc:next:dom field to payload

## 2.12.2

### Patch Changes

- [#106016](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106016)
  [`67c5f043b34d8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/67c5f043b34d8) -
  mark VCNext metrics on perf timeline

## 2.12.1

### Patch Changes

- [#105652](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105652)
  [`6b7f41a93ff25`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b7f41a93ff25) -
  add ufo:vc:next:entries to payload

## 2.12.0

### Minor Changes

- [#99207](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99207)
  [`59963df2ae2f3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/59963df2ae2f3) -
  Experimental UFO holds

### Patch Changes

- Updated dependencies

## 2.11.0

### Minor Changes

- [#103452](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103452)
  [`4bd40c1e5fb42`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4bd40c1e5fb42) -
  Replaced feature gate for editor lazy node view with config option

## 2.10.0

### Minor Changes

- [#103488](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103488)
  [`1081d09eb1d4b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1081d09eb1d4b) -
  Add API to support SSR whitelist for NIN

## 2.9.0

### Minor Changes

- [#101686](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101686)
  [`e26a94f833e02`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e26a94f833e02) -
  Add fallback error handling for check element visibility VC calculation logic

## 2.8.2

### Patch Changes

- [#101605](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101605)
  [`26580d858329c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/26580d858329c) -
  Adjust logic on when to apply getBoundingClientRect check for target rect - handle dummy rect

## 2.8.1

### Patch Changes

- [#98925](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98925)
  [`4c9eae0d55227`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4c9eae0d55227) -
  Adjust logic on when to apply getBoundingClientRect check for target rect

## 2.8.0

### Minor Changes

- [#182829](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/182829)
  [`38eb19b4da809`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/38eb19b4da809) -
  Revert Experimental UFO holds

### Patch Changes

- Updated dependencies

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
