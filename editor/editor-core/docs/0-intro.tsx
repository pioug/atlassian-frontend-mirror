import React from 'react';

import { AtlassianInternalWarning, code, Example, md, Props } from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}
  ## Introduction

  The \`@atlaskit/editor-core\` package is part of the Atlassian front-end platform and provides core functionality for the rich text editor. It provides an easy-to-use and highly customizable editing experience, built on React as our primary rendering approach. It relies on the ProseMirror libraries, which offer a wide range of out-of-the-box features, including support for text formatting, lists, and more.

  There is a separate Renderer package that caters for rendering the edited content without the editing experience.

  This documentation will provide you with everything you need to get started using the Atlassian Editor, including:

  * Installation instructions
  * Basic usage examples
  * Advanced customization options

  ## Prerequisites

  * **React 16:** at the time of writing, the Atlassian Editor is built on top of React 16 and doesn’t explicitly support any higher versions of React yet, which means both the \`react\` and \`react-dom\` libraries and their dependencies need to be set to React 16 compatible version.
  * **Singleton:** the ProseMirror libraries in use and the document format \(Atlassian Document Format, ADF\) demand that some of the libraries using them are singletons, as multiple versions of the library will cause breaking issues. So, consumers of the Atlassian Editor need to enforce these singletons; this is usually done by deduplicating after installing the dependencies or by setting libraries to specific versions through resolutions to avoid multiple versions. Our recommendation is to use [yarn-deduplicate](https://www.npmjs.com/package/yarn-deduplicate).

  ## Installation

  1. Install the editor libraries  
    - **npm:** \`npm install --save @atlaskit/editor-core @atlaskit/css-reset\`
    - **yarn:** \`yarn add @atlaskit/editor-core @atlaskit/css-reset\`

  2. Deduplicate the dependencies \(if necessary\) by setting resolutions to avoid multiple versions of the editor libraries or by running [npm dedupe](https://docs.npmjs.com/cli/v6/commands/npm-dedupe) or [yarn dedupe](https://yarnpkg.com/cli/dedupe) after installation.
  3. Setup the CSS reset in your application  
    \`import '@atlaskit/css-reset';\`

  ## Usage

  ### [Legacy Editor](editor-core/docs/legacy-editor)


  ### Composable Editor

  #### Simplest implementation

  The following code example will render the comment editor with only basic text formatting enabled.

${code`
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { basePlugin } from '@atlaskit/editor-plugins/base';

const CommentEditor = () => {
  const { preset } = usePreset((builder) => builder.add(basePlugin));

  return <ComposableEditor preset={preset} />;
};
`}

  ## Configuration

  ### Presets

  The Atlassian Editor employs a plugin system to extend its capabilities, offering a wide range of plugins to enhance its feature set. Plugins can also have dependencies on one another to deliver their functionality \(for example, the table plugin depends on the guideline plugin\). To simplify the process of including and configuring these plugins, we've introduced the concept of presets. Presets are a collection of plugins that work seamlessly together.

  You can start with one of the preset provided with \`editor-core\` and extend their functionality, or build your own using \`EditorPresetBuilder\`. You always need the \`basePlugin\` in any preset.

  #### Using the Pre-defined Default Preset

${code`
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';

const createPreset = () =>
  createDefaultPreset({ featureFlags: {}, paste: {} });
const { preset } = usePreset(createPreset);
`}

  The default preset encompasses all the essentials needed for the Editor to function, representing the minimum set of plugins. It includes core Atlassian libraries essential for editor development \(feature flags, analytics, editor state management\), as well as common editor features \(copy/paste, clipboard support, focus, composition, decorations, undo/redo, block elements, annotations, hyperlink support, basic text formatting, responsive width support, quick-insert, type-ahead, placeholder text, editor controls, selections, code blocks\). Some of these core plugins can be disabled through the configuration object passed into \`createDefaultPreset\`.


  #### Using the Pre-defined Universal Preset

${code`
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';

