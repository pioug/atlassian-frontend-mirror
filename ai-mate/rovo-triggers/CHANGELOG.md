# @atlaskit/rovo-triggers

## 5.9.0

### Minor Changes

- [`f91239ef9383c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f91239ef9383c) -
  [ux] Update the workflow wizard UI action component to render a redirection button when outside of
  context.

## 5.8.0

### Minor Changes

- [`7b27558330c14`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7b27558330c14) -
  Adds a pub-sub event to trigger a conversation action from outside Rovo

## 5.7.0

### Minor Changes

- [`7bc2893010341`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7bc2893010341) -
  auto add subpath exports and sort them

## 5.6.1

### Patch Changes

- [`4a11592a1a45a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4a11592a1a45a) -
  Add @atlassian/a11y-jest-testing to devDependencies.

## 5.6.0

### Minor Changes

- [`4ed112b530268`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4ed112b530268) -
  Run lint autofix to address existing lint violations and make internal import statements more
  specific (bypass barrel files) to optimize dependency graph.
- [`ec61a217ca99b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ec61a217ca99b) -
  Rovo chat insert urls follow ups

## 5.5.0

### Minor Changes

- [`744ed096e08c8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/744ed096e08c8) -
  Add in missing subpath export

## 5.4.0

### Minor Changes

- [`92866a25d8694`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/92866a25d8694) -
  Added new subpath exports to enable direct imports from source modules instead of root barrel
  file.

## 5.3.1

### Patch Changes

- [`2367bfbab903a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2367bfbab903a) -
  Add iframe title to integration test

## 5.3.0

### Minor Changes

- [`8ae7b09b07a1c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8ae7b09b07a1c) -
  Add the ability to edit already published agents by adding support for a new tool called
  UpdateAgentConfigurationTool and refetching agent information on success of the tool

## 5.2.0

### Minor Changes

- [`9a1069a9e2278`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9a1069a9e2278) -
  [ux] Add studio-automation-trigger-rule-build action to fetch automation rule in Studio

## 5.1.0

### Minor Changes

- [`acb6725dc1ece`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/acb6725dc1ece) -
  [ux] Add UI action to receive generated rule from workflow builder minion and send to Automation

## 5.0.0

### Major Changes

- [`af3bc63b43fca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/af3bc63b43fca) -
  Workflow builder rovo types have been updated for the delete transition operation behind a feature
  gate.

  Type has been updated from:

  ```
  {
  	transitionId: TransitionId;
  	transitionName: string;
  };
  ```

  To:

  ```
  {
  	id: TransitionId;
  	name: string;
  	toStatusId: StatusId;
  	toStatusName: string;
  	toStatusCategory: StatusCategory;
  	links: {
  		fromStatusId: StatusId;
  		fromStatusName: string;
  		fromStatusCategory: StatusCategory;
  	}[];
  }
  ```

## 4.12.0

### Minor Changes

- [`01661f49ef857`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/01661f49ef857) -
  [ux] Send automation rule generation prompts to Rovo chat in Studio

## 4.11.0

### Minor Changes

- [`200e543bf9df4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/200e543bf9df4) -
  [ux] Add the more menu for solution architect chat modal

## 4.10.0

### Minor Changes

- [`7cecf9e263a5f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7cecf9e263a5f) -
  Adds the opening of mini-modal as a capability to pub-sub.

## 4.9.0

### Minor Changes

- [`ba35a55c8437c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ba35a55c8437c) -
  [ux] Added new event type (jsm-journey-builder-actions) in rovo-triggers

## 4.8.1

### Patch Changes

- [`e3779b75fdeca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e3779b75fdeca) -
  EDITOR-1643 Promote syncBlock and bodiedSyncBlock to full schema

## 4.8.0

### Minor Changes

- [`4c2c97e4d5162`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4c2c97e4d5162) - -
  Add a message action component for updating a solution draft agent
  - Add a new type of pubsub event that refreshes the agent overview based on updated agent
    information
  - Use a specific minion alias for the agent builder when talking to Rovo Chat within the agent
    routes in Studio V2.

## 4.7.0

### Minor Changes

- [`99f954d642b19`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/99f954d642b19) -
  [ux] Update Rovo chat pubsub `chat-new` event to also accept prompt placeholders. Consuming this
  in Skills Directory to always open a new Solutions Architect chat with a prefilled prompt

## 4.6.0

### Minor Changes

- [`997e4c23170b2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/997e4c23170b2) -
  [ux] Support activating agent from chat plan card

## 4.5.0

### Minor Changes

- [`53c2e8326ad53`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/53c2e8326ad53) -
  Add ability to update the state of the solution plan when an agent associated with a solution plan
  is published and refresh the information displayed in the solution plan in the chat.

## 4.4.0

### Minor Changes

