import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  code,
  textColor,
  p,
  a,
  strong,
  panel,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  TextColorPluginState,
  pluginKey as textColorPluginKey,
} from '../../../../plugins/text-color/pm-plugins/main';

describe('text-color', () => {
  const createEditor = createEditorFactory<TextColorPluginState>();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowTextColor: true, allowPanel: true },
      pluginKey: textColorPluginKey,
    });

  const testColor1 = '#97a0af';
  const testColor2 = '#0747a6';
  const createTextColor = (color: string) => textColor({ color });

  it('should expose whether textColor has any color on a range selection in a nested node', () => {
    const { pluginState } = editor(
      doc(panel()(p(createTextColor(testColor1)('{<}text{>}')))),
    );

    expect(pluginState.color).toBe(testColor1);
  });

  it('should expose no color when selection has multiple color marks', () => {
    const { pluginState } = editor(
      doc(
        p(
          '{<}',
          createTextColor(testColor1)('te'),
          createTextColor(testColor2)('xt'),
          '{>}',
        ),
      ),
    );

    expect(pluginState.color).toBe(null);
  });

  it('should expose no color when selection has mixed content', () => {
    const { pluginState } = editor(
      doc(p('{<}', createTextColor(testColor1)('te'), 'xt', '{>}')),
    );

    expect(pluginState.color).toBe(null);
  });

  it('should expose default color when selection has no color marks', () => {
    const { pluginState } = editor(doc(p('{<}text{>}')));

    expect(pluginState.color).toBe(pluginState.defaultColor);
  });

  it('should expose default color when selection has other marks', () => {
    const { pluginState } = editor(doc(p('{<}', strong('te'), 'xt{>}')));

    expect(pluginState.color).toBe(pluginState.defaultColor);
  });

  it('should expose color when the cursor is inside a textColor mark', () => {
    const { pluginState } = editor(
      doc(p(createTextColor(testColor1)('te{<>}xt'))),
    );

    expect(pluginState.color).toBe(testColor1);
  });

  it('should expose color when the cursor is at the ending of a textColor mark', () => {
    const { pluginState } = editor(
      doc(p(createTextColor(testColor1)('text'), '{<>}')),
    );

    expect(pluginState.color).toBe(testColor1);
  });

  it('should expose default color when the cursor is at the beginning of a textColor mark', () => {
    const { pluginState } = editor(
      doc(p('hello', createTextColor(testColor1)('{<>}text'))),
    );

    expect(pluginState.color).toBe(pluginState.defaultColor);
  });

  it('should expose color when the cursor is at beginning of doc with textColor mark', () => {
    const { pluginState } = editor(
      doc(p('', createTextColor(testColor1)('{<>}text'))),
    );

    expect(pluginState.color).toBe(testColor1);
  });

  it('should expose color when selection has other marks with textColor mark', () => {
    const { pluginState } = editor(
      doc(
        p(
          '{<}',
          createTextColor(testColor1)('hello ', strong('world'), '!'),
          '{>}',
        ),
      ),
    );

    expect(pluginState.color).toBe(testColor1);
  });

  it('exposes textColor as disabled when the mark cannot be applied', () => {
    const { pluginState } = editor(doc(p(code('te{<>}xt'))));

    expect(pluginState.disabled).toBe(true);
  });

  it('exposes textColor as disabled when inside hyperlink', () => {
    const { pluginState } = editor(
      doc(p(a({ href: 'http://www.atlassian.com' })('te{<>}xt'))),
    );

    expect(pluginState.disabled).toBe(true);
  });

  it('exposes textColor as not disabled when the mark can be applied', () => {
    const { pluginState } = editor(doc(p('te{<>}xt')));

    expect(pluginState.disabled).toBe(false);
  });
});
