import type { DocNode } from '@atlaskit/adf-schema';

export const captionLong: DocNode = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'mediaSingle',
      attrs: {
        width: 33.33333333333333,
        layout: 'center',
      },
      content: [
        {
          type: 'media',
          attrs: {
            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAyCAYAAADLLVz8AAAAWklEQVR42u3QMQEAAAQAMJIL5BVQB68twjKmKzhLgQIFChSIQIECBSJQoECBCBQoUCACBQoUiECBAgUiUKBAgQgUKFAgAgUKFIhAgQIFIlCgQIECBQoUKPCrBUAeXY/1wpUbAAAAAElFTkSuQmCC',
            type: 'external',
          },
        },
        {
          type: 'caption',
          content: [
            {
              type: 'text',
              text: 'this is a long caption - Blandit vivamus pulvinar luctus accumsan a ultrices lorem augue, scelerisque tempor sollicitudin auctor ac magnis lacinia, sodales mattis conubia sapien facilisi nascetur fusce. Sem montes semper maecenas id luctus elementum auctor inceptos arcu, cursus ante nam vivamus cras neque adipiscing imperdiet viverra, euismod ligula hac fames tortor leo rhoncus in. Dictumst aptent aenean ultrices erat primis tristique sollicitudin felis, malesuada hendrerit vulputate orci imperdiet mus libero dolor, consectetur dapibus maecenas sagittis ad lorem cras.',
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};