- [`9da3e7c74b44a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9da3e7c74b44a) -
  [ux] Sort builds by number after retrieving solution plan from the backend. Update CTA copy to
  "Start building" for all object types

## 4.3.0

### Minor Changes

- [`f5cfc5eacefad`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f5cfc5eacefad) -
  [ux] App + agent handoff flow from solution architect

## 4.2.1

### Patch Changes

- [`a05464ea42678`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a05464ea42678) -
  EDITOR-2791 bump adf-schema

## 4.2.0

### Minor Changes

- [`118d4ca79d39c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/118d4ca79d39c) -
  EDITOR-2894 - Support Jira additionalContext

## 4.1.0

### Minor Changes

- [`8bb807d8c76e6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8bb807d8c76e6) -
  Adding \*.ts files for no barrel files detection for ai-mate packages

## 4.0.1

### Patch Changes

- [`fa6ccc7d15810`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fa6ccc7d15810) -
  Tooling: Add eslint-plugin-no-barrel-files and ignore existing violations. No published code
  affected

## 4.0.0

### Major Changes

- [`7df1d25b57424`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7df1d25b57424) -
  Rovo types have been updated for generic external action errors for consistent naming.

## 3.18.0

### Minor Changes

- [`28b001c5985f4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/28b001c5985f4) -
  Introduced:
  - URL validation utility with pattern matching (wildcards \* and \*\*)
  - Add promptInputDroppableUr config for configurable URL validation
  - Unit tests for URL validation

  Changed:
  - Simplified useUrlInsertion hook (removed type-specific logic)
  - Updated FileUploadDropzone to validate URLs using new config
  - Event payload: insert-urls → insert-urls-into-prompt-input
  - Removed urlType field from event data structure

- [`15e36868e69c6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/15e36868e69c6) -
  [ux] Introduce a capability for Rovo to listen to generic external action errors fired to surface
  an error message.

## 3.17.0

### Minor Changes

- [`8c79d013d1465`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8c79d013d1465) -
  [ux] Added Drag-and-Drop URL Support

  Added ability to drag and drop card URLs (e.g., Trello cards) directly into chat input
  - URLs are automatically formatted as inline cards
  - Duplicate URLs are automatically detected and prevented
  - Proper spacing and formatting maintained between multiple cards

  Enhanced
  - File upload dropzone now supports both file attachments and URL card drops
  - Chat input editor can now receive URLs from external sources via drag-and-drop

## 3.16.0

### Minor Changes

- [`1e470200487fe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1e470200487fe) -
  Adds new `useGenericEditorSkill` optional property to be used with rovo context with editor. This
  enables use of the generic editor minion

## 3.15.3

### Patch Changes

- [`939a083bf7a60`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/939a083bf7a60) -
  add support for database context

## 3.15.2

### Patch Changes

- [`21fe79119fe74`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21fe79119fe74) -
  EDITOR-2447 Bump adf-schema to 51.3.2

## 3.15.1

### Patch Changes

- [`c28cd65d12c24`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c28cd65d12c24) -
  EDITOR-2447 Bump adf-schema to 51.3.1

## 3.15.0

### Minor Changes

- [`534bece8a4fe1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/534bece8a4fe1) -
  Adds the ability to add uploaded files to the chat-new pubsub listener event

## 3.14.1

### Patch Changes

- [`b7c4ffd0fd579`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b7c4ffd0fd579) -
  [ux] Adding isViewMode property to send to chat if the user is in view/readonly mode on a
  whiteboard

## 3.14.0

### Minor Changes

- [`5167552fe1a93`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5167552fe1a93) -
  [EDITOR-2339] Bump @atlaskit/adf-schema to 51.3.0

## 3.13.0

### Minor Changes

- [`f2efb53c01833`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2efb53c01833) -
  [ux] Adding isViewMode property to send to chat if the user is in view mode

## 3.12.0

### Minor Changes

- [`e874c628413f8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e874c628413f8) -
  Adding initial support for passing minion config when sending a message

## 3.11.0

### Minor Changes

- [`50df18bcd01bb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/50df18bcd01bb) -
  add ability to set productKey when sending message via pubsub
- [`687c1b8fa7801`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/687c1b8fa7801) -
  EDITOR-1566 bump adf-schema + update validator

## 3.10.0

### Minor Changes

- [`93ca2cbba6084`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/93ca2cbba6084) -
  Clean up the integrate_aiwb_to_rovo_chat feature flag

## 3.9.0

### Minor Changes

- [`13fbf4dfcc7a4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/13fbf4dfcc7a4) -
  Prevent Rovo pubsub subscribers from being erreonously dropped
