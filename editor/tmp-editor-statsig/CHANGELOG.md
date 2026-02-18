# @atlaskit/editor-statsig-tmp

## 25.4.0

### Minor Changes

- [`4ba962abdce44`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4ba962abdce44) -
  EDITOR-4667 - Inline Bodied Extension: Remove important from existing extension width style

## 25.3.0

### Minor Changes

- [`51e44e38ee9cf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/51e44e38ee9cf) -
  Fix case where insert-after command crashes during streaming

## 25.2.0

### Minor Changes

- [`daa8f7030b32d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/daa8f7030b32d) -
  Remove unused ReactSerializer.fromSchema

## 25.1.0

### Minor Changes

- [`584ac5ca3f498`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/584ac5ca3f498) -
  [ux] EDITOR-5269 Disables the copy button for legacy content macro nodes

## 25.0.0

### Major Changes

- [`a5a1710c6da4a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a5a1710c6da4a) -
  Clean up of platform_editor_hoverlink_ui_fixes_exp
- [`edbbd04a0a2b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/edbbd04a0a2b8) -
  Remove platform_editor_breakout_resizing_vc90_fix feature flag - feature has been shipped

### Minor Changes

- [`b56fac4df95b4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b56fac4df95b4) -
  remove no-tscheck and fix safe url logic

## 24.1.0

### Minor Changes

- [`88336b2b8f870`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/88336b2b8f870) -
  Add A/A test for cc_fd_db_top_editor_toolbar experiment

## 24.0.0

### Major Changes

- [`2b9f521da4234`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2b9f521da4234) -
  Removed confluence_ttvc_inline_extensions from experiment test overrides

### Patch Changes

- Updated dependencies

## 23.2.0

### Minor Changes

- [`47b5c11a5dc4c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/47b5c11a5dc4c) -
  EDITOR-4944: Add side by side Editor view + confluence preset.

## 23.1.0

### Minor Changes

- [`fcc51e510981b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fcc51e510981b) -
  [ux] Add logic to filter and pin create database menu item to editor toolbar for experiment.

## 23.0.0

### Major Changes

- [`280d14e2d5518`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/280d14e2d5518) -
  Clean up platform_editor_drag_handle_aria_label

### Minor Changes

- [`95a9857d9f007`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/95a9857d9f007) -
  Replaced keymaps for moving table columns/rows in the Editor behind experiment

## 22.3.0

### Minor Changes

- [`6911179854bdb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6911179854bdb) -
  Remove diff highlighting if there are overlapping mark steps (ie. add and then remove)

## 22.2.1

### Patch Changes

- [`69ca7c944953d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/69ca7c944953d) -
  [EDITOR-3889] added ai mate analytics properties updater for headless component to fix missing
  attributes from rovo inline chat g

## 22.2.0

### Minor Changes

- [`d63d5af234d7f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d63d5af234d7f) -
  Fix issue when expand is collapsed after streaming.

### Patch Changes

- Updated dependencies

## 22.1.0

### Minor Changes

- [`2126e50c0c9e4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2126e50c0c9e4) -
  [EDITOR-4926] add new experiment to statsig config

## 22.0.0

### Major Changes

- [`5f7b94aaccfec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5f7b94aaccfec) -
  [ux] Cleaned up the platform_inline_smartcard_connect_button_exp experiment gate, enabling the
  blue unauthorised connect button by default. Updated VR tests across multiple packages relying on
  the inline smart card

## 21.2.0

### Minor Changes

- [`506d872ef2503`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/506d872ef2503) -
  Add smartlink response caching to browser storage to reduce layoutshift on transition and page
  load

### Patch Changes

- Updated dependencies

## 21.1.0

### Minor Changes

- [`985c77b3ec4c7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/985c77b3ec4c7) -
  [ux] [EDITOR-410] fixed rovo chat loading screen width and content message in chromeless comment
  editor
- [`f55112e3afcb3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f55112e3afcb3) -
  Fix Rovo button viewed event multiple firing
- [`41941e55fa9b1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/41941e55fa9b1) -
  [ux] Block link scroll behavior now expands collapsed parent expand/nestedExpand nodes before
  scrolling. New feature gate `platform_editor_expand_on_scroll_to_block` controls this behavior:
  - When enabled: Expands parent expand nodes before scrolling (new behavior with better UX)
  - When disabled: Simple scroll without expand handling (safe fallback to original behavior)

  This ensures the "Copy link to block" feature works correctly when the target block is inside a
  collapsed expand.

## 21.0.0

### Major Changes

- [`7b679117f4605`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7b679117f4605) -
  [ux] Productionizes `confluence-whiteboards-quick-insert-eligible` and
  `confluence-whiteboards-quick-insert-l10n-eligible` feature gates and
  `confluence_whiteboards_quick_insert_localised` experiment. Ship "Diagram" variant.

## 20.3.0

### Minor Changes

- [`0a4441336cdd0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0a4441336cdd0) -
  Add platform_editor_toolbar_aifc_use_editor_typography experiment, and use editor custom
  typography tokens in dropdown menus
- [`c986619215b4c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c986619215b4c) -
  Cleanup minor AIFC flags

## 20.2.0

### Minor Changes

- [`9da7abaf781fa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9da7abaf781fa) -
  [ux] clean up platform_editor_text_highlight_padding
- [`508384bef9a9b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/508384bef9a9b) -
  [EDITOR-4774] add experiment to config

## 20.1.0

### Minor Changes

- [`d3b00bd311c9d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d3b00bd311c9d) -
  Improves an edge case where users may face unexpected cursor jumps collaboratively

### Patch Changes

- Updated dependencies

## 20.0.0

### Major Changes

- [`d20e0e448e8b7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d20e0e448e8b7) -
  Cleanup experiment for style changes to prevent the numbered column from growing too big
- [`ef378e27dc43d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ef378e27dc43d) -
  Clean up platform_editor_fix_quick_insert_consistency_exp

### Patch Changes

- Updated dependencies

## 19.0.0

### Major Changes

- [`b30e41f7bbb3b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b30e41f7bbb3b) -
  Cleanup platform_editor_wait_for_space_after_ascii_emoji

### Minor Changes

- [`9b8e6a65567af`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9b8e6a65567af) -
  ENGHEALTH-48871: Fix aria-required-children a11y issue with Editor toolbar.

## 18.0.0

### Major Changes

- [`e97bcf6a8bbf4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e97bcf6a8bbf4) -
  [ux] Productionizes the experiment confluence_whiteboards_quick_insert by productionizing the
  DIAGRAM variation of the experiment

## 17.13.0

### Minor Changes

- [`38dee2c85c456`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/38dee2c85c456) -
  [EDITOR-4486] add new experiment to config

## 17.12.0

### Minor Changes

- [`d39135b9aecb7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d39135b9aecb7) -
  Adds a fix to avoid initialising the bridge if the ai plugin is unavailable.

## 17.11.0

### Minor Changes

- [`4de30defb09c5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4de30defb09c5) -
  Fix overflow of table inside multi-column layouts.

## 17.10.1

### Patch Changes

- [`cbd94bd913e71`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cbd94bd913e71) -
  [ux] EDITOR-4514 fix gap cursor positioning after paste by adding request animation frame to wait
  for new content to be inserted into dom
- Updated dependencies

## 17.10.0

### Minor Changes

- [`25991b4c801ab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/25991b4c801ab) -
  [EDITOR-4884](https://hello.jira.atlassian.cloud/browse/EDITOR-4884) - set `display: none` for
  collapsed Expand

### Patch Changes

- Updated dependencies

## 17.9.0

### Minor Changes

- [`b2780992bdc66`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2780992bdc66) -
  Send x-client-platform header when establishing socketio connection

## 17.8.0

### Minor Changes

- [`e98a16b48e245`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e98a16b48e245) -
  Fix a suspected bug where cross-origin selections would throw a dom security error when testing
  whether to set focus
- [`d88e2cfa7371b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d88e2cfa7371b) -
  [ux] fix copy heading link button a11y behaviours by only having one button, that is outside the
  heading element

## 17.7.0

### Minor Changes

- [`fe3cbbba3c6d6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fe3cbbba3c6d6) -
  [EDITOR-4877](https://hello.jira.atlassian.cloud/browse/EDITOR-4877) - remove
  queryCommandSupported from TableComponent

### Patch Changes

- Updated dependencies

## 17.6.0

### Minor Changes

- [`26a5ec6dab84e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/26a5ec6dab84e) -
  Adjust vertical spacing for inline extensions in the renderer

## 17.5.0

### Minor Changes

- [`707c5a42b5358`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/707c5a42b5358) -
  [ux] Updates LCM for new Read only mode. Also adds a new static property setter to the insm api.

## 17.4.0

### Minor Changes

- [`b855c9d819b09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b855c9d819b09) -
  Support sharded routing for collab edit socket connections

## 17.3.0

### Minor Changes

- [`e170ad8b5a383`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e170ad8b5a383) -
  [EDITOR-4501] add new experiment to statsig config

### Patch Changes

- Updated dependencies

## 17.2.0

### Minor Changes

- [`b17f23c9e3a68`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b17f23c9e3a68) -
  Avoid rendering entire primary toolbar container when primary toolbar is not registered

## 17.1.0

### Minor Changes

- [`653c0c803b286`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/653c0c803b286) -
  EDITOR-4620 Clean up platform_editor_toolbar_aifc_patch_6

## 17.0.0

### Major Changes

- [`25c388e0f807a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/25c388e0f807a) -
  EDITOR-4684 Clean up platform_editor_add_orange_highlight_color experiment - orange highlight
  color is now permanently enabled

### Minor Changes

- [`874aa2a0589a2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/874aa2a0589a2) -
  Clean up platform_synced_blocks_offline_check_for_block FG
- [`256b4fc86bae0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/256b4fc86bae0) -
  [ux] EDITOR-4464 Limited Mode: Change threshold to activate limited mode to use the node count
  rather than the raw document size.

### Patch Changes

- Updated dependencies

## 16.36.0

### Minor Changes

- [`7726e6522167d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7726e6522167d) -
  Implemented a bypass for the grace period to allow reconnection when the catchup call is skipped
  following a socket disconnect in the collab-provider.

## 16.35.0

### Minor Changes

- [`e4a01f3fe5601`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e4a01f3fe5601) -
  Uses the new parser only on creation in the bridge to fix some issues caused by the old parser.

## 16.34.0

### Minor Changes

- [`3d0b3f8b4d802`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d0b3f8b4d802) -
  Remove platform_editor_toolbar_aifc_responsive experiment
- [`6e018ece82be1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6e018ece82be1) -
  Cleaned two ADF experiments but ADF prompt will still be enabled only when
  platform_editor_ai_adf_prompts_in_all_products is turned on.
