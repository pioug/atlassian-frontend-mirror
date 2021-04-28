import MobileEditorToolbarActions from '../../mobile-editor-toolbar';
import { toNativeBridge } from '../../web-to-native/index';
import { EditorViewWithComposition } from '../../../types';
import { FloatingToolbarConfig } from '@atlaskit/editor-core';
import { defaultSchema } from '@atlaskit/adf-schema';

jest.mock('../../web-to-native/index');
jest.mock('@atlaskit/editor-core');

describe('Notify editing capabilities to the native bridge', () => {
  let toolbarActions: MobileEditorToolbarActions;
  const floatingToolbarConfig: FloatingToolbarConfig = {
    title: 'floating',
    nodeType: defaultSchema.nodes['panel'],
    items: [
      {
        type: 'button',
        title: 'info',
        onClick: jest.fn(),
      },
      {
        type: 'dropdown',
        title: 'Table Options',
        options: [
          {
            title: 'option1',
            onClick: jest.fn(),
          },
        ],
      },
      {
        type: 'select',
        onChange: jest.fn(),
        options: [
          {
            label: 'Java',
            value: 'java',
          },
        ],
      },
    ],
  };

  const floatingToolbarConfigWithCallback: FloatingToolbarConfig = {
    title: 'blockCard',
    nodeType: defaultSchema.nodes['blockCard'],
    items: node => {
      if (!node) {
        return [];
      }
      return [
        {
          type: 'button',
          title: 'info',
          onClick: jest.fn(),
        },
        {
          type: 'dropdown',
          title: 'Table Options',
          options: [
            {
              title: 'option1',
              onClick: jest.fn(),
            },
          ],
        },
        {
          type: 'select',
          onChange: jest.fn(),
          options: [
            {
              label: 'Java',
              value: 'java',
            },
          ],
        },
      ];
    },
  };

  beforeEach(() => {
    toolbarActions = new MobileEditorToolbarActions();
  });

  afterEach(() => {
    jest.clearAllMocks();
    toolbarActions.setEditAllowList([]);
  });

  it('should relay editing capabilities to the native bridge in a mobile specific DSL', () => {
    const expectedMobileDsl = [
      {
        type: 'button',
        title: 'info',
        key: '0',
      },
      {
        type: 'dropdown',
        title: 'Table Options',
        options: [
          {
            title: 'option1',
            key: '1.0',
          },
        ],
        key: '1',
      },
      {
        type: 'select',
        options: [
          {
            label: 'Java',
            value: 'java',
            key: '2.0',
          },
        ],
        key: '2',
      },
    ];

    toolbarActions.setEditAllowList([]);

    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
      floatingToolbarConfig,
    );

    const expectedItems = JSON.stringify(expectedMobileDsl);
    expect(toNativeBridge.onNodeSelected).toBeCalledWith(
      'panel',
      expectedItems,
    );
  });

  it('should relay editing capabilities to the native bridge in a mobile specific DSL when config uses an items callback', () => {
    const expectedMobileDsl = [
      {
        type: 'button',
        title: 'info',
        key: '0',
      },
      {
        type: 'dropdown',
        title: 'Table Options',
        options: [
          {
            title: 'option1',
            key: '1.0',
          },
        ],
        key: '1',
      },
      {
        type: 'select',
        options: [
          {
            label: 'Java',
            value: 'java',
            key: '2.0',
          },
        ],
        key: '2',
      },
    ];
    const dummyNode: any = 'dummy node';

    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
      floatingToolbarConfigWithCallback,
      dummyNode,
    );

    const expectedItems = JSON.stringify(expectedMobileDsl);
    expect(toNativeBridge.onNodeSelected).toBeCalledWith(
      'blockCard',
      expectedItems,
    );
  });

  it('should notify native bridge that node is deselected when editing capabilities are not available', () => {
    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
      floatingToolbarConfig,
    );
    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(undefined);

    expect(toNativeBridge.onNodeDeselected).toBeCalled();
    expect(toNativeBridge.onNodeSelected).toBeCalledTimes(1);
  });

  it('should not notify native bridge if the node was already deselected before', () => {
    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
      floatingToolbarConfig,
    );
    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(undefined);
    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(undefined);
    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(undefined);

    expect(toNativeBridge.onNodeDeselected).toBeCalledTimes(1);
    expect(toNativeBridge.onNodeSelected).toBeCalledTimes(1);
  });

  it('should notify native bridge only once for multiple calls when there is no change in the items', () => {
    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
      floatingToolbarConfig,
    );
    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
      floatingToolbarConfig,
    );
    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
      floatingToolbarConfig,
    );

    expect(toNativeBridge.onNodeSelected).toBeCalledTimes(1);
    expect(toNativeBridge.onNodeDeselected).not.toBeCalled();
  });

  it('should notify native bridge when the toolbar items have different values for the same config', () => {
    const floatingToolbar1: FloatingToolbarConfig = {
      title: 'floating',
      nodeType: defaultSchema.nodes['paragraph'],
      items: [
        {
          type: 'button',
          title: 'info',
          selected: false,
          onClick: jest.fn(),
        },
      ],
    };
    const floatingToolbar2: FloatingToolbarConfig = {
      title: 'floating',
      nodeType: defaultSchema.nodes['paragraph'],
      items: [
        {
          type: 'button',
          title: 'info',
          selected: true,
          onClick: jest.fn(),
        },
      ],
    };
    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
      floatingToolbar1,
    );
    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
      floatingToolbar2,
    );

    expect(toNativeBridge.onNodeSelected).toBeCalledTimes(2);
    expect(toNativeBridge.onNodeDeselected).not.toBeCalled();
  });

  it('should notify native side with allowed items only without redundant separators', () => {
    const floatingToolbarConfig: FloatingToolbarConfig = {
      title: 'floating',
      nodeType: defaultSchema.nodes['panel'],
      items: [
        {
          id: 'button1',
          type: 'button',
          title: 'info',
          onClick: jest.fn(),
        },
        {
          type: 'separator',
        },
        {
          id: 'dropdown1',
          type: 'dropdown',
          title: 'Table Options',
          options: [
            {
              id: 'dropdown1.option1',
              title: 'option1',
              onClick: jest.fn(),
            },
          ],
        },
        {
          type: 'separator',
        },
        {
          id: 'dropdown2',
          type: 'dropdown',
          title: 'Cell Options',
          options: [
            {
              id: 'dropdown2.option1',
              title: 'option1',
              onClick: jest.fn(),
            },
            {
              id: 'dropdown2.option2',
              title: 'option2',
              onClick: jest.fn(),
            },
          ],
        },
        {
          type: 'separator',
        },
        {
          id: 'button2',
          type: 'button',
          title: 'info',
          onClick: jest.fn(),
        },
        {
          type: 'separator',
        },
        {
          id: 'select1',
          type: 'select',
          onChange: jest.fn(),
          options: [
            {
              label: 'Java',
              value: 'java',
            },
          ],
        },
      ],
    };
    const allowedList = ['button2', 'dropdown2', 'dropdown2.option2'];
    toolbarActions.setEditAllowList(allowedList);

    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
      floatingToolbarConfig,
    );

    const expectedMobileDsl = [
      {
        id: 'dropdown2',
        type: 'dropdown',
        title: 'Cell Options',
        options: [
          {
            id: 'dropdown2.option2',
            title: 'option2',
            key: '0.0',
            onClick: jest.fn(),
          },
        ],
        key: '0',
      },
      {
        type: 'separator',
      },
      {
        id: 'button2',
        type: 'button',
        title: 'info',
        key: '2',
      },
    ];
    const expectedItems = JSON.stringify(expectedMobileDsl);
    expect(toNativeBridge.onNodeSelected).toBeCalledWith(
      'panel',
      expectedItems,
    );
  });

  it('should filter out dropdown completely if none of the options is allowed', () => {
    const floatingToolbarConfig: FloatingToolbarConfig = {
      title: 'floating',
      nodeType: defaultSchema.nodes['panel'],
      items: [
        {
          id: 'dropdown1',
          type: 'dropdown',
          title: 'Table Options',
          options: [
            {
              id: 'dropdown1.option1',
              title: 'option1',
              onClick: jest.fn(),
            },
            {
              id: 'dropdown1.option2',
              title: 'option2',
              onClick: jest.fn(),
            },
          ],
        },
        {
          id: 'button2',
          type: 'button',
          title: 'info',
          onClick: jest.fn(),
        },
      ],
    };
    const allowedList = ['button2', 'dropdown1'];
    toolbarActions.setEditAllowList(allowedList);

    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
      floatingToolbarConfig,
    );

    const expectedMobileDsl = [
      {
        id: 'button2',
        type: 'button',
        title: 'info',
        key: '0',
      },
    ];
    const expectedItems = JSON.stringify(expectedMobileDsl);
    expect(toNativeBridge.onNodeSelected).toBeCalledWith(
      'panel',
      expectedItems,
    );
  });
});

