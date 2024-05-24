import React from 'react';

import type { ADFEntity } from '@atlaskit/adf-utils/types';
import { validator } from '@atlaskit/adf-utils/validator';
import type {
  ErrorCallback,
  ValidationError,
} from '@atlaskit/adf-utils/validatorTypes';
import { validationErrorHandler } from '@atlaskit/editor-common/utils';
import type { AnnotationProviders as EditorAnnotationProviders } from '@atlaskit/editor-plugins/annotation';
import { highlightPlugin } from '@atlaskit/editor-plugins/highlight';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';
// eslint-disable-next-line import/no-extraneous-dependencies, import/order -- Removed import for fixing circular dependencies
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers/mock-insert-menu';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { exampleMediaFeatureFlags } from '@atlaskit/media-test-helpers/exampleMediaFeatureFlags';
import {
  mentionResourceProvider,
  mentionResourceProviderWithResolver,
} from '@atlaskit/util-data-test/mention-story-data';

import {
  getProviders,
  mediaProvider,
  quickInsertProvider,
} from '../../examples/5-full-page';
import type { EditorActions } from '../../src';
import { ComposableEditor } from '../../src/composable-editor';
import { useUniversalPreset } from '../../src/preset-universal';
import type {
  EditorAppearance,
  EditorPlugin,
  EditorProps,
} from '../../src/types';
import { usePreset } from '../../src/use-preset';
import type { Error } from '../ErrorReport';

export type ValidatingKitchenSinkEditorProps = {
  actions: EditorActions;
  appearance: EditorAppearance;
  adf?: object;
  disabled?: boolean;
  sanitizePrivateContent?: boolean;
  primaryToolbarComponents: React.ReactElement<any>;
  popupMountPoint?: HTMLElement;
  validationTimeout?: number;
  onDocumentChanged?: (adf: any) => void;
  onDocumentValidated?: (errors?: Error[]) => void;
  extensionProviders: EditorProps['extensionProviders'];
  featureFlags: EditorProps['featureFlags'];
  editorPlugins?: EditorPlugin[];
  editorAnnotationProviders: EditorAnnotationProviders;
};

export type ValidatingKitchenSinkEditorState = {
  editorView: EditorView;
};