const presetProps = {
  props: {},
};
const universalPreset = useUniversalPreset(presetProps);
`}

  In addition to the default preset, the universal preset contains a comprehensive set of features for a fully-featured editor. It supports functionalities like data consumers, content insertion, breakout, alignment, text color, lists, rules, expands, guidelines, media, captions, mentions, emoji, tables, tasks & decisions, feedback dialogs, help dialogs, collaborative editing, maximum content size restrictions, Jira issue linking, panels, context panels, extensions, macros, annotations, dates, placeholder text, layouts, cards, auto-formatting rules, status elements, indentation, scroll-into-view behavior, complex history behavior, mobile support, and advanced toolbar support.

  Warning: The universal preset includes all editor plugins, which can significantly increase bundle size. It is generally advisable to create a custom preset according to your needs.

  #### Adding a plugin to a preset

  To add a plugin to a preset, use the following methods:

  * Use \`maybeAdd\` to conditionally add the plugin.
  * Use \`add\` for plugins that should always be included.

${code`
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';

const createPreset = () =>
  createDefaultPreset({ featureFlags: {}, paste: {} })
    .add(listPlugin)
    .maybeAdd(historyPlugin, (plugin, builder) => {
      if (featureFlag) {
        return builder.add(plugin); // Add the plugin
      }
      return builder; // Don't add the plugin
    });
    
const { preset } = usePreset(createPreset);
`}

  Some plugins are dependent on others. If you encounter type issues with a specific plugin, it's crucial to verify that all necessary dependencies have been added. These can be cross-checked within the individual documentation of each plugin.

  #### Create a custom preset

  Create your custom preset using the \`default\` preset as a base (extending with card and list functionality).

${code`
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { createDefaultPreset } from '@atlaskit/editor-core/labs-next';

const createPreset = () =>
  createDefaultPreset({ featureFlags: {}, paste: {} })
    .add(gridPlugin)
    .add([cardPlugin, { platform: 'web' }])
    .add(listPlugin);

const { preset } = usePreset(createPreset);
`}

  Or from scratch (simple preset with basic text formatting, list, analytics, and headings):

  ${code`
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';

const createPreset = () =>
    new EditorPresetBuilder()
      .add(basePlugin)
      .add(analyticsPlugin)
      .add(blockTypePlugin)
      .add(listPlugin)

const { preset } = usePreset(createPreset);
`}

  To keep your integrated editor running smoothly, it's important to have a stable preset. If you generate a new preset every time the editor re-renders, it can slow things down significantly. The best way to maintain a stable preset across re-renders is to use the \`usePreset\` hook or similar memoization techniques. This helps your editor run efficiently without unnecessary recalculations.

  ---

  ### Appearances

  Appearances determine how the editor's user interface \(UI\) is displayed and can be configured using a property passed into the editor component.


  #### Comment

  The comment editor appearance provides a contained editor UI with a simple toolbar. It is best used when the Editor isn't the primary focus area of the page, such as when it's used for editing comments on a page. This editor appearance still includes a toolbar with editor controls.

${code`

  const createPreset = () =>
    createDefaultPreset({ featureFlags: {}, paste: {} });
  const { preset } = usePreset(createPreset);

  // 'comment' is the default appearance, you don't need to pass it
  return <ComposableEditor appearance='comment' preset={preset} />;
`}

  Comment is the default appearance so this is equivalent:

${code`

  const createPreset = () =>
    createDefaultPreset({ featureFlags: {}, paste: {} });
  const { preset } = usePreset(createPreset);

  return <ComposableEditor preset={preset} />;
`}


  #### Full Page and Full Width

  The full-page and full-width editor appearances provide an editor UI that stretches to fill the entire page. They are suitable when the Editor is the main focus area on the page.

${code`
  const createPreset = () =>
    createDefaultPreset({ featureFlags: {}, paste: {} });
  const { preset } = usePreset(createPreset);
  
  return <ComposableEditor appearance='full-page' preset={preset} />;
  // Or full-width
  return <ComposableEditor appearance='full-width' preset={preset} />;
`}


  #### Chromeless

  The chromeless editor appearance provides the Editor without any of the standard UI features. It's ideal for cases where the integrator wants complete control and responsibility over the editor UI.

${code`
  const createPreset = () =>
    createDefaultPreset({ featureFlags: {}, paste: {} });
  const { preset } = usePreset(createPreset);
  return <ComposableEditor appearance='chromeless' preset={preset} />;
`}

  #### Mobile

  The mobile editor appearance is tailored to deliver a mobile experience through a mobile web view. It's essentially a full-page editor version for mobile.

${code`
  const createPreset = () =>
    createDefaultPreset({ featureFlags: {}, paste: {} });
  const { preset } = usePreset(createPreset);
  return <ComposableEditor appearance='mobile' preset={preset} />;
