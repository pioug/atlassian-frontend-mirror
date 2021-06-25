import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  inlineCard,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { CardProvider } from '@atlaskit/editor-common/provider-factory';
import { ProviderFactory } from '@atlaskit/editor-common';

import { OutstandingRequests } from '../../../types';
import { Request } from '../../../types';
import { INPUT_METHOD } from '../../../../../plugins/analytics/types';
import { pluginKey } from '../../plugin-key';
import { resolveWithProvider } from '../../util/resolve';

describe('resolveWithProvider()', () => {
  const createEditor = createEditorFactory();
  const providerFactory = new ProviderFactory();
  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      providerFactory,
      editorProps: {
        allowPanel: true,
        smartLinks: {},
      },
      pluginKey,
    });
  };

  class TestCardProvider implements CardProvider {
    resolve = jest.fn().mockReturnValue(Promise.resolve({}));
    async findPattern(): Promise<boolean> {
      return true;
    }
  }

  const cardProvider = new TestCardProvider();

  it('should resolve with the right request appearance', async () => {
    const url = 'https://docs.google.com/spreadsheets/d/168c/edit?usp=sharing';
    const request: Request = {
      appearance: 'block',
      compareLinkText: false,
      pos: 0,
      source: INPUT_METHOD.MANUAL,
      url,
    };
    const outstandingRequests: OutstandingRequests = {};
    const { editorView } = editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url,
          })(),
        ),
      ),
    );
    await resolveWithProvider(
      editorView,
      outstandingRequests,
      cardProvider,
      request,
    );
    expect(cardProvider.resolve).toHaveBeenCalledTimes(1);
    expect(cardProvider.resolve).toBeCalledWith(url, 'block');
  });
});
