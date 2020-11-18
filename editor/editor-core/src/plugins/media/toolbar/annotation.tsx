import React from 'react';
import AnnotateIcon from '@atlaskit/icon/glyph/media-services/annotate';
import { MediaClientConfig } from '@atlaskit/media-core';
import { getMediaClient } from '@atlaskit/media-client';
import { EditorView } from 'prosemirror-view';
import { InjectedIntl } from 'react-intl';

import { Command } from '../../../types';
import Button from '../../floating-toolbar/ui/Button';
import Separator from '../../floating-toolbar/ui/Separator';

import { stateKey } from '../pm-plugins/plugin-key';
import { openMediaEditor } from '../commands/media-editor';

import {
  withAnalytics,
  ACTION_SUBJECT_ID,
  ACTION_SUBJECT,
  ACTION,
  EVENT_TYPE,
} from '../../../plugins/analytics';
import { MediaPluginState } from '../pm-plugins/types';
import { toolbarMessages } from './toolbar-messages';

const annotate: Command = (state, dispatch) => {
  const pluginState: MediaPluginState | undefined = stateKey.getState(state);
  if (!pluginState) {
    return false;
  }

  const { mediaSingle } = state.schema.nodes;
  const selected = pluginState.selectedMediaContainerNode();
  if (!selected || selected.type !== mediaSingle) {
    return false;
  }

  const {
    id,
    collection: collectionName,
    occurrenceKey,
  } = selected.firstChild!.attrs;

  return withAnalytics({
    action: ACTION.CLICKED,
    actionSubject: ACTION_SUBJECT.MEDIA,
    actionSubjectId: ACTION_SUBJECT_ID.ANNOTATE_BUTTON,
    eventType: EVENT_TYPE.UI,
  })(
    openMediaEditor(state.selection.from + 1, {
      id,
      collectionName,
      mediaItemType: 'file',
      occurrenceKey,
    }),
  )(state, dispatch);
};

type AnnotationToolbarProps = {
  viewMediaClientConfig: MediaClientConfig;
  id: string;
  collection?: string;
  intl: InjectedIntl;
  view?: EditorView;
};

export class AnnotationToolbar extends React.Component<AnnotationToolbarProps> {
  state = {
    isImage: false,
  };

  async componentDidMount() {
    await this.checkIsImage();
  }

  async checkIsImage() {
    const mediaClient = getMediaClient(this.props.viewMediaClientConfig);
    if (!this.props.id) {
      return;
    }
    try {
      const state = await mediaClient.file.getCurrentState(this.props.id, {
        collectionName: this.props.collection,
      });

      if (state && state.status !== 'error' && state.mediaType === 'image') {
        this.setState({
          isImage: true,
        });
      }
    } catch (err) {
      // do nothing in case of media-client error
    }
  }

  componentDidUpdate(prevProps: AnnotationToolbarProps) {
    if (prevProps.id !== this.props.id) {
      this.setState({ isImage: false }, () => {
        this.checkIsImage();
      });
    }
  }

  onClickAnnotation = () => {
    const { view } = this.props;
    if (view) {
      annotate(view.state, view.dispatch);
    }
  };

  render() {
    if (!this.state.isImage) {
      return null;
    }

    const { intl } = this.props;

    const title = intl.formatMessage(toolbarMessages.annotate);

    return (
      <>
        <Separator />
        <Button
          title={title}
          icon={<AnnotateIcon label={title} />}
          onClick={this.onClickAnnotation}
        />
      </>
    );
  }
}

export const renderAnnotationButton = (
  pluginState: MediaPluginState,
  intl: InjectedIntl,
) => {
  return (view?: EditorView, idx?: number) => {
    const selectedContainer = pluginState.selectedMediaContainerNode();
    if (!selectedContainer || !pluginState.mediaClientConfig) {
      return null;
    }

    return (
      <AnnotationToolbar
        key={idx}
        viewMediaClientConfig={pluginState.mediaClientConfig}
        id={selectedContainer.firstChild!.attrs.id}
        collection={selectedContainer.firstChild!.attrs.collection}
        view={view}
        intl={intl}
      />
    );
  };
};