- [`0a6f3cc9c2aeb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0a6f3cc9c2aeb) -
  Open chat sidebar when using inline prompt with agent

## 3.8.0

### Minor Changes

- [`b367661ba720e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b367661ba720e) -
  EDITOR-1562 bump adf-schema for afm

## 3.7.0

### Minor Changes

- [`64ec65231b4cf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/64ec65231b4cf) -
  EDITOR-1568 bump adf-schema for afm

## 3.6.0

### Minor Changes

- [`11044e9b6f9f6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/11044e9b6f9f6) -
  Passing preview message ID to home preview button

## 3.5.3

### Patch Changes

- [`74c2f420ee49b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/74c2f420ee49b) -
  Internal changes to how border radius is applied.
- [`afd8a4b9ec9dd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/afd8a4b9ec9dd) -
  Add support for prefixing on the sourceId when requesting to generate a loom script for confluence
  page. This change is feature gated behind rovo-chat-glitchiness-fix-loom-script-confluence

## 3.5.2

### Patch Changes

- [`cd70a377d007c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cd70a377d007c) -
  Internal changes to how border radius is applied.

## 3.5.1

### Patch Changes

- [`a2cd8c46a3e94`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a2cd8c46a3e94) -
  EDITOR-1442 Bump adf-schema

## 3.5.0

### Minor Changes

- [`6f26b732b4fc0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6f26b732b4fc0) -
  Include selectionFragment and selectionLocalIds on editor context payload

## 3.4.1

### Patch Changes

- [`57b19274b9fdd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/57b19274b9fdd) -
  EDITOR-1373 Bump adf-schema version

## 3.4.0

### Minor Changes

- [`cd33693cf4431`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cd33693cf4431) -
  Add new whiteboards context to pass along to llm as needed

## 3.3.0

### Minor Changes

- [#201076](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/201076)
  [`9c5b61c98daf3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9c5b61c98daf3) -
  [ux] Add a new package `loom-script-in-confluence-chat-call-to-action-panel` which has a new
  call-to-action panel for future use in chat history, this component is still not consumed
  anywhere. Also added a new event in `rovo-triggers` forthe cta being clicked. This change relates
  to the experiment
  https://hello.atlassian.net/wiki/spaces/Growth/pages/5129359003/Loom+AI+readtime+prompt+and+script+for+confluence+pages+Project+Poster.

## 3.2.0

### Minor Changes

- [`0e29af758fdf4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0e29af758fdf4) -
  Add in support for getting ADF from staging area editor and passing it to the conversation
  assistant

## 3.1.6

### Patch Changes

- [#195649](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195649)
  [`231bb33e06dfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/231bb33e06dfe) -
  EDITOR-1131 Bump adf-schema version to 50.2.0

## 3.1.5

### Patch Changes

