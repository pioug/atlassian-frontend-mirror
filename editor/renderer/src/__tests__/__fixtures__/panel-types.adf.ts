import type { DocNode } from '@atlaskit/adf-schema';
import { PanelType } from '@atlaskit/adf-schema';

export const infoPanel: DocNode = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'panel',
      attrs: {
        panelType: PanelType.INFO,
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Info panel',
            },
          ],
        },
      ],
    },
  ],
};

export const notePanel: DocNode = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'panel',
      attrs: {
        panelType: PanelType.NOTE,
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Note panel',
            },
          ],
        },
      ],
    },
  ],
};

export const errorPanel: DocNode = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'panel',
      attrs: {
        panelType: PanelType.ERROR,
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Error panel',
            },
          ],
        },
      ],
    },
  ],
};

export const successPanel: DocNode = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'panel',
      attrs: {
        panelType: PanelType.SUCCESS,
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Success panel',
            },
          ],
        },
      ],
    },
  ],
};

export const warningPanel: DocNode = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'panel',
      attrs: {
        panelType: PanelType.WARNING,
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Warning panel',
            },
          ],
        },
      ],
    },
  ],
};

export const successPanelWithColoredText: DocNode = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'panel',
      attrs: {
        panelType: PanelType.SUCCESS,
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'r',
            },
            {
              type: 'text',
              text: 'a',
              marks: [
                {
                  type: 'textColor',
                  attrs: {
                    color: '#4c9aff',
                  },
                },
              ] as const,
            },
            {
              type: 'text',
              text: 'i',
              marks: [
                {
                  type: 'textColor',
                  attrs: {
                    color: '#00b8d9',
                  },
                },
              ] as const,
            },
            {
              type: 'text',
              text: 'n',
              marks: [
                {
                  type: 'textColor',
                  attrs: {
                    color: '#36b37e',
                  },
                },
              ] as const,
            },
            {
              type: 'text',
              text: 'b',
              marks: [
                {
                  type: 'textColor',
                  attrs: {
                    color: '#ffc400',
                  },
                },
              ] as const,
            },
            {
              type: 'text',
              text: 'o',
              marks: [
                {
                  type: 'textColor',
                  attrs: {
                    color: '#ff5630',
                  },
                },
              ] as const,
            },
            {
              type: 'text',
              text: 'w',
              marks: [
                {
                  type: 'textColor',
                  attrs: {
                    color: '#6554c0',
                  },
                },
              ] as const,
            },
          ],
        },
      ],
    },
  ],
};

export const customPanelMissingDefaults: DocNode = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'panel',
      attrs: {
        panelType: PanelType.CUSTOM,
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Custom panel - missing defaults',
            },
          ],
        },
      ],
    },
  ],
};

export const customPanelOnlyBackground: DocNode = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'panel',
      attrs: {
        panelType: PanelType.CUSTOM,
        panelColor: '#57D9A3',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Custom panel - only background',
            },
          ],
        },
      ],
    },
  ],
};

export const customPanelOnlyEmoji: DocNode = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'panel',
      attrs: {
        panelType: PanelType.CUSTOM,
        panelIcon: ':poop:',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Custom panel - only emoji',
            },
          ],
        },
      ],
    },
  ],
};

export const customPanelEmojiAndColoredBackground: DocNode = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'panel',
      attrs: {
        panelType: PanelType.CUSTOM,
        panelIcon: ':heart:',
        panelColor: '#FFBDAD',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello custom panel!',
            },
          ],
        },
      ],
    },
  ],
};

export const customPanelEmojiAndColoredBackgroundAndColoredText: DocNode = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'panel',
      attrs: {
        panelType: PanelType.CUSTOM,
        panelColor: '#B3F5FF',
        panelIcon: ':rainbow:',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'r',
            },
            {
              type: 'text',
              text: 'a',
              marks: [
                {
                  type: 'textColor',
                  attrs: {
                    color: '#4c9aff',
                  },
                },
              ] as const,
            },
            {
              type: 'text',
              text: 'i',
              marks: [
                {
                  type: 'textColor',
                  attrs: {
                    color: '#00b8d9',
                  },
                },
              ] as const,
            },
            {
              type: 'text',
              text: 'n',
              marks: [
                {
                  type: 'textColor',
                  attrs: {
                    color: '#36b37e',
                  },
                },
              ] as const,
            },
            {
              type: 'text',
              text: 'b',
              marks: [
                {
                  type: 'textColor',
                  attrs: {
                    color: '#ffc400',
                  },
                },
              ] as const,
            },
            {
              type: 'text',
              text: 'o',
              marks: [
                {
                  type: 'textColor',
                  attrs: {
                    color: '#ff5630',
                  },
                },
              ] as const,
            },
            {
              type: 'text',
              text: 'w',
              marks: [
                {
                  type: 'textColor',
                  attrs: {
                    color: '#6554c0',
                  },
                },
              ] as const,
            },
          ],
        },
      ],
    },
  ],
};