- [`2bd7dcf49bbf2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2bd7dcf49bbf2) -
  [EDITOR-4451] add new experiment to statsig config file

### Patch Changes

- Updated dependencies

## 16.33.0

### Minor Changes

- [`989213ce3c890`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/989213ce3c890) -
  fg cleanup: company-hub-config-panel-keyboard-nav

## 16.32.0

### Minor Changes

- [`64f281a2f3086`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/64f281a2f3086) -
  Introduces a new fix to adf streaming sanitizer, before it could be too aggressive with the
  patterns of fixing some cases of streaming by escaping characters that it would break key/value
  pairs.

## 16.31.0

### Minor Changes

- [`d4d2a325144b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d4d2a325144b8) -
  [EDITOR-4646](https://hello.jira.atlassian.cloud/browse/EDITOR-4646) - clean up
  platform_editor_stop_width_reflows

## 16.30.0

### Minor Changes

- [`6e8029473620b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6e8029473620b) -
  [EDITOR-4496] clean up experiment platform_editor_toolbar_aifc_patch_3 and remove view-mode plugin
  dependency from loom plugin

### Patch Changes

- [`75dab6838b95f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/75dab6838b95f) -
  [ux] EDITOR-3718: Fix Rovo loading modal max-width overflow on small screens (gated)
- [`0a9962a3aa24c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0a9962a3aa24c) -
  tidy up experiment platform_editor_resizer_styles_cleanup

## 16.29.0

### Minor Changes

- [`f662f3b30ee2e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f662f3b30ee2e) -
  Adds new experiment to set selection to the element that attributes are being set of to match
  previous behaviour.
- [`2c3c92548bb9c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2c3c92548bb9c) -
  EDITOR-4639 cleanup cc_editor_limited_mode, cc_editor_limited_mode_include_lcm and unshipped code.

### Patch Changes

- Updated dependencies

## 16.28.0

### Minor Changes

- [`aeb74c52331de`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/aeb74c52331de) -
  [EDITOR-4634] remove duplicated toolbar role from toolbar elements behind
  platform_editor_aifc_remove_duplicate_role

## 16.27.0

### Minor Changes

- [`3dde4e51c90bf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3dde4e51c90bf) -
  Fixed mixed HTML/Editor content copy/paste issue on Date node.

## 16.26.1

### Patch Changes

- Updated dependencies

## 16.26.0

### Minor Changes

- [`b1b42a9017633`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b1b42a9017633) -
  [EDITOR-4562] Set up experiment edit modal for unsupported content

## 16.25.1

### Patch Changes

- [`a5727f82cae80`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a5727f82cae80) -
  [NO-ISSUE] Cleans up experiment platform_editor_scroll_gutter_fix
- [`d29ff5aa0dcec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d29ff5aa0dcec) -
  [NO-ISSUE] cleans up experiment platform_editor_reduce_toolbar_vc_impact

## 16.25.0

### Minor Changes

- [`ee5135bafb31d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee5135bafb31d) -
  [EDITOR-4495] clean up platform_editor_toolbar_aifc_patch_4

## 16.24.0

### Minor Changes

- [`498fc3298e069`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/498fc3298e069) -
  [ux] EDITOR-3463: Keep extension breakout aligned with page width in full-width and max modes. The
  rollout is guarded by `confluence_max_width_content_appearance` and the new
  `confluence_max_width_breakout_extension_fix` experiment so the bugfix can be toggled
  independently.
- [`a7fd4015da337`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a7fd4015da337) -
  phase out contextTypes for editor context

## 16.23.0

### Minor Changes

- [`e91ea1cbba89a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e91ea1cbba89a) -
  JRACLOUD-96830: Fix navigating and editing codeblocks with CRLF new lines.

## 16.22.0

### Minor Changes

- [`5a01e256502a0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5a01e256502a0) -
  [EDITOR-3531] Fixed bug where focus is not set to the Editor for chromeless comments editor in
  inline comments

### Patch Changes

- [`25b6f03d52fb3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/25b6f03d52fb3) -
  Remove platform_editor_toolbar_aifc_jira from config

## 16.21.0

### Minor Changes

- [`04d96dd658eea`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/04d96dd658eea) -
  EDITOR-4534 - Inline Bodied Macro: register experiment
  platform_editor_render_bodied_extension_as_inline

## 16.20.0

### Minor Changes

- [`c9c11b2544f4e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c9c11b2544f4e) -
  Remove platform_editor_toolbar_aifc_template_editor feature flag

## 16.19.0

### Minor Changes

- [`20d29306fb10e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/20d29306fb10e) -
  [ED-29451] clean up platform_editor_toolbar_aifc_patch_5
- [`c947ea0c83c0e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c947ea0c83c0e) -
  [ED-29456] clean up platform_editor_toolbar_aifc_selection_extension
- [`c8ca7b8cde88d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c8ca7b8cde88d) -
  Remove platform_editor_toolbar_support_custom_components feature flag

## 16.18.1

### Patch Changes

- [`ba05557f777bf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ba05557f777bf) -
  Add support to render selection toolbar in editors which have an ancestor elemenent which has
  position fixed, most common use case is for the chromeless appearance when rendered inside modals,
  popups etc.

## 16.18.0

### Minor Changes

- [`8a3fc4137f1b4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8a3fc4137f1b4) -
  [EDITOR-3850] add new experiment to statsig config file
- [`6f513adef1867`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6f513adef1867) -
  [ux] Replaces @atlaskit/onboarding with @atlaskit/spotlight for dynamic cards search page per
  enghealth ticket. Uses new experiment gate.

## 16.17.0

### Minor Changes

- [`333b858014e54`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/333b858014e54) -
  Move content placeholder behind title_on_transition flag

## 16.16.0

### Minor Changes

- [`87da29e26abe0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/87da29e26abe0) -
  Refactoring company hub carousel navigation thumbnails to remove nested interactive elements

## 16.15.0

### Minor Changes

- [`9ee3f2262dfcf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9ee3f2262dfcf) -
  improve performance of table floating toolbar when determine the disabled state of distribute
  column button

## 16.14.0

### Minor Changes

- [`7c8501566cbe0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7c8501566cbe0) -
  improve task item styles by using 1 inline svg instead of 2

## 16.13.0

### Minor Changes

- [`1265c260f9bad`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1265c260f9bad) -
  [ED-29455] clean up experiment platform_editor_toolbar_migrate_loom
- [`2154ee4210e97`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2154ee4210e97) -
  Fix pasting emoji from HTML turning into media single

### Patch Changes

- Updated dependencies

## 16.12.0

### Minor Changes

- [`7b39652e2fb7e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7b39652e2fb7e) -
  Updates editor to only show placeholder once collab has connected.

### Patch Changes

- [`0432552b0f173`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0432552b0f173) -
  Cleaning up platform_editor_ai_proactive_ai_nudge

## 16.11.0

### Minor Changes

- [`0095cf9cd3e6f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0095cf9cd3e6f) -
  NOISSUE Clean up feature gate cc_editor_limited_mode_table_align_bttn

  Remove the feature gate `cc_editor_limited_mode_table_align_bttn` and assume it's always enabled.
  The performance optimization for table column distribution in limited mode is now always active
  when limited mode is enabled.

## 16.10.0

### Minor Changes

- [`acd81a73a9a20`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/acd81a73a9a20) -
  [ux] EDITOR-4259 Set table ref when table is rendered

## 16.9.0

### Minor Changes

- [`8c24728c97456`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8c24728c97456) -
  EDITOR-3638 Exclude zero intersection entries when scroll is detected

## 16.8.0

### Minor Changes

- [`517f06f895cc9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/517f06f895cc9) -
  [https://product-fabric.atlassian.net/browse/ED-29730](ED-29730) - clen up
  platform_editor_emoji_otp Statsig experiment

## 16.7.0

### Minor Changes

- [`e8f5c745198b6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e8f5c745198b6) -
  add sampled "renderer rendered" event

## 16.6.0

### Minor Changes

- [`77df724ec737e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/77df724ec737e) -
  [https://product-fabric.atlassian.net/browse/ED-28631](ED-28631) - cleanup the
  platform_editor_smart_card_otp Statsig experiment

## 16.5.0

### Minor Changes

- [`4fb60e6294885`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4fb60e6294885) -
  Cleanup platform_editor_no_ssr flag

## 16.4.0

### Minor Changes

- [`66dcfa397e97d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/66dcfa397e97d) -
  [ux] EDITOR-4197 Fix cell option menu for table header cells in table header column

## 16.3.4

### Patch Changes

- [`30607f97eadae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/30607f97eadae) -
  Update table tests after sticky header changes

## 16.3.3

### Patch Changes

- [`31b6da6a9ab84`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/31b6da6a9ab84) -
  Clean up platform_editor_fix_a11y_aria_posinset_0 experiment - Fix ARIA posinset to use 1-based
  indexing

## 16.3.2

### Patch Changes

- [`5812c1aff4a50`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5812c1aff4a50) -
  Clean up platform_editor_pasting_nested_table_fix experiment - Fix nested table pasting by using
  getLastPastedSlice

## 16.3.1

### Patch Changes

- [`1112caa726b84`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1112caa726b84) -
  Clean up platform_editor_enghealth_table_plugin_lable_rule experiment - Add accessibility labels
  to table drag handles and toggles by default

## 16.3.0

### Minor Changes

- [`45270b9a8ed63`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/45270b9a8ed63) -
  CONFCLOUD-83370: Fix broken IME composition

## 16.2.0

### Minor Changes

- [`b10f0252621b0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b10f0252621b0) -
  Set padding top and bottom on blockquote to avoid batch.css overrides

## 16.1.0

### Minor Changes

- [`bb5f3706afa84`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bb5f3706afa84) -
  fix media card dimensions on load for ssr

## 16.0.1

### Patch Changes

- [`019e34f92a799`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/019e34f92a799) -
  Cleanup FG platform_editor_new_mentions_detection_logic

## 16.0.0

### Major Changes

- [`d03347df0aa57`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d03347df0aa57) -
  [ux] Cleanup improve writing on paste experiment

## 15.16.0

### Minor Changes

- [`722f272e8b78f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/722f272e8b78f) -
  Editor-2778 add editor_fix_embed_width_expand experiment to fix embed width issue in expand

## 15.15.0

### Minor Changes

- [`53aef9589ca55`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/53aef9589ca55) -
  [EDITOR-3786] Make sure that for any check of `cc_editor_ai_content_mode` &&
  `platform_editor_content_mode_button_mvp` in the code we are also checking
  `confluence_compact_text_format`

### Patch Changes

- [`73a49fd4c204c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73a49fd4c204c) -
  Cleanup FG platform_editor_new_list_decorations_logic

## 15.14.0

### Minor Changes

- [`8f6e124ff820f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8f6e124ff820f) -
  Fix case platform_editor_remove_ncsstepmetrics_plugin

## 15.13.0

### Minor Changes

- [`b6a737b41d065`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b6a737b41d065) -
  Clean up experiment platform_editor_fix_clone_nesting_exp

### Patch Changes

- Updated dependencies

## 15.12.0

### Minor Changes

- [`5df3069459bbe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5df3069459bbe) -
  [NO-ISSUE] Moving platform_editor_ai_suggestions_date_year_refresh and
  platform_editor_ai_suggestions_date_comma_delim to experiment

## 15.11.0

### Minor Changes

- [`810632761780a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/810632761780a) -
  EDITOR-3937 Cleanup usage of confluence_content_mode_replace_dense_with_compact from the frontend
  as this is now only needed in the Confluence backend

### Patch Changes

- [`d0cc21488265c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d0cc21488265c) -
  NO-ISSUE: Fix undefined typeof check for process

## 15.10.0

### Minor Changes

- [`31417f38e1e12`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/31417f38e1e12) -
  Update toolbar experiments configuration

## 15.9.0

### Minor Changes

- [`cb319ae5e7782`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cb319ae5e7782) -
  EDITOR-2864 - Address HoverLinkOverlay label spilling out beyond the margins of its container on
  hover. For example, when a smart link is inside a table, and it is broken into 1+ line, the label
  on hover will not break and will therefore appear hovering out of the table.

## 15.8.0

### Minor Changes

- [`8677e7b660127`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8677e7b660127) -
  EDITOR-3792 Rollup max width changes previously gated with editor_tinymce_full_width_mode into
  combined frontend/backend flag confluence_max_width_content_appearance

## 15.7.1

### Patch Changes

- [`d94330c37d126`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d94330c37d126) -
  tidy up ff platform_editor_disable_table_overflow_shadows

## 15.7.0

### Minor Changes

- [`ef8a15fab8805`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ef8a15fab8805) -
  Remove platform_editor_renderer_breakout_fix experiment configuration

## 15.6.0

### Minor Changes

- [`63c5e344d169c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/63c5e344d169c) -
  Reduce the VC impact of the editor toolbar

## 15.5.0

### Minor Changes

- [`081b4e257529b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/081b4e257529b) -
  Support sharded routing for collab presence socket connections

## 15.4.0

### Minor Changes

- [`4ac3023fb991b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4ac3023fb991b) -
  EDITOR-2478 Clean up experiment `platform_editor_nested_table_detection`

## 15.3.0

### Minor Changes

- [`1ba00564a98cd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1ba00564a98cd) -
  Moves the scroll gutter fix behind platform_editor_scroll_gutter_fix out of the hydratable ui
  experiment

## 15.2.0

### Minor Changes

- [`6ecbe7ee10388`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6ecbe7ee10388) -
  Started an experiment on image editing, added a button in the floating toolbar

## 15.1.0

### Minor Changes

- [`5935652291a5f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5935652291a5f) -
  Remove platform_editor_table_drag_handle_hover experiment and enable hover behavior permanently

## 15.0.0

### Major Changes

- [`8cf337169ee4b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8cf337169ee4b) -
  Remove the jira advanced code blocks experiment

## 14.9.0

### Minor Changes

- [`c7acfc11f076a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c7acfc11f076a) -
  [https://hello.jira.atlassian.cloud/browse/EDITOR-3745](EDITOR-3745) - adopt EditorSSRRenderer to
  ReactEditorView

### Patch Changes

- Updated dependencies

## 14.8.0

### Minor Changes

- [`361f88d13201f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/361f88d13201f) -
  Removes experiment gate cc_complexit_fe_emoji_stability

## 14.7.0

### Minor Changes

- [`2bab449c372a5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2bab449c372a5) -
  sync annotations state when delete and undo

## 14.6.1

### Patch Changes

- [`ecd66264f7cd2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ecd66264f7cd2) -
  NO-ISSUE: Update process.env checks

## 14.6.0

### Minor Changes

- [`fdef841890edf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fdef841890edf) -
  Add gate for vc fixes

## 14.5.0

### Minor Changes

- [`bc11393275e1c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bc11393275e1c) -
  Do not use React State for storing pluginInjectionAPI reference

### Patch Changes

- Updated dependencies

## 14.4.0

### Minor Changes

- [`00c08e3995cb2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/00c08e3995cb2) -
  Clean up platform_editor_block_menu_empty_line

### Patch Changes

- Updated dependencies

## 14.3.0

### Minor Changes

- [`ada8445a9624f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ada8445a9624f) -
  Add experiment to fix ascii emoji replacement behaviour

### Patch Changes

- [`62db1dbb5e93b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/62db1dbb5e93b) -
  Add shortlinks to link clicked events. Only for updating metrics. Experiment here -
  smart_link_confluence_short_link_analytics.

## 14.2.0

### Minor Changes

- [`ee7dfc1442426`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee7dfc1442426) -
  [ux] Make 3P Unauthenticated links pasted on a new line to convert to block card

## 14.1.3

### Patch Changes

- [`5d8ba7e59f96f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5d8ba7e59f96f) -
  simplify the media single resizer classnames
- Updated dependencies

## 14.1.2

### Patch Changes

- [`01a138be1a16d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/01a138be1a16d) -
  Clean up platform_editor_block_menu_expand_format

## 14.1.1

### Patch Changes

- [`41a91a916c125`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/41a91a916c125) -
  EDITOR-2846 Change platform_synced_block to use editorExperiment and add Jira experiment

## 14.1.0

### Minor Changes

- [`7583860e8637f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7583860e8637f) -
  EDITOR-3621 Clean up platform_editor_block_menu_keyboard_navigation feature gate

## 14.0.1

### Patch Changes

- [`5e935a27d0d78`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5e935a27d0d78) -
  Cleanup platform_editor_resizer_cls_fix experiment

## 14.0.0

### Major Changes

- [`66121121982b2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/66121121982b2) -
  [EXP-CLEANUP] editor_ai_inline_suggestion_date_v2

### Minor Changes

- [`d84e4018e7a77`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d84e4018e7a77) -
  ED-29689 create new exp

## 13.44.0

### Minor Changes

- [`60c2daf68b2a9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/60c2daf68b2a9) -
  add type guard for expected value and default value in expVal, expValNoExposure, expValEquals and
  expValEqualsNoExposure

### Patch Changes

- Updated dependencies

## 13.43.0

### Minor Changes

- [`df2de2a8c87f1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/df2de2a8c87f1) -
  Remove ncsStepMetricsPlugin from confluence fullpage editor preset

  When the experiment `platform_editor_remove_ncsStepMetrics_plugin` is set to `isEnabled`,
  `enabledOptionalPlugins.ncsStepMetrics` will no longer add the `ncsStepMetricsPlugin` to the
  Confluence `fullPagePreset`

## 13.42.1

### Patch Changes

- [`c36719b325b2d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c36719b325b2d) -
  ED-29674 Enabling UFO tooling for expVal

## 13.42.0

### Minor Changes

- [`73b70015b0789`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73b70015b0789) -
  Adding exp gate: company-hub-config-panel-keyboard-nav

## 13.41.0

### Minor Changes

- [`15164638b4d1a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/15164638b4d1a) -
  [ux] [EDITOR-2461] handle ArrowUp navigation out of the Expand title

### Patch Changes

- [`b5dc6946c55d9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b5dc6946c55d9) -
  Clean up platform_editor_block_menu_layout_format

## 13.40.0

### Minor Changes

- [`c94c7bb357496`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c94c7bb357496) -
  [ux] EDITOR-3317 Fix beahavior when pasting paragraph from panel into list inside panel

## 13.39.0

### Minor Changes

- [`d2da08dd6c682`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d2da08dd6c682) -
  use css driven width for extension styles in renderer

### Patch Changes

- Updated dependencies

## 13.38.1

### Patch Changes

- [`7dc5ce11f312e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7dc5ce11f312e) -
  Clean up platform_editor_ai_remove_trivial_prompts_cc fg

## 13.38.0

### Minor Changes

- [`dbf82f5cfa21e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dbf82f5cfa21e) -
  fix media border styles mutation

## 13.37.0

### Minor Changes

- [`c25e49b317dd8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c25e49b317dd8) -
  [ED-29492] clean up references to platform_editor_paste_rich_text_bugfix

## 13.36.0

### Minor Changes

- [`6dca69f45fa7f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6dca69f45fa7f) -
  [ED-29493] clean up references to platform_editor_find_replace_a11y_fixes

## 13.35.0

### Minor Changes

- [`f79abec64be13`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f79abec64be13) -
  [EDITOR-2624] Add max width mode for ultra wide monitors to the Editor and Renderer

## 13.34.0

### Minor Changes

- [`83b11ab9079a9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/83b11ab9079a9) -
  EDITOR-2480 Enabled ADF prompts for all products behind new fg.

## 13.33.0

### Minor Changes

- [`fd0c8ec823f49`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fd0c8ec823f49) -
  NOISSUE - Add limited mode check for expensive getTableScalingPercent calls for the table floating
  toolbar alignment button.

## 13.32.1

### Patch Changes

- [`0d661119b4293`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0d661119b4293) -
  Clean up platform_editor_insertion experiment by shipping control variant. Remove modern TypeAhead
  components and experiment infrastructure while preserving all existing functionality.

## 13.32.0

### Minor Changes

- [`7a3ccae3a8cf5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7a3ccae3a8cf5) -
  ED-29457Clean up platform_editor_toolbar_aifc_renderer_selection

## 13.31.0

### Minor Changes

- [`c094becfaeeaa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c094becfaeeaa) -
  EDITOR-2476 Introduce new utility method to check if nested tables is supported in the schema to
  facilitate removal of gate `platform_editor_use_nested_table_pm_nodes`

## 13.30.0

### Minor Changes

- [`236d9310035ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/236d9310035ae) -
  [https://product-fabric.atlassian.net/browse/ED-29205](ED-29205) - use native DOM element for
  editor expand icon

## 13.29.0

### Minor Changes

- [`851ebf59a82a8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/851ebf59a82a8) -
  [EDITOR-2459] add new experiment to config file

## 13.28.0

### Minor Changes

- [`0f988dbb4b54b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0f988dbb4b54b) -
  Added an experiment and implemented changes to disable lazy loading of internal images found
  within Confluence PDF export pages

## 13.27.0

### Minor Changes

- [`3c501a06f7c8b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3c501a06f7c8b) -
  [EDITOR-2460] add new experiment to config file

## 13.26.0

### Minor Changes

- [`7faacb80f6865`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7faacb80f6865) -
  Remove platform_editor_toolbar_aifc_exp_code_toggle experiment
- [`29d0693bd5373`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/29d0693bd5373) -
  EDITOR-2581 Fire event for suppressAllToolbars api being used

## 13.25.0

### Minor Changes

- [`68059d62a8bbc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/68059d62a8bbc) -
  ED-29461 Clean up platform_editor_toolbar_task_list_menu_item

### Patch Changes

- Updated dependencies

## 13.24.0

### Minor Changes

- [`54ccde94eb18c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/54ccde94eb18c) -
  ED-29459 Clean up platform_editor_toolbar_aifc_toolbar_analytic

## 13.23.0

### Minor Changes

- [`c6c113481c118`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c6c113481c118) -
  Updates limited mode to include lcm sizes in decision to engage.

### Patch Changes

- Updated dependencies

## 13.22.0

### Minor Changes

- [`351b338797ae4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/351b338797ae4) -
  ED-29460 Clean up platform_editor_toolbar_aifc_fix_editor_view

## 13.21.0

### Minor Changes

- [`28ba94dae8f9a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/28ba94dae8f9a) -
  [ux] EDITOR-2458 Replace usage of \_\_suppressAllToolbars with userIntentPlugin

## 13.20.0

### Minor Changes

- [`755d06b52ebe4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/755d06b52ebe4) -
  Add table sticky header experiment

### Patch Changes

- [`b687f93157a72`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b687f93157a72) -
  Typescript fixes

## 13.19.2

### Patch Changes

- [`71746e992b602`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/71746e992b602) -
  Add aa keys & exposure event for insert-block

## 13.19.1

### Patch Changes

- [`da82d015556d4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/da82d015556d4) -
  Fix a bug where repeatedly cloning the media plugin state would cause severe performance
  degradation over time

## 13.19.0

### Minor Changes

- [`ce0b8f9e44b69`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ce0b8f9e44b69) -
  [ux] [ED-29581] Removes bidi character scanning from code blocks and code snippets

## 13.18.2

### Patch Changes

- [`b2520b000ee03`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2520b000ee03) -
  ED-29593 cleanup platform_editor_ttvc_nodes_in_viewport

## 13.18.1

### Patch Changes

- [`5df1f9fc61bdd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5df1f9fc61bdd) -
  Cleans up experiment platform_editor_layout_node_view_early_exit

## 13.18.0

### Minor Changes

- [`f3e7f3af81cee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f3e7f3af81cee) -
  [ux] NO-ISSUE clean up platform_editor_create_link_on_blur

## 13.17.0

### Minor Changes

- [`e5f402044b1c6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e5f402044b1c6) -
  Add media render error analytics

## 13.16.1

### Patch Changes

- [`c1691aca7fb1d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c1691aca7fb1d) -
  [ux] Update and standardise insert menu ordering behaviour to support localisation

## 13.16.0

### Minor Changes

- [`916133ef0c6dd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/916133ef0c6dd) -
  [ux] Editor experience tracking foundation

## 13.15.1

### Patch Changes

- [`5f70b8e74f5f3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5f70b8e74f5f3) -
  tidy up feature flag platform_editor_tables_scaling_css
- Updated dependencies

## 13.15.0

### Minor Changes

- [`f34518606af3d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f34518606af3d) -
  [ux] Fixes UI issues of the HoverLinkOverlay when it is shown on a heading and on a mulitline
  smartlink.

## 13.14.0

### Minor Changes

- [`18aec70029328`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/18aec70029328) -
  EDITOR-2420 Rename parameter values of `dense` contentMode to `compact`

## 13.13.1

### Patch Changes

- [`03153a278b044`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/03153a278b044) -
  Add new mentions detection logic

## 13.13.0

### Minor Changes

- [`0560b4dfd1361`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0560b4dfd1361) -
  Experiment with disabling prosemirror rendering in SSR

### Patch Changes

- [`b4c5701e7f2be`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b4c5701e7f2be) -
  Adds a PR task to to ensure that if an override was added/removed, it was a safe change.

## 13.12.1

### Patch Changes

- [`1c601de07087b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1c601de07087b) -
  Fix for CLS issue in Editor Resizer Component
- Updated dependencies

## 13.12.0

### Minor Changes

- [`08782f92b4f09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/08782f92b4f09) -
  COMMENTS-5684-fe-cleanup-and-archive-cc-comments-include-path-for-renderer-emojis

## 13.11.0

### Minor Changes

- [`81a75afebab41`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/81a75afebab41) -
  Update api for smarter suggested space recommendations.

## 13.10.1

### Patch Changes

- [`18f1ab6ba31b0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/18f1ab6ba31b0) -
  improve table overshadow under experiment with variants including variant1: complete remove table
  overflow shadowing, variant2: complete remove table overflow shadowing but have border in table
  outer wrapper, variant3: use css-only driven table overflow shadowing.

## 13.10.0

### Minor Changes

- [`1a90419a2ae30`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1a90419a2ae30) -
  [ED-29484] remove references to platform_editor_smart_link_cmd_ctrl_click

## 13.9.0

### Minor Changes

- [`0b4cd77e72217`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0b4cd77e72217) -
  clean up references to platform_editor_controls_performance_fixes

## 13.8.0

### Minor Changes

- [`3e586d8ee0ce4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3e586d8ee0ce4) -
  Remove platform_editor_aifc_selection_toolbar_responsive exp and gate new logic in aiPlugin

## 13.7.0

### Minor Changes

- [`a4db0a2351f7d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a4db0a2351f7d) -
  [ux] ED-29502 Add plain text quick insert option to codeBlockPlugin

## 13.6.1

### Patch Changes

- [`925eb6478e9a5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/925eb6478e9a5) -
  Remove overflowY on tables to prevent Y axis scroll bar showing on Windows.

## 13.6.0

### Minor Changes

- [`db98777e904a9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/db98777e904a9) -
  [https://product-fabric.atlassian.net/browse/ED-29490](ED-29490) - remove
  platform_editor_vanilla_dom experiment

### Patch Changes

- [`0c76d70d520fa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0c76d70d520fa) -
  [ux] Cleanup cc_editor_interactions_trigger_traceufointeraction
- [`02d5fa5dcc791`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/02d5fa5dcc791) -
  Cleanup cc_editor_ufo_hold_table_till_resize_complete

## 13.5.0

### Minor Changes

- [`ff53e1bfc6c25`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ff53e1bfc6c25) -
  [ED-29482] clean up references to platform_editor_toolbar_rerender_optimization_exp
- [`663926469ec70`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/663926469ec70) -
  Remove experiment platform_editor_update_modal_close_button

## 13.4.0

### Minor Changes

- [`482bcdc75598e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/482bcdc75598e) -
  ED-29462 Clean up platform_editor_toolbar_aifc_responsiveness_update

## 13.3.0

### Minor Changes

- [`27d1948b0874f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/27d1948b0874f) -
  [ux] @atlaskit/smart-card: Added experiment variation coloring for the inline smartlink connect
  button. @atlaskit/tmp-editor-statsig: Added experiment gate to test config and overrides setup

## 13.2.0

### Minor Changes

- [`dbff10f5a27ee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dbff10f5a27ee) -
  [ux] [ED-29347] Refactors extension hover styles to pure CSS
- [`2e913b897ced3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2e913b897ced3) -
  [https://product-fabric.atlassian.net/browse/ED-29463](ED-29463) - clean up
  platform_editor_media_card_vc_wrapper_attribute Statsig experiment
- [`a3254a75cdfb7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a3254a75cdfb7) -
  [ED-29448] clean up experiment platform_editor_toolbar_aifc_patch_2

### Patch Changes

- Updated dependencies

## 13.1.0

### Minor Changes

- [`4ad69354a021d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4ad69354a021d) -
  Remove references to platform_editor_toolbar_aifc_patch_1 experiment, remove
  useToolbarDropdownMenuOld export from @atlaskit/editor-toolbar package

### Patch Changes

- Updated dependencies

## 13.0.0

### Major Changes

- [`bd8df9c39d428`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bd8df9c39d428) -
  Removed refs to old experiment platform_editor_ai_aifc

## 12.33.0

### Minor Changes

- [`20c74a7647d3e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/20c74a7647d3e) -
  [ux] ED-29274 Add missing tooltip for toolbar buttons

## 12.32.0

### Minor Changes

- [`3313b6542c788`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3313b6542c788) -
  [ux] [ENGHEALTH-30483] use `hasCloseButton` or CloseButton for ModalHeader

### Patch Changes

- Updated dependencies

## 12.31.0

### Minor Changes

- [`fb6997c75469f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fb6997c75469f) -
  [ux] ED-29319 [CR-6a] Update full page toolbar responstiveness

## 12.30.0

### Minor Changes

- [`c7f63d8f3fd7b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c7f63d8f3fd7b) -
  [ED-29266] add platform_editor_toolbar_aifc_renderer_selection experiment
- [`9af8b5101d35f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9af8b5101d35f) -
  [https://product-fabric.atlassian.net/browse/ED-29411](ED-29411) - clean up
  platform_editor_memoized_node_check experiment
- [`f3461c712ac67`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f3461c712ac67) -
  Remove platform_editor_table_use_shared_state_hook_fg FG, add
  platform_editor_table_drag_handle_hover experiments

### Patch Changes

- [`2c4405f422ac7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2c4405f422ac7) -
  clean up feature flag for static emotion
- Updated dependencies

## 12.29.0

### Minor Changes

- [`6d186dc817ef9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6d186dc817ef9) -
  [ux] ED-26884 fix bug where resize columns for nested table results in a scrollbar
- [`e49f1d35e507a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e49f1d35e507a) -
  [https://product-fabric.atlassian.net/browse/ED-29349](ED-29349) - add one tick provider (SSR)
  support for emojis in editor and live pages

## 12.28.0

### Minor Changes

- [`6af30673f7cee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6af30673f7cee) -
  [ux] Adding padding to the left and right side of highlighted text

## 12.27.0

### Minor Changes

- [`d5e5b25fe885a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d5e5b25fe885a) -
  [ux] ED-29226 Open block menu when drag handle is focussed and space or enter key is pressed

## 12.26.0

### Minor Changes

- [`0203ffb1d311e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0203ffb1d311e) -
  Updated experiment config to split out embed preview action handling from core hover card behavior

### Patch Changes

- Updated dependencies

## 12.25.1

### Patch Changes

- [`6b6eca9cee16d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6b6eca9cee16d) -
  Switch from platform_editor_preview_panel_responsiveness to confluence_preview_panels_exp to roll
  out to GA under Confluence experiment.
- Updated dependencies

## 12.25.0

### Minor Changes

- [`3463fb9dbb744`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3463fb9dbb744) -
  [ux] Add experiment for new compact mode

## 12.24.0

### Minor Changes

- [`e24c73c66f022`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e24c73c66f022) -
  [ux] ED-29268 [SoftServ] Toolbar doesn’t move with text when text alignment change

## 12.23.0

### Minor Changes

- [`9662879e8506e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9662879e8506e) -
  [ux] EDITOR-1354 Prevent remount of taskItemNodeView children when state is changed

## 12.22.0

### Minor Changes

- [`dfbeee51d9d4a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dfbeee51d9d4a) -
  Registers Editor Experiment checks with UFOs gate tracking

## 12.21.0

### Minor Changes

- [`553afc302139b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/553afc302139b) -
  Add analytic emitter component which fires an event when dropdowns are viewed

## 12.20.0

### Minor Changes

- [`28ca2de894404`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/28ca2de894404) -
  ENGHEALTH-40158 fix inline image button in media element menu missing aria-checked when unselected

## 12.19.0

### Minor Changes

- [`77f5d276a6b30`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/77f5d276a6b30) -
  [ux] Put layout and expand format menu visibility behind experiment flags

## 12.18.0

### Minor Changes

- [`cebd8f9171426`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cebd8f9171426) -
  [ux] ED-29159 Implement transform task inside lists - handle logic

## 12.17.0

### Minor Changes

- [`cef73d344aa16`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cef73d344aa16) -
  EDITOR-1391 add analytics event for initial editor width

## 12.16.0

### Minor Changes

- [`99f67e6caf2b2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/99f67e6caf2b2) -
  Add aria-label to table floating insert buttons to address button-name A11Y violation
- [`d352feb9b2d97`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d352feb9b2d97) -
  [ux] NO-ISSUE Change blocktaskItem enablement experiment to a new tenantId based experiment

## 12.15.0

### Minor Changes

- [`66414cddf2784`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/66414cddf2784) -
  Add new platform_editor_toolbar_aifc_fix_editor_view experiment, replace destructured objects with
  direct property access

### Patch Changes

- [`f31129999be36`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f31129999be36) -
  Add improve writing on paste AA test

## 12.14.0

### Minor Changes

- [`345a4e1939d12`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/345a4e1939d12) -
  [ux] [ED-28733] Add responsiveness support for selection toolbar
- [`68424716235d0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/68424716235d0) -
  [ux] EDITOR-1156 Allow checkbox in blockTaskItem node to be selected with keyboard arrows

## 12.13.0

### Minor Changes

- [`52e588636f4d0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/52e588636f4d0) -
  Add new 'changeColor' Editor Command to editor-plugin-text-color, add new keys for clear color
  menu item, add new clear color menu item, add new platform_editor_toolbar_aifc_patch_4 experiment
- [`599faf4ddf537`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/599faf4ddf537) -
  [ED-29230] Fixes the VC offender div.layout-section-container from unnecessarily mutating the DOM
  by returning null instead of a div

## 12.12.0

### Minor Changes

- [`5de213b733131`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5de213b733131) -
  [ux] ED-29123 fix paragraph shifting on hover when next to image with wrap-right/left

## 12.11.0

### Minor Changes

- [`52c2f0aa06497`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/52c2f0aa06497) -
  [EDITOR-1433] Add editor_refactor_backspace_task_and_decisions experiment

## 12.10.0

### Minor Changes

- [`73bece405a55b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73bece405a55b) -
  [EDITOR-1433] Add editor_refactor_backspace_task_and_decisions experiment

### Patch Changes

- [`c0656bad0f992`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c0656bad0f992) -
  EDITOR-1389 fix table container width behind platform_editor_table_container_width_fix

## 12.9.1

### Patch Changes

- [`88eddbfa8aadd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/88eddbfa8aadd) -
  clean up FF of static emotion for editor

## 12.9.0

### Minor Changes

- [`3764ac0028e9d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3764ac0028e9d) -
  [ux] CONFCLOUD-68427-allow-elements-in-expands-to-be-aligned

### Patch Changes

- [`0d0fe7a300841`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0d0fe7a300841) -
  Cleanup platform_editor_usesharedpluginstatewithselector experiment
  - BREAKING CHANGE: sharedPluginStateHookMigratorFactory is deleted from @atlaskit/editor-common

## 12.8.0

### Minor Changes

- [`c0113eeccb2df`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c0113eeccb2df) -
  [ux] ED-29120 add a new config option for default editor preset
  (`toolbar.enableNewToolbarExperience`) which allows the new toolbar to be disabled. This is needed
  for editors that can't be excluded at the experiment level.

## 12.7.0

### Minor Changes

- [`0812ff5bd7bd1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0812ff5bd7bd1) -
  Dont render menu sections in live view

## 12.6.0

### Minor Changes

- [`9fd320fad58ed`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9fd320fad58ed) -
  EDITOR-1516 Updated ADF experiments

## 12.5.0

### Minor Changes

- [`db97eb262cc5a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/db97eb262cc5a) -
  replace platform_editor_toolbar_aifc with separate experiements for jira and confluence

## 12.4.0

### Minor Changes

- [`5c1589424fcc4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5c1589424fcc4) -
  ED-29088 - Add nodesInViewport metric to proseMirrorRendered events.

## 12.3.0

### Minor Changes

- [`659a799cb7f84`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/659a799cb7f84) -
  Added platform_editor_hydratable_ui experiment

## 12.2.0

### Minor Changes

- [`50976babce55d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/50976babce55d) -
  Add new 'onClick' to dropdown menu, hook up new toolbar api to regsiter components on selection
  change, add new safeRegistry method to replace existing objects

## 12.1.0

### Minor Changes

- [`4a31ea74ba10f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4a31ea74ba10f) -
  [ux] [ED-29057] create new ranks and groups for track changes section and render undo, redo and
  diff in separate button groups behind platform_editor_toolbar_aifc_patch_2 gate

## 12.0.0

### Major Changes

- [`eaaa054620847`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eaaa054620847) -
  Cleanup media toolbar performance experiment

## 11.12.0

### Minor Changes

- [`36e649e4988d3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/36e649e4988d3) -
  [ux] ED-29072 close all menus on nested menu item clicked

## 11.11.0

### Minor Changes

- [`51f3f2db61f6e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/51f3f2db61f6e) -
  Add ranks and keys for new collapsed text section component, add responsive container to
  PrimaryToolbar export with new query selectors to hide empty elements, export types

## 11.10.0

### Minor Changes

- [`bfec478c9e91b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bfec478c9e91b) -
  Splits platform_editor_preview_panel_linking_exp into one for Jira and one for Confluence and
  switches to editorExperiment util.

## 11.9.0

### Minor Changes

- [`55a7e20e3fd4c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/55a7e20e3fd4c) -
  [ux] ED-29050 add support for rendering custom primary toolbar components to new toolbar
- [`4ef462fecb522`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4ef462fecb522) -
  [ux] [ED-29003] Register loom component as a dropdown menu item in overflow menu

### Patch Changes

- [`bf3ab0c552ba7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bf3ab0c552ba7) -
  [ux] ED-29000 Add keyboard navigation to colour palette and minor UI fixes

## 11.8.1

### Patch Changes

- [`1eba43a7b680d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1eba43a7b680d) -
  ED-29000 - Add platform_editor_toolbar_aifc_patch_1 experiment

## 11.8.0

### Minor Changes

- [`463f3da1f7822`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/463f3da1f7822) -
  ED-29040 add experiment platform_editor_toolbar_aifc_template_editor which enables the new toolbar
  in the template editor

## 11.7.0

### Minor Changes

- [`c29118e6ca79d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c29118e6ca79d) -
  ED-28986 create initial version of synced blocks

## 11.6.0

### Minor Changes

- [`2a8dcec064275`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2a8dcec064275) -
  [ED-28449] add experiment to config file

### Patch Changes

- [`0fdcb6f2f96fd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0fdcb6f2f96fd) -
  Sorted type and interface props to improve Atlaskit docs

## 11.5.0

### Minor Changes

- [`14e7b85d72f07`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/14e7b85d72f07) -
  EDITOR-1385 Setup platform_editor_ai_non_iw_adf_streaming experiment.

## 11.4.0

### Minor Changes

- [`4339fad1c3ec0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4339fad1c3ec0) -
  Updated expVal to default true for tests

## 11.3.1

### Patch Changes

- [`3cb013fc55d88`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3cb013fc55d88) -
  Add initial trigger for Improve Writing on Paste experiment

## 11.3.0

### Minor Changes

- [`45b7e7965939b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/45b7e7965939b) -
  [ux] [I18N-2877] add locale to datepicker i18n and day of week
- [`205cf133d4d59`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/205cf133d4d59) -
  [ux] Update max width for breakout to be the same as for non-breakout nodes to fix vc90 regression
  behind platform_editor_breakout_resizing_vc90_fix and platform_editor_breakout_resizing

### Patch Changes

- Updated dependencies

## 11.2.0

### Minor Changes

- [`3d41d42ada6d5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d41d42ada6d5) -
  [ED-28600] add new experiment for A11Y violation fixes

## 11.1.0

### Minor Changes

- [`0412437292a6d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0412437292a6d) -
  Switches linking changes for Preview Panel from FG to an experiment.

## 11.0.0

### Major Changes

- [`25ec3e3638f52`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/25ec3e3638f52) -
  Cleanup advanced code block experiment

### Patch Changes

- [`6ca68bbf39757`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6ca68bbf39757) -
  Change all AIFC feature gates over to an experiment platform_editor_ai_aifc

## 10.1.0

### Minor Changes

- [`aa1fb76d0b8a3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/aa1fb76d0b8a3) -
  EDITOR-1315 Converted IW experiment to multivariant experiment.

## 10.0.0

### Major Changes

- [`e2bb51245dcec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e2bb51245dcec) -
  ED-28774 add native editor anchor support

### Patch Changes

- Updated dependencies

## 9.29.0

### Minor Changes

- [`01301aa6646c4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/01301aa6646c4) -
  Add advanced codeblocks experiment for jira.

## 9.28.0

### Minor Changes

- [#200948](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/200948)
  [`8dd9a944113d5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8dd9a944113d5) -
  Introduced throttling for portals

## 9.27.0

### Minor Changes

- [#199487](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/199487)
  [`9146513a60d45`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9146513a60d45) -
  Add a new experiment for code folding in the editor.

## 9.26.0

### Minor Changes

- [`13a1ad07bb39e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/13a1ad07bb39e) -
  [ux] EDITOR-1146 | EDITOR-1176 Introduce `blockTaskItem` node to Renderer and Editor
  `editor-plugin-tasks-and-decisions` which adopts the same code and functionality as the regular
  `taskItem` except that it allows block content such as extensions to be inserted. This is to
  facilitate TinyMCE migration which requires usage of the Legacy Content Extension.

## 9.25.0

### Minor Changes

- [#196697](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/196697)
  [`18b5fbc52627b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/18b5fbc52627b) -
  [ux] Adds block menu plugin for full-page preset and shows the menu when drag handle is clicked.

### Patch Changes

- [#197019](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/197019)
  [`a0cb47e879f31`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a0cb47e879f31) -
  ENGHEALTH-32239 Only group as radio button if not explicitly set to false behind FG
- [`a0e6cdeb5a90c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a0e6cdeb5a90c) -
  [ux] New experiment to unify the handling of panel insertion to more consistent behaviour.

## 9.24.0

### Minor Changes

- [#196046](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/196046)
  [`b0dad85aa7c35`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b0dad85aa7c35) -
  [ux] [ED-27974] Allow hyperlink plugin to change text to link on blur

## 9.23.0

### Minor Changes

- [#195965](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195965)
  [`7fda5827b37c1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7fda5827b37c1) -
  ENGHEALTH-32254 Add aria-label to dropdownButtonItem so that ariaLabel from ai button will be
  passed in

## 9.22.0

### Minor Changes

- [`f62a413f74677`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f62a413f74677) -
  ENGHEALTH-32249 A11y violation detected for rule "aria-valid-attr-value" for
  "@atlaskit/editor-core" from "Editor"

## 9.21.0

### Minor Changes

- [`c08b561ac933b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c08b561ac933b) -
  [ux] Fixes a regression where isSelectedViaDragHandle state wasn't updated correctly.

## 9.20.0

### Minor Changes

- [#193468](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193468)
  [`e626b68cc9c4c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e626b68cc9c4c) -
  [ux] [CONFCLOUD-82368] Hide layout resize handles until interaction instead of unrendering to
  prevent rerenders of content inside layouts

## 9.19.0

### Minor Changes

- [#193381](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193381)
  [`468cb58f0615b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/468cb58f0615b) -
  ENGHEALTH-32254 Add aria label to buttons for accessibility

## 9.18.0

### Minor Changes

- [#193268](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193268)
  [`4a345f374785e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4a345f374785e) -
  [ux] ED-28208 Fix pasting table into selected table results in a nested table

## 9.17.0

### Minor Changes

- [#191617](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191617)
  [`49f632112178c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/49f632112178c) -
  Bugfix - pass path for emojis during renderer serialization to generate correct renderer_start_pos

### Patch Changes

- Updated dependencies

## 9.16.0

### Minor Changes

- [#192346](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/192346)
  [`a2de3fc822824`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a2de3fc822824) -
  [JRACLOUD-95277] Modifying experiment name

## 9.15.0

### Minor Changes

- [#190691](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/190691)
  [`e4343163813c4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e4343163813c4) -
  [ux] [JRACLOUD-95277] When numbered column is on, use percentage scaling for colWidths if the
  tableWidth is less than the maxWidth and the column width is greater than the min colWidth

## 9.14.0

### Minor Changes

- [#189832](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189832)
  [`a3b339a1e6839`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a3b339a1e6839) -
  [ux] ED-28512 Update styling to fix card flickering issue in bodiedExtension

### Patch Changes

- [#190588](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/190588)
  [`b22e308cfd320`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b22e308cfd320) -
  Replace experiment key platform_editor_useSharedPluginStateSelector with
  platform_editor_useSharedPluginStateWithSelector

## 9.13.0

### Minor Changes

- [#191209](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191209)
  [`814220fd4e624`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/814220fd4e624) -
  EDITOR-1151 Enable ADF support for change tone and spelling and grammar.

## 9.12.0

### Minor Changes

- [#190655](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/190655)
  [`b74e88d5ebade`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b74e88d5ebade) -
  [https://product-fabric.atlassian.net/browse/ED-28597](ED-28597) - add
  platform_editor_smart_card_otp editor Statsig experiment

### Patch Changes

- Updated dependencies

## 9.11.0

### Minor Changes

- [#190680](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/190680)
  [`c27708467595b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c27708467595b) -
  [ux] ENGHEALTH-32145 A11y violation detected for rule "label" for "@af/editor-plugin-table-tests"
  from "Editor: Jenga"

## 9.10.0

### Minor Changes

- [#190110](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/190110)
  [`0fc96695978de`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0fc96695978de) -
  Fix breakout width calculation in full width

## 9.9.0

### Minor Changes

- [#188597](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188597)
  [`4de5a96f3e24c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4de5a96f3e24c) -
  [ED-28523] Enable new editor element toolbars UI for Jira
- [#177991](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/177991)
  [`309e093d70774`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/309e093d70774) -
  [ux] [ED-28358] add disableSubmitButton prop to feedback collector

## 9.8.0

### Minor Changes

- [#185940](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185940)
  [`456bee393c4d3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/456bee393c4d3) -
  [ux] When editor-area is less than 768px wide, we reduce editor gutters to 24px in Full-page
  editor.

## 9.7.0

### Minor Changes

- [#185577](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185577)
  [`56dba46f231aa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/56dba46f231aa) -
  [EDITOR-837] Cleanup experiment editor_ai_converge_free_gen_on_rovo
- [#185617](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185617)
  [`c766e636b2d44`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c766e636b2d44) -
  ED-28220 clean up exp platform_editor_controls_toolbar_pinning_exp

## 9.6.0

### Minor Changes

- [#185643](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185643)
  [`5954e6c1fbac5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5954e6c1fbac5) -
  [ux] [ED-28432] Add orange highlight color and reorder color swatches

## 9.5.0

### Minor Changes

- [#184968](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/184968)
  [`a52007f9eed36`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a52007f9eed36) -
  Introduce a performance experiment to avoid running media floating toolbar code unless selected.

## 9.4.0

### Minor Changes

- [#184563](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/184563)
  [`d5b7a19b7e9ad`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d5b7a19b7e9ad) -
  Adds UFO holds to the table component on load

## 9.3.0

### Minor Changes

- [#184251](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/184251)
  [`be8b910f66de1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/be8b910f66de1) -
  [ED-91152] Clean up experiment editor_text_highlight_orange_to_yellow

## 9.2.0

### Minor Changes

- [#178699](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/178699)
  [`52404712b174a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/52404712b174a) -
  Added a new experiment key for jira work sync and added new logic for issue-reformatter for
  improve description flow behind an experiment

### Patch Changes

- Updated dependencies

## 9.1.0

### Minor Changes

- [#179798](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/179798)
  [`b74544d17393f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b74544d17393f) -
  [ux] [ED-27963] this change is creating a new Editor Command inside expandPlugin to toggle open
  expands with active matches from Find&Replace

## 9.0.0

### Major Changes

- [#178344](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/178344)
  [`d6ea53c8a5621`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d6ea53c8a5621) -
  EDITOR-988: Clean up dynamic selection toolbar AI button.

## 8.8.0

### Minor Changes

- [#181826](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/181826)
  [`9cebc9f86c7c0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9cebc9f86c7c0) -
  [ux] EDITOR-991 - Remove no longer needed prompts Brainstorm, Change tone to neutral and Rephrase
  from the Command Palette / Rovo Toolbar for Confluence

## 8.7.0

### Minor Changes

- [#180495](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/180495)
  [`eb0bc71e25f89`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eb0bc71e25f89) -
  Cleaned up floating toolbar in ssr experiment
- [#180491](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/180491)
  [`33c19072599ca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/33c19072599ca) -
  Tidied up smart card overlay experiment
- [#180500](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/180500)
  [`11b9d2a6abab1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/11b9d2a6abab1) -
  Cleaned up shadow defer calculation experiment

## 8.6.0

### Minor Changes

- [#180034](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/180034)
  [`e0f007346fbca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e0f007346fbca) -
  EDITOR-994 Cleaned up editor_ai_comment_freegen_rovo experiment.

## 8.5.0

### Minor Changes

- [#178180](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/178180)
  [`50828d60b0bb8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/50828d60b0bb8) -
  Removes experiment to not render children of expand element until it gets expanded

## 8.4.0

### Minor Changes

- [#178354](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/178354)
  [`8768b869f9245`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8768b869f9245) -
  Cleanup platform_editor_stable_editorview_classname experiment

### Patch Changes

- Updated dependencies

## 8.3.0

### Minor Changes

- [#177692](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/177692)
  [`19ab0513e027f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/19ab0513e027f) -
  Add defaultValue parameter to expValEq and expValEqNoExposure to allow for checking default state
  (e.g. false state) and avoid issue when experiment is not defined

## 8.2.0

### Minor Changes

- [#176094](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/176094)
  [`09e338a3d7dab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/09e338a3d7dab) -
  [ED-28357] move find&replace work from behind feature gates to the new experiment
  platform_editor_find_and_replace_improvements

## 8.1.0

### Minor Changes

- [#174924](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/174924)
  [`5dfbb5e243380`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5dfbb5e243380) -
  adding initial functionality to run experiment to pin whiteboards at the top of the quick insert
  menu

### Patch Changes

- Updated dependencies

## 8.0.0

### Major Changes

- [#174513](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/174513)
  [`9190f78c5c704`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9190f78c5c704) -
  Remove platform_editor_exp_disable_lnv experiment key.

### Minor Changes

- [#173957](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173957)
  [`21b6ca0e1a353`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21b6ca0e1a353) -
  EDITOR-896 Added improve writing in ADF experiment.

## 7.2.0

### Minor Changes

- [#173357](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173357)
  [`f17a667b25b42`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f17a667b25b42) -
  enable merging of prosemirror steps for single player sessions

## 7.1.0

### Minor Changes

- [#170742](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/170742)
  [`9c026e8d50959`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9c026e8d50959) -
  Add data-media-vc-wrapper attribute to Editor MediaCardWrapper component

## 7.0.0

### Major Changes

- [#170188](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/170188)
  [`c762dff80948d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c762dff80948d) -
  [EDITOR-787] Removed retry experiment related code

## 6.2.0

### Minor Changes

- [#166327](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166327)
  [`56ba43df67f02`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/56ba43df67f02) -
  ED-28157 implment reduced drop target logic
- [#168590](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/168590)
  [`e9250f202882e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e9250f202882e) -
  Added experiment to defer shadow calculations until node is visible

## 6.1.0

### Minor Changes

- [#168742](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/168742)
  [`43b55fe50be89`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/43b55fe50be89) -
  Add experiment to show no cursor on initial edit page

## 6.0.0

### Major Changes

- [#166402](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/166402)
  [`86b124543d340`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/86b124543d340) -
  NO-ISSUE: Convert from experiment (editor_ai_in_editor_streaming) to feature gate
  (platform_editor_ai_in_editor_streaming)

### Minor Changes

- [#167123](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/167123)
  [`8baa50249f460`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8baa50249f460) -
  fix: stable class name for EditorView.dom

## 5.14.1

### Patch Changes

- [#167332](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/167332)
  [`5d312dcfaa21a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5d312dcfaa21a) -
  Fix expValEquals should work when FeatureGate client is not initialised

## 5.14.0

### Minor Changes

- [#167295](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/167295)
  [`6c94765105520`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6c94765105520) -
  [https://product-fabric.atlassian.net/browse/ED-28212](ED-28212) - the `validNode()` function from
  @atlaskit/editor-core package will use memoization

## 5.13.0

### Minor Changes

- [#161626](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161626)
  [`a614421730437`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a614421730437) -
  [ux] EDITOR-769: Implement first phase of new AI Palette redesigns for Preview modal behind fg
  platform_editor_new_ai_palette

## 5.12.0

### Minor Changes

- [#165835](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/165835)
  [`b7143f7822214`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b7143f7822214) -
  Deprecate editorExperiments in favour of expValEquals

## 5.11.1

### Patch Changes

- [#165694](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/165694)
  [`2e1b7ff8a2e49`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2e1b7ff8a2e49) -
  refactor: align expValEquals and expValEqualsNoExposure to jira and confluence APIs

## 5.11.0

### Minor Changes

- [#165562](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/165562)
  [`59af663a32c9a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/59af663a32c9a) -
  Reduce block control re-renders under experiment

## 5.10.0

### Minor Changes

- [#163546](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163546)
  [`d3faab1b963ad`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d3faab1b963ad) -
  [ux] ED-28147 smart link support for cmd/ctrl click to open in new tab

## 5.9.0

### Minor Changes

- [#164680](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164680)
  [`6e5063967bda1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6e5063967bda1) -
  EDITOR-759 Put improve writing on full page using ADF streaming behind experiment.

## 5.8.0

### Minor Changes

- [#163510](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163510)
  [`82ae25a1f9aaa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/82ae25a1f9aaa) -
  Adds expValEquals and expValEqualsNoExposure methods

## 5.7.0

### Minor Changes

- [#163573](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163573)
  [`21e93839ec382`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21e93839ec382) -
  Convert platform_editor_controls_toolbar_pinning fg to
  platform_editor_controls_toolbar_pinning_exp experiment

## 5.6.0

### Minor Changes

- [#163183](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163183)
  [`90c987607095d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/90c987607095d) -
  Disable lazy node view behind an experiment

## 5.5.0

### Minor Changes

- [#154562](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154562)
  [`9a3495cb72638`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9a3495cb72638) -
  Support AnalyticsStep filtering for collab

## 5.4.0

### Minor Changes

- [#161893](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161893)
  [`432e1c30874a0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/432e1c30874a0) -
  controls performance gating switch to experiment

## 5.3.0

### Minor Changes

- [#161914](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161914)
  [`b1a7ef0ae8d44`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b1a7ef0ae8d44) -
  Switches text formatting options optimisation from FG to Experiment flag

## 5.2.0

### Minor Changes

- [#161266](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161266)
  [`6d9c690526ff6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6d9c690526ff6) -
  Added experiment for smart links open button

## 5.1.0

### Minor Changes

- [#159894](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159894)
  [`98f3c43ca93c5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/98f3c43ca93c5) -
  Avoid unnecessary reflows in the width plugin.

## 5.0.0

### Major Changes

- [#159655](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159655)
  [`24f8c627d50f2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/24f8c627d50f2) - ##
  WHAT? Remove experimental graceful edit mode from view mode plugin and associated props.

  ## WHY?

  This experiment is being cleaned up and we are no longer proceeding in this direction.

  ## HOW to adjust?

  This experiment was only enabled for Confluence and should not have been enabled in other places.
  If for some reason any of the following props/state/methdos were used please remove them:
  - isConsumption
  - contentMode
  - initialContentMode
  - updateContentMode

### Minor Changes

- [#160575](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160575)
  [`c340cf0e2d6c2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c340cf0e2d6c2) -
  Expose emoji provider promise to initialise in the toolbar earlier.
- [#156919](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156919)
  [`379f5c27f4939`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/379f5c27f4939) -
  delay table sticky headers until table is in viewport

## 4.25.0

### Minor Changes

- [#159149](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159149)
  [`ba8a35f91cb65`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ba8a35f91cb65) -
  [ux] EDITOR-717: Implement MVP of in-editor AI response streaming. This is behind the
  editor_ai_in_editor_streaming Statsig experiment.

## 4.24.0

### Minor Changes

- [#158351](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/158351)
  [`33c33e91149a1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/33c33e91149a1) -
  Cleaned up platform_editor_controls_shadow

## 4.23.0

### Minor Changes

- [#151439](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/151439)
  [`a5631e9713381`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a5631e9713381) -
  [EDITOR-724] Editor ai experiment set up + spike feature for quickstart command
- [#156743](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156743)
  [`1aa78352ee4a9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1aa78352ee4a9) -
  Add platform_editor_breakout_resizing experiment

## 4.22.0

### Minor Changes

- [#154858](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154858)
  [`bf96267428ccd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bf96267428ccd) -
  Adds experiment to not render children of expand element until it gets expanded

## 4.21.1

### Patch Changes

- [#153577](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153577)
  [`2d3375a7a48b1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2d3375a7a48b1) -
  [EDF-2259] Update usage of next media plugin behind fg 'platform_editor_ai_next_media_plugin'
  instead of experiment 'platform_editor_markdown_next_media_plugin_exp'

## 4.21.0

### Minor Changes

- [#153704](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153704)
  [`edb0da26267e6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/edb0da26267e6) -
  EDITOR-736 Put agent powered free generate in comment behind experiment.

## 4.20.0

### Minor Changes

- [#153675](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153675)
  [`8e3fe74a1e3ed`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8e3fe74a1e3ed) -
  [ux] [EDITOR-723] Editor AI users use Rovo General Knowledge for free generate

## 4.19.0

### Minor Changes

- [#150067](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150067)
  [`f625a2dfb3214`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f625a2dfb3214) -
  NO-ISSUE: Pass in values into multivariate configs so that it can be picked up by the experiment
  picker in Statlas

## 4.18.0

### Minor Changes

- [#149914](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149914)
  [`069cd0cee4bdd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/069cd0cee4bdd) -
  migrate editor core styles under new experiment to prepare optimization

## 4.17.0

### Minor Changes

- [#150957](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150957)
  [`ae21450efe2f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ae21450efe2f0) -
  [ux] [EDITOR-697] Add remove retry experiment, update tests and cleanup eslint rules as found

## 4.16.0

### Minor Changes

- [#149327](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149327)
  [`f1ba918778e20`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1ba918778e20) -
  EDITOR-676: Add editor_ai_contextual_selection_toolbar_button experiment.

### Patch Changes

- [#148798](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148798)
  [`8112e98809756`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8112e98809756) -
  [No Issue] Clean up virtualization feature flag

## 4.15.0

### Minor Changes

- [#147400](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/147400)
  [`800ff50276ed7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/800ff50276ed7) -
  Clean up experiment platform_editor_nested_non_bodied_macros

## 4.14.1

### Patch Changes

- [#145233](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145233)
  [`bc70a53def230`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bc70a53def230) -
  Revert nullability checks on experiments package.

## 4.14.0

### Minor Changes

- [#145086](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/145086)
  [`974da2c11753a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/974da2c11753a) -
  Reduced dependency list of analytics callback in renderer

## 4.13.0

### Minor Changes

- [#142156](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142156)
  [`9e2d56551d2cc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9e2d56551d2cc) -
  Remove WithPluginState from Table via platform_editor_usesharedpluginstateselector

## 4.12.0

### Minor Changes

- [#142955](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142955)
  [`4eda8a13e23ba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4eda8a13e23ba) -
  [https://product-fabric.atlassian.net/browse/ED-27627](ED-27627) - implement editor
  `featureFlagsPlugin` options creation inside `@atlassian/confluence-presets` package

### Patch Changes

- [#139698](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139698)
  [`cf8ea53ed0264`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cf8ea53ed0264) -
  Clean-up nested expand feature gate
- Updated dependencies

## 4.11.0

### Minor Changes

- [#142717](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142717)
  [`d9c2b4afdc497`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d9c2b4afdc497) -
  Add a null check for experiment config default value

## 4.10.0

### Minor Changes

- [#141495](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141495)
  [`b336d6ee33b41`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b336d6ee33b41) -
  [EDFITOR-306] Cleaned up old inline suggestion experiment, prepping for experiment v2

## 4.9.0

### Minor Changes

- [#141582](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141582)
  [`60370566f23be`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/60370566f23be) -
  [ux] EDITOR-604 Introduce alternative confidence score for nudges. Allow to configure various
  cutoff values.

## 4.8.0

### Minor Changes

- [#140813](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140813)
  [`c4756a5c1a4ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c4756a5c1a4ae) -
  Migrating offline editing feature gates to a new experiment "platform_editor_offline_editing_web"

## 4.7.0

### Minor Changes

- [#140996](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140996)
  [`f24f59a665aaf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f24f59a665aaf) -
  Added a temporary experiment to aid editor controls experiment set up

## 4.6.3

### Patch Changes

- [#133479](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/133479)
  [`57fe747245f32`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/57fe747245f32) -
  Clean up experiment

## 4.6.2

### Patch Changes

- [#133802](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/133802)
  [`f523489c8b68a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f523489c8b68a) -
  [ux] ED-27217 Clean up experiment platform_editor_element_drag_and_drop_nested

## 4.6.1

### Patch Changes

- [#134378](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134378)
  [`210a48c778086`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/210a48c778086) -
  EDITOR-546 Cleaned up platform_editor_cmd_a_progressively_select_nodes to revert to control
  behaviour.

## 4.6.0

### Minor Changes

- [#134562](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134562)
  [`f008c541bb06b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f008c541bb06b) -
  [ux] EDF-2645 Introduce an experiment to cut off low-quality nudges.

## 4.5.0

### Minor Changes

- [#127912](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127912)
  [`d3364031ea983`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d3364031ea983) -
  [NO-ISSUE] Cleaning up remaining pass experiments + follow ups

## 4.4.3

### Patch Changes

- [#132261](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132261)
  [`a8fe96525eb2c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a8fe96525eb2c) -
  ED-24801 Clean up platform_editor_insert_menu_in_right_rail

## 4.4.2

### Patch Changes

- [#133358](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/133358)
  [`d2fa1a1a5d369`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d2fa1a1a5d369) -
  [ED-24873] clean up platform_editor_element_level_templates

## 4.4.1

### Patch Changes

- [#132166](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132166)
  [`e1c6dcf47a8a2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e1c6dcf47a8a2) -
  ED-24538 Clean up platform_editor_basic_text_transformations

## 4.4.0

### Minor Changes

- [#131059](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131059)
  [`dce67fd9ee5e2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dce67fd9ee5e2) -
  [ux] ED-26802 tidying contextual formatting experiment

### Patch Changes

- [#131375](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131375)
  [`31ca9bdace9ea`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/31ca9bdace9ea) -
  Add null check in the case that an experiment is not correctly defined

## 4.3.0

### Minor Changes

- [#128664](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128664)
  [`abca3266336d9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/abca3266336d9) -
  [ED-23250] Remove form element from MediaFromUrl and consolidate experiments and feature flags in
  prepartion for jira release

## 4.2.0

### Minor Changes

- [#130262](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130262)
  [`236c73af67c7b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/236c73af67c7b) -
  [ED-24873] This change is cleaning up code from the element templates experiment
  `platform_editor_element_level_templates`.

## 4.1.2

### Patch Changes

- Updated dependencies

## 4.1.1

### Patch Changes

- [#127516](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127516)
  [`f4f3e822fcbd8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f4f3e822fcbd8) -
  updated default value in config for editor virt experiment

## 4.1.0

### Minor Changes

- [#125372](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/125372)
  [`333d2a5c64229`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/333d2a5c64229) -
  [EDF-2225] Cleanup platform_editor_ai_advanced_prompts Statsig experiment

### Patch Changes

- [#115815](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/115815)
  [`ad7c517ed3b47`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ad7c517ed3b47) -
  ED-26661 added experiement enables single column layout

## 4.0.0

### Major Changes

- [#126060](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/126060)
  [`fe137e1387076`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fe137e1387076) -
  Clean up Action Items experiment in Editor. Overriding the Quick Insert Action description and
  Task Item placeholder will now always take effect.

## 3.6.1

### Patch Changes

- [#123036](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/123036)
  [`08a3386cf1088`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/08a3386cf1088) -
  Editor virtualization experiment adjustment, fixes

## 3.6.0

### Minor Changes

- [#125840](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/125840)
  [`070cc7406b298`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/070cc7406b298) -
  EDF-2577: Register editor_text_highlight_orange_to_yellow experiment in tmp-editor-statsig
  experiments config

## 3.5.0

### Minor Changes

- [#124688](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/124688)
  [`9b1137bda6f87`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9b1137bda6f87) -
  [ux] ED-25486 Updates cmd+a behaviour to progressively select nodes behind
  platform_editor_cmd_a_progressively_select_nodes experiment.

## 3.4.0

### Minor Changes

- [#119706](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119706)
  [`42fd258ba482e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/42fd258ba482e) -
  ED-26704: enables editor node virtualization experiment

## 3.3.0

### Minor Changes

- [#120426](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120426)
  [`1fc7b1519dbcf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1fc7b1519dbcf) -
  Uses a separate FF for the new QuickInsert and Right rail to split them from the other Editor
  Controls features.

## 3.2.0

### Minor Changes

- [#118114](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/118114)
  [`21440675d09b2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21440675d09b2) -
  [EDF=2455] Added experiment and got rid of feature gate

## 3.1.0

### Minor Changes

- [#116752](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116752)
  [`7e889798e0963`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7e889798e0963) -
  EDF-2276 Clean up jira context experiment

### Patch Changes

- Updated dependencies

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

## 2.47.0

### Minor Changes

- [#115595](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115595)
  [`8eafb76f48873`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8eafb76f48873) -
  set up nested non-bodied macros experiment

## 2.46.0

### Minor Changes

- [#111692](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111692)
  [`e656e48ee1932`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e656e48ee1932) -
  ED-26473 Adding new experiment for platform_editor_node_nesting_expansion_non_macros

## 2.45.0

### Minor Changes

- [#112096](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112096)
  [`5d95afdd358ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5d95afdd358ac) -
  [ux] Creates a package for new QuickInsert and Right Rail UI and adds it under a FF

## 2.44.0

### Minor Changes

- [#111240](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111240)
  [`de6e6869aa62d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/de6e6869aa62d) -
  [ux] EDF-2393: Cleanup platform_editor_ai_1p_smart_link_unfurl_in_prompt experiment code
  references and autoformatting plugin integration in confluence

## 2.43.0

### Minor Changes

- [#110672](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110672)
  [`29afa832aa7c9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/29afa832aa7c9) -
  Remove a stale experiment

## 2.42.1

### Patch Changes

- [#111057](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111057)
  [`a87f76f559c65`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a87f76f559c65) -
  EDF-2382 Cleaned up platform_editor_ai_change_tone_floating_toolbar, defaulted to control
  behaviour.

## 2.42.0

### Minor Changes

- [#107782](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107782)
  [`cccc7a8347929`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cccc7a8347929) -
  [ux] ED-26378 Remove editor_nest_media_and_codeblock_in_quotes_jira and
  nestMediaAndCodeblockInQuote

## 2.41.0

### Minor Changes

- [#105835](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105835)
  [`e36d012fbbce1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e36d012fbbce1) -
  [ux] EDF-2053 Clean up mentions experiment

## 2.40.1

### Patch Changes

- [#105419](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105419)
  [`d9cef763b7140`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d9cef763b7140) -
  EDF-2255 Configure statsig for content read

## 2.40.0

### Minor Changes

- [#104916](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104916)
  [`372f52e24283d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/372f52e24283d) -
  [ux] EDF-2238 Implemented basic edit response capability in Preview screen.

## 2.39.0

### Minor Changes

- [#105009](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105009)
  [`a4039ebf7ed11`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a4039ebf7ed11) -
  [ux] Implement variant 2 cohorts experience for platform_editor_contextual_formatting_toolbar_v2
  experiment

## 2.38.0

### Minor Changes

- [#103433](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103433)
  [`2ea2995145fa4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2ea2995145fa4) -
  [ux] [https://product-fabric.atlassian.net/browse/EDF-2219] - add Advanced Prompt option into the
  Editor AI Command Palette

## 2.37.0

### Minor Changes

- [#103091](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103091)
  [`eeb701b917e68`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eeb701b917e68) -
  EDF-1645: Clean up Draft with AI prefill prompts

## 2.36.0

### Minor Changes

- [#103042](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103042)
  [`a3bcf71666e0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3bcf71666e0d) -
  Replace platform_editor_table_use_shared_state_hook with FG and fix remaining selection bugs
  caused by lack of re-renders

## 2.35.0

### Minor Changes

- [#102564](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102564)
  [`ddd5f55e9bef4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ddd5f55e9bef4) -
  Add multi-select experiment

## 2.34.0

### Minor Changes

- [#100411](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100411)
  [`14499ab145534`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14499ab145534) -
  [ux] Introduces advanced code block as per:
  https://hello.atlassian.net/wiki/spaces/EDITOR/pages/4632293323/Editor+RFC+063+Advanced+code+blocks.
  This can be added to an existing editor preset to enrich the code block experience with syntax
  highlighting and can be extended for other features via CodeMirror extensions (ie. autocompletion,
  code folding etc.).
- [#102045](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102045)
  [`44f96aff22dd9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/44f96aff22dd9) -
  [ED-26179] clean up platform_editor_elements_dnd_nested_table

## 2.33.1

### Patch Changes

- [#102069](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102069)
  [`3d4c9e1a85d9c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3d4c9e1a85d9c) -
  Clean up platform_editor_dnd_input_performance_optimisation experiment

## 2.33.0

### Minor Changes

- [#101369](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101369)
  [`afb7fc78b78c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/afb7fc78b78c0) -
  Cleaning all related proactive ai spelling and grammar fetaure gates and experiments

## 2.32.1

### Patch Changes

- [#100459](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100459)
  [`105137587329b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/105137587329b) -
  EDF-1803 Cleaned up platform_editor_ai_refine_response_button

## 2.32.0

### Minor Changes

- [#100022](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100022)
  [`0010534ce6037`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0010534ce6037) -
  [https://product-fabric.atlassian.net/browse/EDF-2058](EDF-2058) - cleanup
  platform_editor_ai_knowledge_from_current_page Statsig experiment

## 2.31.0

### Minor Changes

- [#99209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99209)
  [`8785c6901d958`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8785c6901d958) -
  [https://product-fabric.atlassian.net/browse/EDF-1802](EDF-1802) - remove
  platform_editor_ai_response_history Statsig experiment

## 2.30.0

### Minor Changes

- [#97986](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97986)
  [`7bb3014dc6f64`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7bb3014dc6f64) -
  [https://product-fabric.atlassian.net/browse/EDF-1801](EDF-1801) - cleanup
  platform_editor_ai_prompt_link_picker Statsig experiment

## 2.29.0

### Minor Changes

- [#180231](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/180231)
  [`4dbcc3d03b632`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4dbcc3d03b632) -
  [https://product-fabric.atlassian.net/browse/EDF-1844](EDF-1844) - cleanup
  platform_editor_ai_facepile Statsig experiment

## 2.28.0

### Minor Changes

- [#180067](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/180067)
  [`fdee6c449ca83`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fdee6c449ca83) -
  [ux] Adding block quote as an option to the text formatting menu for full page editors

## 2.27.1

### Patch Changes

- [#179266](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/179266)
  [`19a796ab55276`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/19a796ab55276) -
  EDF-2116 - Cleanup FG platform_editor_ai_release_additional_prompts and experiment
  platform_editor_ai_additional_editor_prompts

## 2.27.0

### Minor Changes

- [#177496](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/177496)
  [`dfb96360f8958`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dfb96360f8958) -
  Remove optimise-apply-dnd experiment

## 2.26.1

### Patch Changes

- [#172505](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/172505)
  [`3816509a67f5c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3816509a67f5c) -
  EDF-2055 Added platform_editor_ai_knowledge_from_current_page experiment

## 2.26.0

### Minor Changes

- [#175572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175572)
  [`40f53d4bf8e1a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40f53d4bf8e1a) -
  [ux] EDF-1636: Remove 1p placeholder hints experiment platform_editor_ai_1p_placeholder_hints
  making control the default experience again

## 2.25.0

### Minor Changes

- [#169428](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/169428)
  [`ded743b539788`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ded743b539788) -
  [ux] ED-25865 auto expand selection to include inline node

## 2.24.0

### Minor Changes

- [#176242](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176242)
  [`15cf55160272d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15cf55160272d) -
  [ux] EDF-2088 - Release additional prompts under FG platform_editor_ai_release_additional_prompts,
  release make shorter, rephrase, convert to table and convert to list, don't release add
  introduction and add conclusion

## 2.23.0

### Minor Changes

- [#173124](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/173124)
  [`58ca6c04a3498`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/58ca6c04a3498) -
  [https://product-fabric.atlassian.net/browse/EDF-2050](EDF-2050) - add @mention support into the
  Editor AI Command Palette

## 2.22.0

### Minor Changes

- [#170373](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170373)
  [`999f7f7bcd35c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/999f7f7bcd35c) -
  [https://product-fabric.atlassian.net/browse/EDF-1798](EDF-1798) - the Link Picker was added into
  the Editor AI Command Palette prompts

## 2.21.1

### Patch Changes

- [#168879](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168879)
  [`b6dd0c637ded9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6dd0c637ded9) -
  [EDF-1903] Add platform_editor_ai_unsplash_page_header experiment

## 2.21.0

### Minor Changes

- [#166948](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166948)
  [`0ab57e453a9f5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0ab57e453a9f5) -
  EDF-1639: Add prefillable prompts for Confluence pages so that when a user selects such prompt, it
  will prefill their AI input field. This is an experiment under platform_editor_ai_draft_with_ai.

## 2.20.1

### Patch Changes

- [#167651](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167651)
  [`5149d4fb1b488`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5149d4fb1b488) -
  Removed experiment editor*ai*-\_proactive_ai_spelling_and_grammar and defaulted the S+G config to
  on

## 2.20.0

### Minor Changes

- [#168098](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168098)
  [`fb613ef23788c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fb613ef23788c) -
  [https://product-fabric.atlassian.net/browse/EDF-1995](EDF-1995) - clean up
  `platform_editor_ai_command_palette_post_ga` Statsig experiment

## 2.19.0

### Minor Changes

- [#160519](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160519)
  [`9a7add3829ded`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9a7add3829ded) -
  [ux] EDF-1866: Add Smart Link unfurling (auto smart link conversion for shorthand ticket
  references like "EDF-123") behind experiment platform_editor_ai_1p_smart_link_unfurl_in_prompt
  into Editor AI prompt field (Prompt Editor)

## 2.18.0

### Minor Changes

- [#165866](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165866)
  [`e1ea80ff13502`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e1ea80ff13502) -
  EDF-1949 - Switch experiment platform_editor_live_pages_ai_definitions to FG
  platform_editor_ai_definitions_live_page_view_mode

## 2.17.0

### Minor Changes

- [#165097](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165097)
  [`0bca145c96b65`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0bca145c96b65) -
  [ux] Adds test styles options to the Selection toolbar under Contextual toolbar experiment

## 2.16.0

### Minor Changes

- [#163468](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163468)
  [`dd36c12324efd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dd36c12324efd) -
  JIV-19284 Allow setting task placeholder and quick insert action description for Editor tasks and
  decisions plugin

## 2.15.0

### Minor Changes

- [#164606](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/164606)
  [`d5fd875cd67f7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d5fd875cd67f7) -
  remove platform_editor_empty_line_prompt experiment

## 2.14.0

### Minor Changes

- [#161296](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161296)
  [`9a6292ab637fa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9a6292ab637fa) -
  [ED-25521] Add experiment based gating to the insertion logic for nested tables, so we only allow
  nesting tables one level deep when the experiment is active

## 2.13.1

### Patch Changes

- [#162401](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162401)
  [`da610ad81acb7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da610ad81acb7) -
  EDF-1910 Added platform_editor_ai_response_history

## 2.13.0

### Minor Changes

- [#163217](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163217)
  [`d2d5c286e4e86`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d2d5c286e4e86) -
  [ux] EDF-1845 Remove floating toolbar experiment (platform_editor_ai_floating_toolbar_v2). Change
  the behaviour to use the trailing variant of the experiment.

## 2.12.2

### Patch Changes

- [#162710](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162710)
  [`a661bece58fb8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a661bece58fb8) -
  [ux] EDF-1864 Updates the improve writing button from the floating toolbar to use the change tone
  to professional prompt. Added platform_editor_ai_change_tone_floating_toolbar experiment.

## 2.12.1

### Patch Changes

- [#160594](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160594)
  [`493429610a122`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/493429610a122) -
  Updated the proactive ai visual formatting experiment gate to use a new gate which is scoped to
  the tenantId. This will no longer be controlled via an experiment.

## 2.12.0

### Minor Changes

- [`1e479826df45b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1e479826df45b) -
  [EDF-1804](https://product-fabric.atlassian.net/browse/EDF-1804)
  [EDF-1805](https://product-fabric.atlassian.net/browse/EDF-1805) - add Refine button to the Editor
  AI Command Palette

### Patch Changes

- [#159628](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159628)
  [`38ed9d4438ed0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/38ed9d4438ed0) -
  EDF-1840 Set up statsig experiment

## 2.11.0

### Minor Changes

- [#159227](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159227)
  [`a82a45030b4c3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a82a45030b4c3) -
  [EDF-1716] Removed getExperimentCohort from @atlassian/generative-ai-modal/utils/experiments

## 2.10.0

### Minor Changes

- [#157006](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157006)
  [`666884d7c9e24`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/666884d7c9e24) -
  ED-25494 experiment on comment on inline node spotlight
- [#157011](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157011)
  [`dcdfd1e83ce5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dcdfd1e83ce5a) -
  change ugc typography experiment to a gate

## 2.9.0

### Minor Changes

- [#154829](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154829)
  [`0646280e9ab18`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0646280e9ab18) -
  [EDF-1176](https://product-fabric.atlassian.net/browse/EDF-1176) - add pulse EP effect to AI
  button in Editor floating toolbar

## 2.8.0

### Minor Changes

- [#155195](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155195)
  [`73c97aeb48ea9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/73c97aeb48ea9) -
  Add platform_editor_support_table_in_comment_jira experiment to control table drag and drop and
  table scaling features to support new table features in jira

## 2.7.0

### Minor Changes

- [#154252](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154252)
  [`00de4abde0cbf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/00de4abde0cbf) -
  EDF-1769 - [Prepare Experiment] Live Pages AI definitions

## 2.6.0

### Minor Changes

- [#153024](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153024)
  [`0200c770ddcb2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0200c770ddcb2) -
  [ux] Add multiple column layout via quick insert

## 2.5.0

### Minor Changes

- [#152407](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152407)
  [`d0365c4e1ce72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d0365c4e1ce72) -
  [ux] EDF-1630: Implement 1p prompt placeholder variations experiment behind
  platform_editor_ai_1p_placeholder_hints and prompt input statistic tracking behind
  platform_editor_ai_prompt_input_statistics
- [#152434](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152434)
  [`ab77fcc060a4b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ab77fcc060a4b) -
  [EDF-1583](https://product-fabric.atlassian.net/browse/EDF-1583) - cleanup
  platform_editor_ai_command_palate_improvement Statsig experiment

## 2.4.0

### Minor Changes

- [#152099](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152099)
  [`e7d3d5459e447`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e7d3d5459e447) -
  Add optimised-apply-dnd
- [#151154](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151154)
  [`c10924372260d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c10924372260d) -
  minor bump to ensure previously added experiments are picked up by products

## 2.3.2

### Patch Changes

- [#151153](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151153)
  [`b08ca9cb58898`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b08ca9cb58898) -
  Added a new proactive ai prosemirror plugin to the editor ai plugin. This plugin will be used for
  generating recommendations using AI and providing them to the user for inserting

## 2.3.1

### Patch Changes

- [#150384](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150384)
  [`d3dad252dbe46`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d3dad252dbe46) -
  [EDF-1177](https://product-fabric.atlassian.net/browse/EDF-1177) - add pulse effect support into
  editor floating toolbar

## 2.3.0

### Minor Changes

- [#149558](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149558)
  [`5e8619ac0f6e4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e8619ac0f6e4) -
  [ux] [ED-25085] Migrate typography \

  editor-plugin-media:
  - replace caption placeholder span with button
  - replace x between width and height pixel entry with symbol × \

  tmp-editor-statsig:
  - Add experiment `platform_editor_typography_migration_ugc`

## 2.2.1

### Patch Changes

- [#149419](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149419)
  [`9c2e5e1e4cdc9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9c2e5e1e4cdc9) -
  [ux] Update Floating toolbar to new UX designs

## 2.2.0

### Minor Changes

- [#147660](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147660)
  [`a407a8fbc874b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a407a8fbc874b) -
  ED-24365 Support commenting inside bodied extension content in the Renderer

## 2.1.15

### Patch Changes

- [#147137](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147137)
  [`339de234bcb4c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/339de234bcb4c) -
  [EDF-1508] Initial spike for Multi Prompt experiment

## 2.1.14

### Patch Changes

- [#146417](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146417)
  [`4302239b19be5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4302239b19be5) -
  Migrate table useSharedStateHook FF from LD to Statsig experiment.

## 2.1.13

### Patch Changes

- [#144888](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144888)
  [`ac1408cf343b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ac1408cf343b5) -
  [ux] EDF-1569 Removed Rovo footer from agents screen, behind
  platform_editor_ai_command_palette_post_ga experiment. Added experiment to editor config.

## 2.1.12

### Patch Changes

- [#139038](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139038)
  [`86a6dad9fb62e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/86a6dad9fb62e) -
  [ux] Enables Table sticky scrollbar in Renderer under an experiment FF.
- [#141778](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141778)
  [`1c6f578277694`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c6f578277694) -
  ED-24870 & ED-24864 - Add the logic to gate the nested media in quotes functionality behind the
  nest-media-and-codeblock-in-quote experiment. Also adjust the logic so the nested expands are now
  behind the nested-expand-in-expand experiment.

## 2.1.11

### Patch Changes

- [#140707](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140707)
  [`972fb840acf35`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/972fb840acf35) -
  Switch from fg to experiment for media-from-url

## 2.1.10

### Patch Changes

- [#138791](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138791)
  [`80669e45a30e0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/80669e45a30e0) -
  EDF-1548 Added experiment config for AI button for block elements.

## 2.1.9

### Patch Changes

- [#138414](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138414)
  [`7869af9163f3e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7869af9163f3e) -
  Added lazy node experiment to config

## 2.1.8

### Patch Changes

- [#138377](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138377)
  [`82a0bc6a2384e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/82a0bc6a2384e) -
  Added lazy node experiment to config

## 2.1.7

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18

## 2.1.6

### Patch Changes

- [#137404](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137404)
  [`adae1f3dc8fca`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/adae1f3dc8fca) -
  Switches Support Table in Comment features to use Statsig experiment instead of a Feature Gate.

## 2.1.5

### Patch Changes

- [#137234](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137234)
  [`e80c81de138e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e80c81de138e9) -
  [ux] [ED-24803] Experiment for editor block controls which adds a button to insert quickInsert
  elements

## 2.1.4

### Patch Changes

- [#136760](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136760)
  [`67e70c0779b86`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/67e70c0779b86) -
  [EDF-1274](https://product-fabric.atlassian.net/browse/EDF-1274) - replace
  platform_editor_ai_command_palate_improvement_fg FG by
  platform_editor_ai_command_palate_improvement Statsig experiment

## 2.1.3

### Patch Changes

- [#137041](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137041)
  [`060aff106c5ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/060aff106c5ac) -
  Add insert-right-rail experiment and reimplement right rail logic
- [#137041](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137041)
  [`060aff106c5ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/060aff106c5ac) -
  Add new experiment for insert menu in right rail, allow right menu to be opened from main toolbar
  '+' button

## 2.1.2

### Patch Changes

- [#136413](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136413)
  [`934839fbec788`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/934839fbec788) -
  Revert ED-24737-enable-right-rail due to HOT-111462

## 2.1.1

### Patch Changes

- [#136410](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136410)
  [`af422227cfb98`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/af422227cfb98) -
  Update eeTest to include experiment overrides
- [#136410](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136410)
  [`52083ca79b5dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/52083ca79b5dc) -
  [ux] ED-24603 Disable dragging nested nodes within table behind FF

## 2.1.0

### Minor Changes

- [#136054](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136054)
  [`9887c32fede77`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9887c32fede77) -
  EDF-1449 Fix floating toolbar experiment

## 2.0.1

### Patch Changes

- [#136295](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136295)
  [`0150dad7ca580`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0150dad7ca580) -
  Add new experiment for insert menu in right rail, allow right menu to be opened from main toolbar
  '+' button

## 2.0.0

### Major Changes

- [#136209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136209)
  [`2d0d9036c143a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2d0d9036c143a) -
  [ED-24790] Add support for editor experiments in gemini tests

## 1.4.1

### Patch Changes

- [#136078](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136078)
  [`09414d7233497`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/09414d7233497) -
  ED-24507 Switch nested dnd FG to experiment and include padding changes"

## 1.4.0

### Minor Changes

- [#135110](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135110)
  [`48ef3f98124db`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/48ef3f98124db) -
  [ux] [ED-24754] Add 5 template options to quick insert and element browser when
  `platform_editor_element_level_templates` experiment is enabled

## 1.3.2

### Patch Changes

- [#133128](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133128)
  [`5208be528f4e4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5208be528f4e4) -
  EO-2024-44 Improved types and added export

## 1.3.1

### Patch Changes

- [#133748](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133748)
  [`3d90a431f7ed8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3d90a431f7ed8) -
  Add experiment for input latency fix

## 1.3.0

### Minor Changes

- [#134006](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134006)
  [`51179090981ef`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/51179090981ef) -
  EDF-1302 updated condensed dloating toolbar feature flag to use statsig instrumentation

## 1.2.0

### Minor Changes

- [#131878](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131878)
  [`705fe39cae267`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/705fe39cae267) -
  [ED-24597] Update to log `platform_editor_basic_text_transformations` exposure event only for
  users meet all of 3 checks:
  - Are enrolled to the experiment
  - Have AI disabled
  - Make top level text selection
