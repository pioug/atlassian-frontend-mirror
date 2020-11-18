import React from 'react';

import { EditorView } from 'prosemirror-view';

import {
  customInsertMenuItems,
  extensionHandlers,
} from '@atlaskit/editor-test-helpers';
import { exampleMediaFeatureFlags } from '@atlaskit/media-test-helpers';
import { validator, ErrorCallback, ADFEntity } from '@atlaskit/adf-utils';
import { Provider as SmartCardProvider } from '@atlaskit/smart-card';
import { mention } from '@atlaskit/util-data-test';
import {
  ConfluenceCardClient,
  ConfluenceCardProvider,
} from '../../examples/5-full-page-with-confluence-smart-cards';
import Editor from '../../src/editor';
import { EditorAppearance, EditorProps } from '../../src/types';
import { EditorActions } from '../../src';

import {
  providers,
  mediaProvider,
  quickInsertProvider,
} from '../../examples/5-full-page';
import { Error } from '../ErrorReport';

export type ValidatingKitchenSinkEditorProps = {
  actions: EditorActions;
  appearance: EditorAppearance;
  adf?: object;
  disabled?: boolean;
  primaryToolbarComponents: React.ReactElement<any>;
  popupMountPoint?: HTMLElement;
  validationTimeout?: number;
  onDocumentChanged?: (adf: any) => void;
  onDocumentValidated?: (errors?: Error[]) => void;
  extensionProviders: EditorProps['extensionProviders'];
};

export type ValidatingKitchenSinkEditorState = {
  editorView: EditorView;
};

const smartCardClient = new ConfluenceCardClient('stg');
const DEFAULT_VALIDATION_TIMEOUT = 500;

export class ValidatingKitchenSinkEditor extends React.Component<
  ValidatingKitchenSinkEditorProps,
  ValidatingKitchenSinkEditorState
> {
  private quickInsertProviderPromise = Promise.resolve(quickInsertProvider);
  private cardProviderPromise = Promise.resolve(
    new ConfluenceCardProvider('stg'),
  );

  private validatorTimeout?: number;
  private editorView?: EditorView;

  render() {
    const {
      actions,
      appearance,
      adf,
      disabled,
      primaryToolbarComponents,
      popupMountPoint,
      extensionProviders,
    } = this.props;

    return (
      <SmartCardProvider client={smartCardClient}>
        <Editor
          appearance={appearance}
          quickInsert={{
            provider: this.quickInsertProviderPromise,
          }}
          allowTextColor={true}
          allowTables={{
            advanced: true,
          }}
          allowBreakout={true}
          allowJiraIssue={true}
          allowPanel={true}
          allowExtension={{
            allowBreakout: true,
            allowAutoSave: true,
          }}
          allowRule={true}
          allowDate={true}
          allowLayouts={{
            allowBreakout: true,
            UNSAFE_addSidebarLayouts: true,
          }}
          allowTextAlignment={true}
          allowIndentation={true}
          allowTemplatePlaceholders={{ allowInserting: true }}
          UNSAFE_cards={{
            provider: this.cardProviderPromise,
            allowBlockCards: true,
            allowEmbeds: true,
          }}
          allowExpand={{ allowInsertion: true }}
          allowStatus={true}
          allowNestedTasks
          codeBlock={{ allowCopyToClipboard: true }}
          {...providers}
          mentionProvider={Promise.resolve(
            mention.storyData.resourceProviderWithTeamMentionHighlight,
          )} // enable highlight only for kitchen sink example
          media={{
            provider: mediaProvider,
            allowMediaSingle: true,
            allowResizing: true,
            allowAnnotation: true,
            allowLinking: true,
            allowResizingInTables: true,
            allowAltTextOnImages: true,
            featureFlags: exampleMediaFeatureFlags,
          }}
          insertMenuItems={customInsertMenuItems}
          extensionHandlers={extensionHandlers}
          extensionProviders={extensionProviders}
          placeholder="Type something here, and watch it render to the side!"
          shouldFocus={true}
          defaultValue={adf}
          disabled={disabled}
          onChange={() => this.onEditorChanged(actions)}
          popupsMountPoint={popupMountPoint}
          primaryToolbarComponents={primaryToolbarComponents}
        />
      </SmartCardProvider>
    );
  }

  componentDidMount() {
    // grab view
    this.editorView = this.props.actions._privateGetEditorView();

    // validate immediately
    this.validateDocument();
  }

  UNSAFE_componentWillReceiveProps(newProps: ValidatingKitchenSinkEditorProps) {
    if (this.props.actions !== newProps.actions) {
      this.editorView = newProps.actions._privateGetEditorView();
    }

    if (this.props.adf !== newProps.adf) {
      // set timeout to re-validate
      if (this.validatorTimeout) {
        window.clearTimeout(this.validatorTimeout);
      }

      this.validatorTimeout = window.setTimeout(
        this.validateDocument,
        this.props.validationTimeout || DEFAULT_VALIDATION_TIMEOUT,
      );
    }
  }

  private requestIdle(fn: () => void) {
    return (window as any).requestIdleCallback
      ? // eslint-disable-next-line compat/compat
        (window as any).requestIdleCallback(fn)
      : window.requestAnimationFrame(fn);
  }

  private cancelIdle(marker: number) {
    return (window as any).cancelIdleCallback
      ? // eslint-disable-next-line compat/compat
        (window as any).cancelIdleCallback(marker)
      : window.cancelAnimationFrame(marker);
  }

  private changing?: number;

  private onEditorChanged = (editorActions: EditorActions) => {
    if (this.changing) {
      this.cancelIdle(this.changing);
    }

    this.requestIdle(async () => {
      const { onDocumentChanged } = this.props;
      if (onDocumentChanged) {
        const adf = await editorActions.getValue();
        onDocumentChanged(adf);
      }
    });
  };

  private validating?: number;

  private validateDocument = () => {
    if (this.validating) {
      this.cancelIdle(this.validating);
    }

    this.validating = this.requestIdle(() => {
      const doc = this.props.adf;

      if (!this.editorView || !doc || !this.props.onDocumentValidated) {
        return;
      }

      const schema = this.editorView.state.schema;

      const marks = Object.keys(schema.marks);
      const nodes = Object.keys(schema.nodes);
      const errors: Array<Error> = [];

      const errorCb: ErrorCallback = (entity, error) => {
        errors.push({
          entity,
          error,
        });

        return entity;
      };

      validator(nodes, marks, {
        allowPrivateAttributes: true,
      })(doc as ADFEntity, errorCb);

      this.props.onDocumentValidated(errors);
    });
  };
}