`}


  ### Collapsible Editor

  Sometimes, you may not want to display the whole Editor initially, and you'd prefer to show it in a collapsed state so that users can expand it when needed. 

  Here's how you can implement this behavior:

${code`
import { useState } from 'react';
import { CollapsedEditor } from '@atlaskit/editor-core';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';

const CollapsibleEditor = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const createPreset = () =>
    createDefaultPreset({ featureFlags: {}, paste: {} });
  const { preset } = usePreset(createPreset);

  return (
    <CollapsedEditor
      placeholder='What would you like to say?'
      onFocus={() => setIsExpanded(true)}
      isExpanded={isExpanded}>
      <ComposableEditor
        preset={preset}
        onSave={(_editorView) => alert('The save button is a lie.')}
        onCancel={() => setIsExpanded(false)}
      />
    </CollapsedEditor>
  );
};
`}


  ### Editor with providers

  The Editor can't access information from its context by default. Instead, specific plugins provide a mechanism to allow you to supply custom logic for accessing environment variables.

  An excellent example of this is mentions, where you would want to provide user information the Editor can access and define how it should be presented inside the Editor. To enable the capability of mentioning users inside the Editor, you need to pass in a "mention provider." This object allows you to define the logic used to determine which users can be mentioned in the Editor.

  This could look something like this:

${code`
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
import { MentionDescription, MentionProvider } from '@atlaskit/mention';

const CommentEditorWithMentions = () => {
  const exampleMentionProvider: MentionProvider = {
    filter(_query?: string): void {},
    recordMentionSelection(_mention: MentionDescription): void {},
    shouldHighlightMention(_mention: MentionDescription): boolean {
      return false;
    },
    isFiltering(_query: string): boolean {
      return false;
    },
    subscribe(): void {},
    unsubscribe(_key: string): void {},
  };

  const createPreset = () =>
    createDefaultPreset({ featureFlags: {}, paste: {} });
  const { preset } = usePreset(createPreset);

  return <ComposableEditor preset={preset} mentionProvider={presetProps.props.mentionProvider} />;
};
`}

  ## Getting the editor value

  The \`core\` API on the \`editorApi\` can be used to request the document of the editor.

  Here is an example of a simple editor requesting the document when the content changes:

  ${code`
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { EditorContext } from '@atlaskit/editor-core/editor-context';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';

const createPreset = () =>
    new EditorPresetBuilder()
      .add(basePlugin)
      .add(analyticsPlugin)
      .add(blockTypePlugin)
      .add(listPlugin)

function EditorInternal() {
  const { editorApi, preset } = usePreset(createPreset);
  return (
    <ComposableEditor
      preset={preset}
      onChange={() => {
        editorApi?.core?.actions.requestDocument(doc => {
          // Use the document as you require
        })
      }}
    />
  );
};

export function Editor() {
  return (
    <EditorContext
      <Editor />
    </EditorContext>
  );
};
`}

  #### When does the document return?

  For performance reasons we throttle calls to \`requestDocument\` and will return the document when there is idle time.

  There is a timeout however which will start the document request to ensure the callback doesn't take seconds to fire.

  ### Transforming the value

  By default the requested document is returned as \`JSONDocNode\` (see \`@atlaskit/editor-json-transformer\`).

  However, oftentimes you may want the document in a different format. The \`core\` API also provides a method to
  create a transformer based on a schema.

  The \`requestDocument\` callback will be typed appropriately based on the transformer passed to it.

  Example using the \`BitbucketTransformer\` (which transforms to markdown):

  ${code`

function EditorInternal() {
  const { editorApi, preset } = usePreset(createPreset);

  // We memoise the transformer in case this component renders frequently
  const transformer = useMemo(() => 
    editorApi?.core?.actions?.createTransformer((schema) => new BitbucketTransformer(schema))
  , [editorApi])

  return (
    <ComposableEditor
      preset={preset}
      onChange={() => {
        editorApi?.core?.actions.requestDocument(doc => {
          // Use the document as you require - it will be typed as "string | undefined" due to the transformer type
        }, { transformer })
      }}
    />
  );
};
`}


${(
	<Example
		packageName="@atlaskit/editor-core/composable-editor"
		Component={require('../examples/1-basic-composable-editor').default}
		title="Basic"
		source={require('!!raw-loader!../examples/1-basic-composable-editor')}
	/>
)}

  ${(
		<Props
			shouldCollapseProps
			heading="Props"
			props={require('!!extract-react-types-loader!../src/composable-editor/composable-editor')}
		/>
	)}

`;
