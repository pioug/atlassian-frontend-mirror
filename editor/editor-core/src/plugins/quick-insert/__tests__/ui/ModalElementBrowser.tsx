import './ModalElementBrowser.mock';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { TypeAheadInsert } from '../../../type-ahead/types';
import quickInsertPlugin from '../..';
import type { Props } from '../../ui/ModalElementBrowser/ModalElementBrowser';
import { closeElementBrowserModal, insertItem } from '../../commands';
import { getQuickInsertSuggestions } from '../../search';

jest.mock('../../search');

describe('Quick Insert', () => {
  const createEditor = createEditorFactory();

  describe('contentComponents', () => {
    const getModalProps = () => {
      const provider = Promise.resolve({
        getItems() {
          return Promise.resolve([
            {
              title: 'Custom item',
              action(insert: TypeAheadInsert) {
                return insert('custom item');
              },
            },
          ]);
        },
      });

      const providerFactory = new ProviderFactory();

      const { editorView } = createEditor({
        providerFactory,
      });

      providerFactory.setProvider('quickInsertProvider', provider);

      const plugin = quickInsertPlugin({
        config: { enableElementBrowser: true },
      });

      const component = plugin.contentComponent!({
        editorView,
      } as any);

      const wrapper = mountWithIntl(component!);

      return wrapper.find('ModalElementBrowser').props() as Props;
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should not render the element browser modal component if the flag is not enabled', () => {
      const { editorView } = createEditor({});

      const plugin = quickInsertPlugin({ config: undefined });

      const component = plugin.contentComponent!({
        editorView,
      } as any);

      expect(component).toBe(null);
    });

    it('should insert the item and close the modal on selection', () => {
      const modalProps = getModalProps();

      const item = {
        title: 'foo',
        action: jest.fn(),
      };

      modalProps.onInsertItem(item);

      expect(insertItem).toHaveBeenCalledWith(item);
      expect(closeElementBrowserModal).toHaveBeenCalledTimes(1);
    });

    it('should call the search method to get initial items', () => {
      const modalProps = getModalProps();

      modalProps.getItems('proj', 'all');

      expect(getQuickInsertSuggestions).toHaveBeenCalledTimes(1);
      expect(getQuickInsertSuggestions).toHaveBeenCalledWith(
        { category: 'all', query: 'proj' },
        undefined,
        undefined,
      );
    });

    it('should call the close command if the modal is closed', () => {
      const modalProps = getModalProps();

      modalProps.onClose();

      expect(closeElementBrowserModal).toHaveBeenCalledTimes(1);
    });
  });
});
