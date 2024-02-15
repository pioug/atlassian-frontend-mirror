import React from 'react';

import { mount } from 'enzyme';

import type { DocBuilder } from '@atlaskit/editor-common/types';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugins/feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { tablesPlugin } from '@atlaskit/editor-plugins/table';
import { pluginKey } from '@atlaskit/editor-plugins/table/plugin-key';
import { widthPlugin } from '@atlaskit/editor-plugins/width';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  table,
  td,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { MobileAppearance } from '../../Mobile';

describe('Mobile Appearance Component', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add(selectionPlugin)
        .add(tablesPlugin),
      pluginKey,
    });

  const DummyChild = () => <div />;

  it('should wrap the children in ClickAreaMobile div with class ak-editor-content-area', () => {
    const { editorView } = editor(
      doc(table()(tr(td({})(p())), tr(td({})(p())), tr(td({})(p())))),
    );
    const wrapper = mount(
      <MobileAppearance editorView={editorView}>
        <DummyChild />
      </MobileAppearance>,
    );
    expect(wrapper.find('ClickAreaMobile').find('ContentArea')).toHaveLength(1);
    expect(
      wrapper
        .find('ClickAreaMobile')
        .find('.ak-editor-content-area')
        .find('DummyChild'),
    ).toHaveLength(1);
  });

  it('should pass editorView prop to ClickAreaMobile', () => {
    const { editorView } = editor(
      doc(table()(tr(td({})(p())), tr(td({})(p())), tr(td({})(p())))),
    );
    const wrapper = mount(
      <MobileAppearance editorView={editorView}>
        <DummyChild />
      </MobileAppearance>,
    );
    expect(wrapper.find('ClickAreaMobile').prop('editorView')).toEqual(
      editorView,
    );
  });

  it('should pass editorView as undefined when editor view prop is null to ClickAreaMobile', () => {
    const editorView = null;
    const wrapper = mount(
      <MobileAppearance editorView={editorView}>
        <DummyChild />
      </MobileAppearance>,
    );
    expect(wrapper.find('ClickAreaMobile').prop('editorView')).toBeUndefined();
  });

  it('should have a div inside ClickAreaMobile with className as ak-editor-content-area', () => {
    const { editorView } = editor(
      doc(table()(tr(td({})(p())), tr(td({})(p())), tr(td({})(p())))),
    );
    const wrapper = mount(
      <MobileAppearance editorView={editorView}>
        <DummyChild />
      </MobileAppearance>,
    );

    expect(wrapper.find('ClickAreaMobile').find('ContentArea')).toHaveLength(1);
    expect(
      wrapper.find('ClickAreaMobile').find('.ak-editor-content-area'),
    ).toHaveLength(1);
  });
});
