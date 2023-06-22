import { handleUpdate } from '../../../../pm-plugins/main';
import * as utils from '../../../../pm-plugins/utils';

const updateEditButtonSpy = jest.spyOn(utils, 'updateEditButton');
const mockExtensionDomElement = document.createElement('div');

jest.mock('../../../../plugin-factory', () => ({
  ...jest.requireActual<Object>('../../../../plugin-factory'),
  getPluginState: jest.fn((state) => state),
}));

jest.mock('../../../../utils', () => ({
  getSelectedExtension: jest.fn((state) => {
    if (state.isPrevState) {
      // previous selection is not and extension
      return undefined;
    }
    return {
      node: { attrs: { localId: undefined } },
    };
  }),
  getSelectedDomElement: jest.fn(() => mockExtensionDomElement),
}));

const prevState: any = { isPrevState: true };
const domAtPos: any = () => {};
const state: any = {
  extensionProvider: {},
  element: mockExtensionDomElement,
};

describe('handleUpdate', () => {
  describe('when selection changes from no extension, to the extension previously selected', () => {
    afterEach(() => {
      updateEditButtonSpy.mockReset();
    });

    it('should call updateEditButton when showEditButton is false', () => {
      handleUpdate({
        view: {
          state: {
            ...state,
            showEditButton: false,
          },
          dispatch: () => {},
        } as any,
        prevState,
        domAtPos,
        extensionHandlers: {},
        applyChange: undefined,
      });
      expect(updateEditButtonSpy).toHaveBeenCalled();
    });

    it('should not call updateEditButton when showEditButton is true', () => {
      handleUpdate({
        view: {
          state: {
            ...state,
            showEditButton: true,
          },
          dispatch: () => {},
        } as any,
        prevState,
        domAtPos,
        extensionHandlers: {},
        applyChange: undefined,
      });
      expect(updateEditButtonSpy).not.toHaveBeenCalled();
    });
  });
});
