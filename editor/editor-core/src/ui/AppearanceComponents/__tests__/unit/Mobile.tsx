import React from 'react';
import { mount } from 'enzyme';
import { MobileAppearance } from '../../Mobile';
import {
  doc,
  p,
  table,
  td,
  tr,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { pluginKey } from '../../../../plugins/table/pm-plugins/plugin-factory';
import tablePlugin from '../../../../plugins/table';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
describe('Mobile Appearance Component', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: any) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add(tablePlugin),
      pluginKey,
    });

  const DummyChild = () => <div />;

  it('should wrap the children in ClickAreaBlock div with class ak-editor-content-area', () => {
    const { editorView } = editor(
      doc(table()(tr(td({})(p())), tr(td({})(p())), tr(td({})(p())))),
    );
    const wrapper = mount(
      <MobileAppearance editorView={editorView}>
        <DummyChild />
      </MobileAppearance>,
    );
    expect(wrapper.find('ContentArea').find('ClickAreaBlock')).toHaveLength(1);
    expect(
      wrapper
        .find('ClickAreaBlock')
        .find('.ak-editor-content-area')
        .find('DummyChild'),
    ).toHaveLength(1);
  });

  it('should pass editorView prop to ClickAreaBlock', () => {
    const { editorView } = editor(
      doc(table()(tr(td({})(p())), tr(td({})(p())), tr(td({})(p())))),
    );
    const wrapper = mount(
      <MobileAppearance editorView={editorView}>
        <DummyChild />
      </MobileAppearance>,
    );
    expect(
      wrapper.find('ContentArea').find('ClickAreaBlock').prop('editorView'),
    ).toEqual(editorView);
  });

  it('should pass editorView as undefined when editor view prop is null to ClickAreaBlock', () => {
    const editorView = null;
    const wrapper = mount(
      <MobileAppearance editorView={editorView}>
        <DummyChild />
      </MobileAppearance>,
    );
    expect(
      wrapper.find('ContentArea').find('ClickAreaBlock').prop('editorView'),
    ).toBeUndefined();
  });

  it('should have a div inside ClickAreaBlock with className as ak-editor-content-area', () => {
    const { editorView } = editor(
      doc(table()(tr(td({})(p())), tr(td({})(p())), tr(td({})(p())))),
    );
    const wrapper = mount(
      <MobileAppearance editorView={editorView}>
        <DummyChild />
      </MobileAppearance>,
    );

    expect(wrapper.find('ContentArea').find('ClickAreaBlock')).toHaveLength(1);
    expect(
      wrapper.find('ClickAreaBlock').find('.ak-editor-content-area'),
    ).toHaveLength(1);
  });
});
