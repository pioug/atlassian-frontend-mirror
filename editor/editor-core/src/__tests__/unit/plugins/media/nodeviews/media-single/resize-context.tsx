import React from 'react';
import { mount } from 'enzyme';
import {
  doc,
  layoutColumn,
  layoutSection,
  media,
  mediaSingle,
  p,
  table,
  td,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { MediaSingle } from '@atlaskit/editor-common';

import { MediaOptions } from '../../../../../../plugins/media/types';
import { mediaEditor, testCollectionName } from '../../_utils';
import NodeViewMediaSingle from '../../../../../../plugins/media/nodeviews/mediaSingle';
import ResizableMediaSingle from '../../../../../../plugins/media/ui/ResizableMediaSingle';
import { EventDispatcher } from '../../../../../../event-dispatcher';

describe('media resizing', () => {
  const eventDispatcher = new EventDispatcher();
  const mediaSingleNode = mediaSingle()(
    media({
      id: 'media',
      type: 'file',
      width: 100,
      height: 100,
      collection: testCollectionName,
    })(),
  );

  const mountMediaSingleDoc = (mediaOptions: MediaOptions, customDoc?: any) => {
    mediaOptions = {
      ...mediaOptions,
      allowMediaSingle: true,
      allowMarkingUploadsAsIncomplete: true,
    };
    const { editorView, editorProps, pluginState } = mediaEditor(
      customDoc || doc(mediaSingleNode),
      {
        media: mediaOptions,
        allowTables: true,
        allowLayouts: true,
      },
    );

    return mount(
      <NodeViewMediaSingle
        view={editorView}
        eventDispatcher={eventDispatcher}
        node={editorView.state.doc.nodeAt(0)!}
        lineLength={680}
        getPos={() => 1}
        width={123}
        selected={() => 1}
        mediaOptions={mediaOptions}
        mediaProvider={(editorProps.media || {}).provider}
        contextIdentifierProvider={editorProps.contextIdentifierProvider}
        mediaPluginState={pluginState}
        forwardRef={() => {}}
      />,
    );
  };

  it('is enabled when allowResizing enabled', () => {
    const wrapper = mountMediaSingleDoc({
      allowResizing: true,
    });

    expect(wrapper.find(ResizableMediaSingle)).toHaveLength(1);
    wrapper.unmount();
  });

  it('is disabled when allowResizing disabled', () => {
    const wrapper = mountMediaSingleDoc({
      allowResizing: false,
    });

    expect(wrapper.find(MediaSingle)).toHaveLength(1);
    wrapper.unmount();
  });

  describe('in layouts', () => {
    const mediaInLayout = doc(
      layoutSection(
        layoutColumn({ width: 50 })(mediaSingleNode),
        layoutColumn({ width: 50 })(p('')),
      ),
    );

    it('is enabled', () => {
      const wrapper = mountMediaSingleDoc(
        {
          allowResizing: true,
        },
        mediaInLayout,
      );

      expect(wrapper.find(ResizableMediaSingle)).toHaveLength(1);
      wrapper.unmount();
    });
  });

  describe('in tables', () => {
    const mediaInTable = doc(table()(tr(td({})(mediaSingleNode))));

    it('is enabled when allowResizingInTable is enabled', () => {
      const wrapper = mountMediaSingleDoc(
        {
          allowResizing: true,
          allowResizingInTables: true,
        },
        mediaInTable,
      );

      expect(wrapper.find(ResizableMediaSingle)).toHaveLength(1);
      wrapper.unmount();
    });

    it('is disabled when allowResizingInTable is not set', () => {
      const wrapper = mountMediaSingleDoc(
        {
          allowResizing: true,
        },
        mediaInTable,
      );

      expect(wrapper.find(MediaSingle)).toHaveLength(1);
      wrapper.unmount();
    });
  });
});