const smartCardClient = new ConfluenceCardClient('stg');
const DEFAULT_VALIDATION_TIMEOUT = 500;
const EMPTY: EditorPlugin[] = [];

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
  private providers = getProviders();

  render() {
    const {
      actions,
      appearance,
      adf,
      disabled,
      primaryToolbarComponents,
      popupMountPoint,
      extensionProviders,
      sanitizePrivateContent,
    } = this.props;

    return (
      <SmartCardProvider client={smartCardClient}>
        <KitchenSinkEditor
          elementBrowser={{
            showModal: true,
            replacePlusMenu: true,
          }}
          appearance={appearance}
          allowAnalyticsGASV3
          quickInsert={{
            provider: this.quickInsertProviderPromise,
          }}
          allowUndoRedoButtons={true}
          allowFragmentMark={true}
          allowBorderMark={true}
          allowTextColor={true}
          allowTables={{
            advanced: true,
            allowDistributeColumns: true,
          }}
          // allowTables={false}
          allowBreakout={true}
          allowPanel={{
            allowCustomPanel: true,
            allowCustomPanelEdit: true,
          }}
          allowExtension={{
            allowBreakout: true,
            allowExtendFloatingToolbars: true,
          }}
          allowRule={true}
          allowDate={true}
          allowLayouts={{
            allowBreakout: true,
            UNSAFE_addSidebarLayouts: true,
            UNSAFE_allowSingleColumnLayout: true,
          }}
          allowTextAlignment={true}
          allowIndentation={true}
          allowTemplatePlaceholders={{ allowInserting: true }}
          smartLinks={{
            provider: this.cardProviderPromise,
            allowBlockCards: true,
            allowEmbeds: true,
          }}
          linking={{ smartLinks: { allowDatasource: true } }}
          allowExpand={{ allowInsertion: true }}
          allowStatus={true}
          allowNestedTasks
          annotationProviders={{
            inlineComment: {
              ...this.props.editorAnnotationProviders.inlineComment,
              supportedBlockNodes:
                this.props.featureFlags &&
                this.props.featureFlags['comments-on-media']
                  ? ['media']
                  : [],
            },
          }}
          codeBlock={{ allowCopyToClipboard: true, appearance }}
          {...this.providers}
          mentionProvider={Promise.resolve(
            sanitizePrivateContent ?? false
              ? mentionResourceProviderWithResolver
              : mentionResourceProvider,
          )} // enable highlight only for kitchen sink example
          sanitizePrivateContent={sanitizePrivateContent ?? false}
          media={{
            provider: mediaProvider,
            allowMediaSingle: true,
            enableDownloadButton: true,
            allowResizing: true,
            allowLinking: true,
            allowResizingInTables: true,
            allowAltTextOnImages: true,
            allowCaptions: true,
            allowMediaInlineImages: true,
            featureFlags: {
              ...exampleMediaFeatureFlags,
              mediaInline: true,
            },
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
          showIndentationButtons={true}
          featureFlags={{
            'safer-dispatched-transactions': true,
            ...this.props.featureFlags,
          }}
          dangerouslyAppendPlugins={{
            __plugins: this.props.editorPlugins ?? EMPTY,
          }}
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

      const validate = validator(nodes, marks, {
        allowPrivateAttributes: true,
      });

      const errorCb: ErrorCallback = (entity, error, options) => {
        const wrappedEntity = validationErrorHandler(
          entity,
          error,
          options,
          marks,
          validate,
        );

        if (!wrappedEntity) {
          return entity;
        }

        return {
          ...wrappedEntity,
          attrs: { ...wrappedEntity.attrs, error, entity },
        };
      };

      const { entity } = validate(doc as ADFEntity, errorCb);

      findErrorsRecursively(entity as ADFEntity, schema, (error, entity) => {
        errors.push({ entity, error });
        // TODO: investigate why `getAttr` can't source an error for `unsupportedNodeAttribute`s now
        if (!error) {
          console.error('Got an undefined error in `findErrorsRecursively`?');
        }
      });

      this.props.onDocumentValidated(errors);
    });
  };
}

const getAttr = (entity: ADFEntity, attr: string) => {
  if (!entity || !entity.attrs) {
    return undefined;
  }
  return entity.attrs[attr];
};

const findErrorsRecursively = (
  entity: ADFEntity,
  schema: Schema,
  errorCallback: (error: ValidationError, entity: ADFEntity) => void,
) => {
  const { type: entityType, marks: entityMarks } = entity;
  const { unsupportedMark, unsupportedNodeAttribute } = schema.marks;
  const { unsupportedInline, unsupportedBlock } = schema.nodes;
  if (entityMarks) {
    entityMarks.forEach((mark) => {
      if (
        mark.type === unsupportedMark.name ||
        mark.type === unsupportedNodeAttribute.name
      ) {
        errorCallback(getAttr(mark, 'error'), getAttr(mark, 'entity'));
      }
    });
  }
  if (
    entityType === unsupportedInline.name ||
    entityType === unsupportedBlock.name
  ) {
    errorCallback(getAttr(entity, 'error'), getAttr(entity, 'entity'));
  } else {
    (entity.content || []).forEach((childEntity) =>
      findErrorsRecursively(childEntity as ADFEntity, schema, errorCallback),
    );
  }
};

const KitchenSinkEditor = (props: EditorProps) => {
  const universalPreset = useUniversalPreset({
    props,
  });
  const { preset } = usePreset(() => universalPreset.add(highlightPlugin));
  return <ComposableEditor preset={preset} {...props} />;
};
