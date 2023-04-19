import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorFactory } from './__create-editor-helper';

describe('next/Editor', () => {
  const createEditor = createEditorFactory();

  it('should fire onChange when text is inserted', async () => {
    const handleChange = jest.fn();
    createEditor({
      props: {
        onMount(actions) {
          actions.appendText('hello');
        },
        onChange: handleChange,
      },
    });

    expect(handleChange).toHaveBeenCalled();
  });

  it('should use transformer for processing onChange', async () => {
    const handleChange = jest.fn();
    createEditor({
      props: {
        onMount(actions) {
          actions.appendText('hello');
        },
        onChange: handleChange,
        transformer: (schema) => ({
          encode: () => 'encoded document',
          parse: () => doc(p(''))(schema),
        }),
      },
    });

    expect(handleChange).toHaveBeenCalledWith('encoded document', {
      source: 'local',
    });
  });
});