- [#191913](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191913)
  [`6d1e56695e91d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6d1e56695e91d) -
  EDITOR-1131 Bump adf-schema package to 50.0.0

## 3.1.4

### Patch Changes

- [#191387](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191387)
  [`6f7cc8d725008`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6f7cc8d725008) -
  [ux] adding transition id to delete rule payload

## 3.1.3

### Patch Changes

- [#188287](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188287)
  [`51b3b61c573f3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/51b3b61c573f3) -
  Rovo types for Jira Workflow Builder agent are updated to include statusId for add status
  operations.

## 3.1.2

### Patch Changes

- [#187144](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187144)
  [`a16147d8fbdfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a16147d8fbdfe) -
  Bump @atlaskit/adf-schema to v49.0.5

## 3.1.1

### Patch Changes

- [#181521](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/181521)
  [`3ddd40e7aeab6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3ddd40e7aeab6) -
  Update rovo trigger types to include update status operation for workflow builder

## 3.1.0

### Minor Changes

- [#175516](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175516)
  [`7ac176c5546bf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7ac176c5546bf) -
  Added support for a 'chat-close' payload within Rovo Triggers to allow users to remotely close the
  Rovo chat.

## 3.0.0

### Major Changes

- [#172185](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/172185)
  [`b8c6a37095ab9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b8c6a37095ab9) -
  Support setting AI Feature Context using pubsub

## 2.17.0

### Minor Changes

- [#169814](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/169814)
  [`40e4575b749e0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/40e4575b749e0) -
  Added insertPrompt query param

## 2.16.0

### Minor Changes

- [#170731](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/170731)
  [`8d3ba2716ca4a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8d3ba2716ca4a) -
  add get/set AI Feature Context

## 2.15.0

### Minor Changes

- [#168884](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/168884)
  [`62d1dcae72ca1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/62d1dcae72ca1) -
  Now the consumers of Rava chat that launch chat with URL mostly for full screen experience can
  provide a new url param `rovoChatInitiator` to enable `initiator` logging in message sent and
  agentMessage received events. Refer this
  [doc](https://hello.atlassian.net/wiki/spaces/AA6/pages/5413278975/RFC-009+Rovo+Chat+Initiator+Tracking)
  for more details.

## 2.14.0

### Minor Changes

- [#159942](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159942)
  [`96479556c8a49`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/96479556c8a49) -
  DXAI-477: Add new dashboard-insights-actions payload event to Rovo pubsub"

## 2.13.0

### Minor Changes

- [#155265](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155265)
  [`39e13851ab159`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/39e13851ab159) -
  Add the ability to take in and store workflow context from jira for the workflow builder agent

## 2.12.0

### Minor Changes

- [#153961](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153961)
  [`0c9bdadc81cb7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0c9bdadc81cb7) -
  Added support for highlight action placeholder to be inserted into editor when clicking Chat from
  highlight actions menu

## 2.11.0

### Minor Changes

- [#144867](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144867)
  [`ccdd14f4bdaef`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ccdd14f4bdaef) -
  Add support for agent-external-config-reference pubsub payload behind fg

## 2.10.0

### Minor Changes

- [#136531](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/136531)
  [`bf09e88468d38`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bf09e88468d38) -
  Allow New Chat Payload to support ADF prompts.

## 2.9.0

### Minor Changes

- [#133407](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/133407)
  [`9e51ca53f3752`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9e51ca53f3752) -
  Add JiraIssueWorkBreakdownAction type and support JiraIssueWorkBreakdownUIAction

## 2.8.0

### Minor Changes

- [#132823](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132823)
  [`baec8548ddfdd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/baec8548ddfdd) -
  Add support for status and rule presentation components in workflow builder rovo agent

## 2.7.1

### Patch Changes

- [#131989](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131989)
  [`3c353c272040f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3c353c272040f) -
  Update types for Workflow builder Rovo agent, update agent icon, and add presentational card for
  transition actions

## 2.7.0

### Minor Changes

- [#131838](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131838)
  [`afdb0a7ae2e5b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/afdb0a7ae2e5b) -
  updated types for rovo workflow wizard agent

## 2.6.0

### Minor Changes

- [#131371](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131371)
  [`bcdda396edf72`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bcdda396edf72) -
  Support mimeType as optional prop in ChatNewPayload type

## 2.5.0

### Minor Changes

- [#130965](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130965)
  [`224b0a23d3ee0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/224b0a23d3ee0) -
  EDF-2621 Added open-browse-agent-sidebar payload type to open rovo chat with browse agent tab
  active.

## 2.4.0

### Minor Changes

- [#127018](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127018)
  [`a6014f18c038f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a6014f18c038f) -
  Adding types for rovo trigger to invoke workflow editor actions via pub sub

## 2.3.0

### Minor Changes

- [#125175](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/125175)
  [`0befa7f34e357`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0befa7f34e357) -
  Add `placeholderType` to `insert-prompt` pubsub event

## 2.2.0

### Minor Changes

- [#122105](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122105)
  [`73e1118517615`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73e1118517615) - -
  Support new pubsub event to send a placeholder prompt
  - Remove `rovo_conversation_starters_use_placeholder` FG

## 2.1.0

### Minor Changes

- [#119332](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119332)
  [`b1b3d91f244e2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b1b3d91f244e2) -
  Migrate package to compiled

## 2.0.0

### Major Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

## 1.6.0

### Minor Changes

- [#115442](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115442)
  [`99a5dbb7e64f3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/99a5dbb7e64f3) -
  Add 3p action auth handling

## 1.5.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

## 1.4.1

### Patch Changes

- [#170106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170106)
  [`a77f143e57528`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a77f143e57528) -
  Fixed invalid styles that were not rendering.

## 1.4.0

### Minor Changes

- [#165779](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165779)
  [`e93c2da005e72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e93c2da005e72) -
  Fix the change introduced in conversation-assistant 2.47.0, some chat-new event are overridden by
  agent-changed event

## 1.3.0

### Minor Changes

- [#162886](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162886)
  [`59490f4204eea`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/59490f4204eea) -
  [https://product-fabric.atlassian.net/browse/EDF-1889](EDF-1889) - add subscription to rovo agent
  changes into the Editor AI plugin

## 1.2.0

### Minor Changes

- [#162034](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162034)
  [`b9b034c26952f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9b034c26952f) -
  Support publishing pubsub event through postMessage, and with acknowledgment receipt if the
  postMessage event is published. Will be used for smart-card agent embed inside iframe, as
  communication between iframe and the parent window.

## 1.1.0

### Minor Changes

- [#155717](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155717)
  [`8bb782c91fb02`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8bb782c91fb02) -
  Upgrade to react 18

## 1.0.0

### Major Changes

- [#153462](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153462)
  [`6c079f0811ae0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6c079f0811ae0) -
  Initialize rovo-triggers