describe('perform edit action', () => {
  let toolbarActions: MobileEditorToolbarActions;

  beforeEach(() => {
    toolbarActions = new MobileEditorToolbarActions();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should perform click action for buttons', () => {
    const mockOnClick = jest.fn();
    const floatingToolbar: FloatingToolbarConfig = {
      title: 'floating',
      nodeType: defaultSchema.nodes['panel'],
      items: [
        {
          type: 'button',
          title: 'info',
          selected: true,
          onClick: mockOnClick,
        },
      ],
    };
    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
      floatingToolbar,
    );
    const editorView = {} as EditorViewWithComposition;

    toolbarActions.performEditAction('0', editorView);

    expect(mockOnClick).toBeCalled();
  });

  it('should perform click action for dropdown options', () => {
    const mockOnClick = jest.fn();
    const floatingToolbarConfig: FloatingToolbarConfig = {
      title: 'floating',
      nodeType: defaultSchema.nodes['panel'],
      items: [
        {
          type: 'dropdown',
          title: 'Table Options',
          options: [
            {
              title: 'option1',
              onClick: jest.fn(),
            },
            {
              title: 'option2',
              onClick: mockOnClick,
            },
          ],
        },
      ],
    };
    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
      floatingToolbarConfig,
    );
    const editorView = {} as EditorViewWithComposition;

    toolbarActions.performEditAction('0.1', editorView);

    expect(mockOnClick).toBeCalled();
  });

  it('should perform change action for select options', () => {
    const mockOnChange = jest.fn();
    const floatingToolbarConfig: FloatingToolbarConfig = {
      title: 'floating',
      nodeType: defaultSchema.nodes['panel'],
      items: [
        {
          type: 'select',
          onChange: selected => {
            return mockOnChange;
          },
          options: [
            {
              label: 'Java',
              value: 'java',
            },
          ],
        },
      ],
    };

    toolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
      floatingToolbarConfig,
    );
    const editorView = {} as EditorViewWithComposition;

    toolbarActions.performEditAction('0.0', editorView);

    expect(mockOnChange).toBeCalled();
  });
});
