/** Extracted into its own file so the mock variables can be instantiated before other imports in the test file that would otherwise be hoisted before it */
export const removeOnCloseListener = jest.fn();
export const spies = {} as any;

const mockMediaPickerFacade = jest.fn((pickerType) => {
  const picker: any = {
    on: jest.fn(),
    onClose: jest.fn().mockReturnValue(removeOnCloseListener),
    onNewMedia: jest.fn(),
    onMediaEvent: jest.fn(),
    onDrag: jest.fn(),
    hide: jest.fn(),
    setUploadParams: jest.fn(),
    show: jest.fn(),
    deactivate: jest.fn(),
    activate: jest.fn(),
    destroy: jest.fn(),
    type: 'popup',
  };
  picker.init = jest.fn().mockReturnValue(picker);
  spies[pickerType] = picker;
  return picker;
});

jest.mock(
  '../../../../plugins/media/picker-facade',
  () => mockMediaPickerFacade,
);
