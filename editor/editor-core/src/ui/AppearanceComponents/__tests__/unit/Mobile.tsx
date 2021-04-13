import React from 'react';
import { mount } from 'enzyme';
import { MobileAppearance } from '../../Mobile';
import {
  doc,
  p,
  table,
  td,
  tr,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { pluginKey } from '../../../../plugins/table/pm-plugins/plugin-factory';
import tablePlugin from '../../../../plugins/table';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
describe('Mobile Appearance Component', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add(tablePlugin),
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
