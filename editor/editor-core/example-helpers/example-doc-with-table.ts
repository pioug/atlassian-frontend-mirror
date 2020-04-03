export const exampleDocument = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'table',
      attrs: { isNumberColumnEnabled: false, layout: 'wide' },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Date' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Responsible' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Content' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Actions' }],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'date', attrs: { timestamp: '1535500800000' } },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: { id: '0', text: '@Carolyn', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: {
                        id: '2',
                        text: '@Verdie Carrales',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: { id: '4', text: '@Summer', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'const truthy = true',
                      marks: [{ type: 'code' }],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'taskList',
                  attrs: { localId: '622885bb-33c0-4172-9e6f-dc6df142047a' },
                  content: [
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: '33ccc7ca-fb9b-4e94-97fc-1cea1377d087',
                        state: 'TODO',
                      },
                      content: [{ type: 'text', text: 'Review code' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'date', attrs: { timestamp: '1534723200000' } },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: { id: '8', text: '@Ty Bopp', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: {
                        id: '3',
                        text: '@Shae Accetta',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: {
                        id: '15',
                        text: '@Arlena Marse',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: {
                        id: '1',
                        text: '@Kaitlyn Prouty',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'codeBlock',
                  attrs: {},
                  content: [{ type: 'text', text: 'Code blocks!' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'decisionList',
                  attrs: { localId: '77df703e-b817-4103-bf16-a538947d0d57' },
                  content: [
                    {
                      type: 'decisionItem',
                      attrs: {
                        localId: 'e5c56499-2071-4a41-9c78-19489fe03803',
                        state: 'DECIDED',
                      },
                      content: [
                        { type: 'text', text: 'Code blocks are the go.' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'date', attrs: { timestamp: '1536364800000' } },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '11',
                        text: '@Elaine Mattia',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'emoji',
                      attrs: { shortName: ':potato:', id: '1f954', text: '🥔' },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'taskList',
                  attrs: { localId: '6223998a-d0b3-4fc1-b140-9f4529103ad6' },
                  content: [
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: '49138f4c-4e6a-4d7c-bc93-b6df6abe513d',
                        state: 'TODO',
                      },
                      content: [{ type: 'text', text: 'Confirm Potato' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'date', attrs: { timestamp: '1537315200000' } },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '1',
                        text: '@Kaitlyn Prouty',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: { id: '19', text: '@Jasmine', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: {
                        id: '17',
                        text: '@Tam Critelli',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: { id: '16', text: '@Ariel', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: {
                        id: '15',
                        text: '@Arlena Marse',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'const fn = () => {}',
                      marks: [{ type: 'code' }],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'taskList',
                  attrs: { localId: '5a7f34de-708e-41ab-ae4c-69e46074b403' },
                  content: [
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: '4a740f3b-f6ec-4047-9654-b221060b257d',
                        state: 'TODO',
                      },
                      content: [{ type: 'text', text: 'Swarm the code' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'date', attrs: { timestamp: '1536105600000' } },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '1',
                        text: '@Kaitlyn Prouty',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: {
                        id: '3',
                        text: '@Shae Accetta',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'codeBlock',
                  attrs: {},
                  content: [
                    {
                      type: 'text',
                      text: 'review\n|> the\n|> pipeline\n|> operator',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'taskList',
                  attrs: { localId: 'c7c16711-3054-4687-81d5-cf9ef4cfa881' },
                  content: [
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: 'e0cebeb6-f1ca-495e-9a6e-33cb5c949b98',
                        state: 'TODO',
                      },
                      content: [
                        { type: 'text', text: 'Review pipeline operator' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'date', attrs: { timestamp: '1535500800000' } },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '2',
                        text: '@Verdie Carrales',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: { id: '4', text: '@Summer', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: {
                        id: '5',
                        text: '@Lorri Tremble',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text:
                        'for (let i = 0; i < 3; i++) { /* something here */ }',
                      marks: [{ type: 'code' }],
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'taskList',
                  attrs: { localId: '60998f58-bf1b-4384-87e0-da8b0fbf352d' },
                  content: [
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: 'b42caac1-24b8-4fd9-9c7c-f9109307f4e6',
                        state: 'TODO',
                      },
                      content: [
                        { type: 'text', text: 'Confirm for loop works' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'date', attrs: { timestamp: '1535587200000' } },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '2',
                        text: '@Verdie Carrales',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'emoji',
                      attrs: {
                        shortName: ':french_bread:',
                        id: '1f956',
                        text: '🥖',
                      },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'taskList',
                  attrs: { localId: '12dcecd0-2cea-450a-800f-8ab80ace1c3d' },
                  content: [
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: '250e214c-b42f-4d0e-8d17-84e8c4d83a5f',
                        state: 'TODO',
                      },
                      content: [{ type: 'text', text: 'Eat french bread?' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'date', attrs: { timestamp: '1536537600000' } },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '3',
                        text: '@Shae Accetta',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: {
                        id: '7',
                        text: '@Erwin Petrovich',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'panel',
                  attrs: { panelType: 'warning' },
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Warning!' }],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'taskList',
                  attrs: { localId: '94e4965a-65fd-48c9-a663-1f5ddb103955' },
                  content: [
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: '27c492e4-6974-497a-b10d-94c16ac849dc',
                        state: 'TODO',
                      },
                      content: [{ type: 'text', text: 'Confirm panel colour' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'date', attrs: { timestamp: '1535846400000' } },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '3',
                        text: '@Shae Accetta',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: { id: '4', text: '@Summer', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: { id: '6', text: '@April', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: {
                        id: '2',
                        text: '@Verdie Carrales',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'codeBlock',
                  attrs: {},
                  content: [
                    {
                      type: 'text',
                      text: 'when pattern do {\n  matches -> null\n}',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'decisionList',
                  attrs: { localId: '043c140a-dd40-41aa-a2ef-8d3f1e114d3e' },
                  content: [
                    {
                      type: 'decisionItem',
                      attrs: {
                        localId: 'b6ab2b38-f5a8-4767-9e5e-8698bd571c24',
                        state: 'DECIDED',
                      },
                      content: [
                        { type: 'text', text: 'Pattern matching is good.' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'date', attrs: { timestamp: '1536451200000' } },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: { id: '8', text: '@Ty Bopp', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: { id: '10', text: '@Boris', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: {
                        id: '1',
                        text: '@Kaitlyn Prouty',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: { id: '0', text: '@Carolyn', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'emoji',
                      attrs: { shortName: ':apple:', id: '1f34e', text: '🍎' },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'decisionList',
                  attrs: { localId: '1786b7d2-93cc-4e85-9357-246e04401c7a' },
                  content: [
                    {
                      type: 'decisionItem',
                      attrs: {
                        localId: '146f32ad-2a16-44b2-82b9-a833e2e95776',
                        state: 'DECIDED',
                      },
                      content: [
                        { type: 'text', text: 'Eat two servings of fruit!' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'date', attrs: { timestamp: '1536624000000' } },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '9',
                        text: '@Helga Wetherbee',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: {
                        id: '17',
                        text: '@Tam Critelli',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: { id: '14', text: '@Tien Alvin', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'false || false',
                      marks: [{ type: 'code' }],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'taskList',
                  attrs: { localId: 'dfdcf786-1895-4c81-8ff5-70ef94985849' },
                  content: [
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: '442ca78b-e44a-452f-8800-83a421a573db',
                        state: 'TODO',
                      },
                      content: [{ type: 'text', text: 'Optional operator' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'date', attrs: { timestamp: '1535760000000' } },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '1',
                        text: '@Kaitlyn Prouty',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: {
                        id: '3',
                        text: '@Shae Accetta',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'blockquote',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        { type: 'text', text: 'Blockquotes are pretty wise' },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'taskList',
                  attrs: { localId: '57cd283f-3b71-4bef-a24c-f85c03d45603' },
                  content: [
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: '12f6eac9-7775-460f-b99c-2d88a7b3d1b4',
                        state: 'TODO',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'date', attrs: { timestamp: '1538265600000' } },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: { id: '4', text: '@Summer', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'inlineExtension',
                      attrs: {
                        extensionType: 'com.atlassian.confluence.macro.core',
                        extensionKey: 'inline-eh',
                        parameters: {
                          macroParams: {},
                          macroMetadata: {
                            macroId: { value: 1535514266229 },
                            placeholder: [{ data: { url: '' }, type: 'icon' }],
                          },
                        },
                      },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'taskList',
                  attrs: { localId: '3439edac-bb3b-4c0c-bb3c-4562b55fd74b' },
                  content: [
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: 'a6395a36-c4e5-4f93-8030-2b3ca166ad27',
                        state: 'TODO',
                      },
                      content: [
                        { type: 'text', text: 'Do inline extensions work?' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'date', attrs: { timestamp: '1534550400000' } },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: { id: '18', text: '@awoods', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: { id: '16', text: '@Ariel', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: {
                        id: '17',
                        text: '@Tam Critelli',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: { id: '0', text: '@Carolyn', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: { id: '4', text: '@Summer', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'emoji',
                      attrs: { shortName: ':clown:', id: '1f921', text: '🤡' },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'decisionList',
                  attrs: { localId: '8fc30803-45db-4735-97b2-a20a4a99060d' },
                  content: [
                    {
                      type: 'decisionItem',
                      attrs: {
                        localId: '24a7a811-3340-4850-bf97-3aa85d64269b',
                        state: 'DECIDED',
                      },
                      content: [{ type: 'text', text: 'Clowns are scary' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'date', attrs: { timestamp: '1535500800000' } },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '2',
                        text: '@Verdie Carrales',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: {
                        id: '5',
                        text: '@Lorri Tremble',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: { id: '6', text: '@April', accessLevel: '' },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: {
                        id: '9',
                        text: '@Helga Wetherbee',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Above the line' }],
                },
                { type: 'rule' },
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Below the line' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'taskList',
                  attrs: { localId: '5cf32813-4290-410e-8e1c-f2b01e35b15a' },
                  content: [
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: '160d3252-f86c-43c0-b53e-e5cb2c6f1d07',
                        state: 'TODO',
                      },
                      content: [
                        { type: 'text', text: 'Where do you sit on the line?' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'table',
      attrs: { isNumberColumnEnabled: false, layout: 'default' },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              attrs: { colwidth: [128] },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Time' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: { colwidth: [128] },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Item' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: { colwidth: [128] },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Who' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Notes' }],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: { colwidth: [128] },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '30 minutes' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: { colwidth: [128] },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Walkthrough current issues' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: { colwidth: [128] },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '557057:1634c35c-3f45-4489-bf37-b7717de957ab',
                        text: '@Drew Walker',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'bulletList',
                  content: [
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'placeholder',
                              attrs: { text: 'Notes for this agenda item' },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
