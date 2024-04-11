import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { EditorContext } from '@atlaskit/editor-core/editor-context';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { editorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import { selectionMarkerPlugin } from '@atlaskit/editor-plugin-selection-marker';
import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Provider as SmartCardProvider } from '@atlaskit/smart-card';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';

import type { EditorActions } from '../src';
import WithEditorActions from '../src/ui/WithEditorActions';

const smartLinksProvider = new ConfluenceCardProvider('staging');
const smartCardClient = new ConfluenceCardClient('staging');

const SaveAndCancelButtons = (props: { editorActions: EditorActions }) => {
  const onClickPublish = () => {
    props.editorActions.getResolvedEditorState().then((value) => {
      console.log(value);
    });
  };

  return (
    <ButtonGroup>
      <Button appearance="primary" onClick={onClickPublish}>
        Publish
      </Button>
      <Button appearance="subtle" onClick={() => props.editorActions.clear()}>
        Close
      </Button>
    </ButtonGroup>
  );
};

function ComposableEditorPage() {
  // [ED-22843] this feature flag is for testing purposes only
  // eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
  const isLiveViewToggled = getBooleanFF('__live-view-toggle') ? true : false;

  const universalPreset = useUniversalPreset({
    props: {
      mentionProvider: Promise.resolve(mentionResourceProvider),
      allowStatus: true,
      allowTasksAndDecisions: true,
      allowAnalyticsGASV3: true,
      allowExpand: {
        allowInsertion: true,
        allowInteractiveExpand: true,
      },
      allowFragmentMark: true,
      allowExtension: {
        allowExtendFloatingToolbars: true,
      },
      allowBreakout: true,
      allowLayouts: { allowBreakout: true },
      allowTables: {
        allowColumnResizing: true,
        allowMergeCells: true,
        allowNumberColumn: true,
        allowBackgroundColor: true,
        allowHeaderRow: true,
        allowHeaderColumn: true,
        permittedLayouts: 'all',
      },
      allowDate: true,
      allowRule: true,
      allowPanel: { allowCustomPanel: true, allowCustomPanelEdit: true },
      allowFindReplace: true,
      media: {
        allowMediaSingle: true,
        allowCaptions: true,
      },
      elementBrowser: {
        showModal: true,
        replacePlusMenu: true,
      },
      linking: {
        // Currently there is an issue with the linking prop for presets so the provider
        // needs to be passed through the Composable Editor component
        smartLinks: {
          allowBlockCards: true,
          allowEmbeds: true,
          allowResizing: true,
        },
      },
    },
  });

  // Memoise the preset otherwise we will re-render the editor too often
  const { preset, editorApi } = usePreset(() => {
    return universalPreset
      .add([
        editorViewModePlugin,
        { mode: isLiveViewToggled ? 'edit' : 'view' },
      ])
      .add(selectionMarkerPlugin);
    // The only things that cause a re-creation of the preset is something in the
    // universal preset to be consistent with current behaviour (ie. this could
    // be a page width change via the `appearance` prop).
  }, [universalPreset]);

  React.useEffect(() => {
    if (!isLiveViewToggled) {
      return;
    }
    editorApi?.core?.actions.execute(
      editorApi?.editorViewMode?.commands.updateViewMode(
        isLiveViewToggled ? 'edit' : 'view',
      ),
    );
  }, [
    editorApi?.core?.actions,
    editorApi?.editorViewMode?.commands,
    isLiveViewToggled,
  ]);

  return (
    <SmartCardProvider client={smartCardClient}>
      <ComposableEditor
        placeholder="Editor AI"
        appearance={'full-page'}
        preset={preset}
        linking={{
          smartLinks: {
            provider: Promise.resolve(smartLinksProvider),
          },
        }}
        primaryToolbarComponents={
          isLiveViewToggled ? (
            <></>
          ) : (
            <WithEditorActions
              render={(actions) => (
                <SaveAndCancelButtons editorActions={actions} />
              )}
            />
          )
        }
      />
    </SmartCardProvider>
  );
}

export default function ComposableEditorPageWrapper() {
  return (
    <EditorContext>
      <ComposableEditorPage />
    </EditorContext>
  );
}
