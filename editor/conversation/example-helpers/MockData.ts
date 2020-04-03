import { Comment, Conversation, User } from '../src/model';
import { uuid } from '../src/internal/uuid';

export const MOCK_USERS: User[] = [
  {
    id: 'ari:cloud:identity::user/3f000e23-3588-4e5d-aa4b-99mock_user',
    name: 'Oscar Wallhult',
    avatarUrl: 'https://api.adorable.io/avatars/80/oscarwallhult.png',
  },
  {
    id: 'ari:cloud:identity::user/3f000e23-3588-4e5d-aa4b-99mock_user3',
    name: 'Tong Li',
    avatarUrl: 'https://api.adorable.io/avatars/80/tongli.png',
  },
  {
    id: 'ari:cloud:identity::user/3f000e23-3588-4e5d-aa4b-99mock_user4',
    name: 'Dmitrii Sorin',
    avatarUrl: 'https://api.adorable.io/avatars/80/dmitriisorin.png',
  },
  {
    id: 'ari:cloud:identity::user/3f000e23-3588-4e5d-aa4b-99mock_user5',
    name: 'Awesome Person',
    avatarUrl: 'https://api.adorable.io/avatars/80/awesomeperson.png',
  },
  {
    id: 'ari:cloud:identity::user/3f000e23-3588-4e5d-aa4b-99mock_user10',
    name: 'Former User',
    avatarUrl: 'https://api.adorable.io/avatars/80/formeruser.png',
    type: 'Deactivated',
  },
  {
    id: '',
    name: 'Undefined',
  },
];

export const MESSAGES: string[] = [
  'Hello World',
  'Wzup?!',
  'Hej',
  'This looks good',
  'I approve',
  'This is a comment',
];

export const mockComment: Comment = {
  commentAri: 'abc:cloud:platform::comment/mock-comment-1',
  localId: 'mock-comment-1-local',
  commentId: 'mock-comment-1',
  conversationId: 'mock-conversation',
  createdBy: MOCK_USERS[0],
  createdAt: Date.now(),
  document: {
    adf: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello World',
            },
          ],
        },
      ],
    },
  },
};

export const mockComment2: Comment = {
  localId: 'mock-comment-2-local',
  commentId: 'mock-comment-2',
  conversationId: 'mock-conversation',
  createdBy: MOCK_USERS[0],
  createdAt: Date.now(),
  document: {
    adf: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello World',
            },
          ],
        },
      ],
    },
  },
};

export const mockInlineComment: Comment = {
  localId: 'mock-inline-comment-local',
  commentId: 'mock-inline-comment',
  conversationId: 'mock-inline-conversation',
  createdBy: MOCK_USERS[0],
  createdAt: Date.now(),
  document: {
    adf: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Maybe you should actually do something here?',
            },
          ],
        },
      ],
    },
  },
};

export const mockMediaComment: Comment = {
  localId: 'mock-media-comment-local',
  commentId: 'mock-media-comment',
  conversationId: 'mock-media-conversation',
  createdBy: MOCK_USERS[3],
  createdAt: Date.now(),
  document: {
    adf: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'External media',
            },
          ],
        },
        {
          type: 'mediaSingle',
          attrs: {
            layout: 'center',
          },
          content: [
            {
              type: 'media',
              attrs: {
                type: 'external',
                url:
                  'https://upload.wikimedia.org/wikipedia/en/a/aa/Bart_Simpson_200px.png',
              },
            },
          ],
        },
      ],
    },
  },
};

export const mockReplyComment: Comment = {
  commentId: 'mock-reply-comment-1',
  parentId: 'mock-comment-1',
  conversationId: 'mock-conversation',
  createdBy: MOCK_USERS[1],
  createdAt: Date.now(),
  document: {
    adf: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Reply!',
            },
          ],
        },
      ],
    },
  },
};

export const mockConversation: Conversation = {
  conversationId: 'mock-conversation',
  objectId: 'ari:cloud:platform::conversation/demo',
  comments: [mockComment, mockReplyComment],
  meta: {},
  localId: 'local-conversation',
};

export const mockInlineConversation: Conversation = {
  conversationId: 'mock-inline-conversation',
  objectId: 'ari:cloud:platform::conversation/demo',
  comments: [mockInlineComment],
  meta: { name: 'main.js', lineNumber: 3 },
};

export const mockMediaConversation: Conversation = {
  conversationId: 'mock-media-conversation',
  objectId: 'ari:cloud:platform::conversation/demo',
  comments: [mockMediaComment],
  meta: { name: 'main.js', lineNumber: 3 },
};

function generateComment(
  conversationId: string,
  parentId?: string,
  extraText: string = '',
): Comment {
  const commentId = <string>uuid.generate();
  return {
    commentAri: `abc:cloud:platform::comment/${commentId}`,
    localId: `${commentId}-local`,
    commentId: commentId,
    conversationId,
    parentId,
    createdBy:
      MOCK_USERS[Math.floor(Math.random() * 10) % (MOCK_USERS.length - 1)],
    createdAt: Date.now(),
    document: {
      adf: {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text:
                  MESSAGES[
                    // eslint-disable-next-line no-bitwise
                    Math.floor(Math.random() * MESSAGES.length) &
                      MESSAGES.length
                  ] + extraText,
              },
            ],
          },
        ],
      },
    },
  };
}

export const generateMockConversation = (): Conversation => {
  const conversationId = <string>uuid.generate();
  const comments = [
    generateComment(conversationId),
    generateComment(conversationId),
    generateComment(conversationId),
  ];
  const reply = generateComment(
    conversationId,
    comments[0].commentId,
    ' (reply)',
  );
  const replyOfReply = generateComment(
    conversationId,
    reply.commentId,
    ' (reply of reply)',
  );
  comments.push(reply, replyOfReply);
  return {
    meta: {},
    conversationId,
    objectId: 'ari:cloud:platform::conversation/demo',
    comments,
  };
};
