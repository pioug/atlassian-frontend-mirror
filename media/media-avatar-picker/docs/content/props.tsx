import React from 'react';
import { md, PropsTable } from '@atlaskit/docs';

export const avatarPickerProps = {
  kind: 'program',
  component: {
    kind: 'generic',
    value: {
      kind: 'intersection',
      types: [
        {
          kind: 'generic',
          value: {
            kind: 'object',
            members: [
              {
                kind: 'property',
                optional: false,
                key: {
                  kind: 'id',
                  name: 'onAvatarPicked',
                },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'function',
                    returnType: {
                      kind: 'void',
                    },
                    parameters: [
                      {
                        kind: 'param',
                        value: {
                          kind: 'id',
                          name: 'avatar',
                        },
                        type: null,
                      },
                      {
                        kind: 'param',
                        value: {
                          kind: 'id',
                          name: 'altText?',
                        },
                        type: null,
                      },
                    ],
                  },
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This property is raised when the user clicks the **Save** button and there is a pre-defined avatar selected, and no image selected. An **Avatar** object with a **dataURI** property is passed. If the `requireAltText` prop is set to `true`, an **altText** string will be passed as a second argument.',
                    raw: '* This property is raised when the user clicks the **Save** button and there is a pre-defined avatar selected, and no image selected. An **Avatar** object with a **dataURI** property is passed. If the `requireAltText` prop is set to `true`, an **altText** string will be passed as a second argument.',
                  },
                ],
                trailingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This optional property should only be specified if the `requireAltText` prop is set to `true`. It is used to set the alt text of the selected image so that the component opens up with it visible already.',
                    raw: '* This optional property should only be specified if the `requireAltText` prop is set to `true`. It is used to set the alt text of the selected image so that the component opens up with it visible already. ',
                  },
                ],
              },
              {
                kind: 'property',
                optional: true,
                key: {
                  kind: 'id',
                  name: 'imageSourceAltText',
                },
                value: {
                  kind: 'string',
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This optional property should only be specified if the `requireAltText` prop is set to `true`. It is used to set the alt text of the selected image so that the component opens up with it visible already.',
                    raw: '* This optional property should only be specified if the `requireAltText` prop is set to `true`. It is used to set the alt text of the selected image so that the component opens up with it visible already. ',
                  },
                ],
                trailingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' This property is raised when the user clicks the **Save** button and there is a selected image.\nTwo arguments are always passed, the **file:File** which is a blob, and the crop settings which is an object containing **x:number**,**y:number**, and **size:number** values, which are all relative to the coordinates of the selected image. If the `requireAltText` prop is set to `true`, an **altText** string will be passed as a third argument. **Note** due to limitations on Safari <= 10.0 and IE11, a **Blob** object will be returned instead of a **File**.\nThis still allows access to the image byte data to facilitate uploads, essentially minus the filename and date attributes.',
                    raw: '* This property is raised when the user clicks the **Save** button and there is a selected image.\n   * Two arguments are always passed, the **file:File** which is a blob, and the crop settings which is an object containing **x:number**,**y:number**, and **size:number** values, which are all relative to the coordinates of the selected image. If the `requireAltText` prop is set to `true`, an **altText** string will be passed as a third argument. **Note** due to limitations on Safari <= 10.0 and IE11, a **Blob** object will be returned instead of a **File**.\n   * This still allows access to the image byte data to facilitate uploads, essentially minus the filename and date attributes.\n   ',
                  },
                ],
              },
              {
                kind: 'property',
                optional: true,
                key: {
                  kind: 'id',
                  name: 'onImagePicked',
                },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'function',
                    returnType: {
                      kind: 'void',
                    },
                    parameters: [
                      {
                        kind: 'param',
                        value: {
                          kind: 'id',
                          name: 'file',
                        },
                        type: null,
                      },
                      {
                        kind: 'param',
                        value: {
                          kind: 'id',
                          name: 'crop',
                        },
                        type: null,
                      },
                      {
                        kind: 'param',
                        value: {
                          kind: 'id',
                          name: 'altText?',
                        },
                        type: null,
                      },
                    ],
                  },
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' This property is raised when the user clicks the **Save** button and there is a selected image.\nTwo arguments are always passed, the **file:File** which is a blob, and the crop settings which is an object containing **x:number**,**y:number**, and **size:number** values, which are all relative to the coordinates of the selected image. If the `requireAltText` prop is set to `true`, an **altText** string will be passed as a third argument. **Note** due to limitations on Safari <= 10.0 and IE11, a **Blob** object will be returned instead of a **File**.\nThis still allows access to the image byte data to facilitate uploads, essentially minus the filename and date attributes.',
                    raw: '* This property is raised when the user clicks the **Save** button and there is a selected image.\n   * Two arguments are always passed, the **file:File** which is a blob, and the crop settings which is an object containing **x:number**,**y:number**, and **size:number** values, which are all relative to the coordinates of the selected image. If the `requireAltText` prop is set to `true`, an **altText** string will be passed as a third argument. **Note** due to limitations on Safari <= 10.0 and IE11, a **Blob** object will be returned instead of a **File**.\n   * This still allows access to the image byte data to facilitate uploads, essentially minus the filename and date attributes.\n   ',
                  },
                ],
                trailingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This property is raised when the user clicks the **Save** button and there is a selected image. The selected image is provided as a dataURI string. If the `requireAltText` prop is set to `true`, then an altText string will be passed as a second argument.',
                    raw: '* This property is raised when the user clicks the **Save** button and there is a selected image. The selected image is provided as a dataURI string. If the `requireAltText` prop is set to `true`, then an altText string will be passed as a second argument.  ',
                  },
                ],
              },
              {
                kind: 'property',
                optional: true,
                key: {
                  kind: 'id',
                  name: 'onImagePickedDataURI',
                },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'function',
                    returnType: {
                      kind: 'void',
                    },
                    parameters: [
                      {
                        kind: 'param',
                        value: {
                          kind: 'id',
                          name: 'dataUri',
                        },
                        type: null,
                      },
                      {
                        kind: 'param',
                        value: {
                          kind: 'id',
                          name: 'altText?',
                        },
                        type: null,
                      },
                    ],
                  },
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This property is raised when the user clicks the **Save** button and there is a selected image. The selected image is provided as a dataURI string. If the `requireAltText` prop is set to `true`, then an altText string will be passed as a second argument.',
                    raw: '* This property is raised when the user clicks the **Save** button and there is a selected image. The selected image is provided as a dataURI string. If the `requireAltText` prop is set to `true`, then an altText string will be passed as a second argument.  ',
                  },
                ],
                trailingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This optional property allows the consumer to specify whether or not the user should be required to enter alt text.',
                    raw: '* This optional property allows the consumer to specify whether or not the user should be required to enter alt text. ',
                  },
                ],
              },
              {
                kind: 'property',
                optional: true,
                key: {
                  kind: 'id',
                  name: 'requireAltText',
                },
                value: {
                  kind: 'boolean',
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This optional property allows the consumer to specify whether or not the user should be required to enter alt text.',
                    raw: '* This optional property allows the consumer to specify whether or not the user should be required to enter alt text. ',
                  },
                ],
              },
              {
                kind: 'property',
                optional: false,
                key: {
                  kind: 'id',
                  name: 'avatars',
                },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'id',
                    name: 'Array',
                  },
                  key: {
                    kind: 'any',
                  },
                  typeParams: {
                    kind: 'typeParams',
                    params: [
                      {
                        kind: 'generic',
                        value: {
                          kind: 'object',
                          members: [
                            {
                              kind: 'property',
                              optional: false,
                              key: {
                                kind: 'id',
                                name: 'dataURI',
                              },
                              value: {
                                kind: 'string',
                              },
                            },
                            {
                              kind: 'property',
                              optional: true,
                              key: {
                                kind: 'id',
                                name: 'name',
                              },
                              value: {
                                kind: 'string',
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This property is used to provide an array of pre-defined avatars. The **Avatar** object is a simple type with a single **dataURI: string** property. For convenience, this type is exported from the **@atlassian/media-avatar-picker** module along with the **AvatarPickerDialog** component.',
                    raw: '* This property is used to provide an array of pre-defined avatars. The **Avatar** object is a simple type with a single **dataURI: string** property. For convenience, this type is exported from the **@atlassian/media-avatar-picker** module along with the **AvatarPickerDialog** component. ',
                  },
                ],
                trailingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This property is used along with the **avatar** property. It allows you to set the currently selected pre-defined avatar. By default, there is no pre-defined avatar selected, even if the **avatars** property is set.',
                    raw: '* This property is used along with the **avatar** property. It allows you to set the currently selected pre-defined avatar. By default, there is no pre-defined avatar selected, even if the **avatars** property is set. ',
                  },
                ],
                default: {
                  kind: 'array',
                  elements: [],
                },
              },
              {
                kind: 'property',
                optional: true,
                key: {
                  kind: 'id',
                  name: 'defaultSelectedAvatar',
                },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'object',
                    members: [
                      {
                        kind: 'property',
                        optional: false,
                        key: {
                          kind: 'id',
                          name: 'dataURI',
                        },
                        value: {
                          kind: 'string',
                        },
                      },
                      {
                        kind: 'property',
                        optional: true,
                        key: {
                          kind: 'id',
                          name: 'name',
                        },
                        value: {
                          kind: 'string',
                        },
                      },
                    ],
                  },
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This property is used along with the **avatar** property. It allows you to set the currently selected pre-defined avatar. By default, there is no pre-defined avatar selected, even if the **avatars** property is set.',
                    raw: '* This property is used along with the **avatar** property. It allows you to set the currently selected pre-defined avatar. By default, there is no pre-defined avatar selected, even if the **avatars** property is set. ',
                  },
                ],
                trailingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This optional property is used to set the selected image so that the component opens up with it visible already. The value should be a valid dataURI string. If an invalid dataURI is given, the bad format error state will be triggered and a message shown.',
                    raw: '* This optional property is used to set the selected image so that the component opens up with it visible already. The value should be a valid dataURI string. If an invalid dataURI is given, the bad format error state will be triggered and a message shown. ',
                  },
                ],
              },
              {
                kind: 'property',
                optional: true,
                key: {
                  kind: 'id',
                  name: 'imageSource',
                },
                value: {
                  kind: 'string',
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This optional property is used to set the selected image so that the component opens up with it visible already. The value should be a valid dataURI string. If an invalid dataURI is given, the bad format error state will be triggered and a message shown.',
                    raw: '* This optional property is used to set the selected image so that the component opens up with it visible already. The value should be a valid dataURI string. If an invalid dataURI is given, the bad format error state will be triggered and a message shown. ',
                  },
                ],
                trailingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' This property is raised when the user clicks **Cancel** button.\n **Note** this does not close the dialog.\nIt is up to the consumer to re-render and remove the dialog from the UI.',
                    raw: '* This property is raised when the user clicks **Cancel** button.\n   *  **Note** this does not close the dialog.\n   * It is up to the consumer to re-render and remove the dialog from the UI.\n   ',
                  },
                ],
              },
              {
                kind: 'property',
                optional: false,
                key: {
                  kind: 'id',
                  name: 'onCancel',
                },
                value: {
                  kind: 'generic',
                  value: {
                    kind: 'function',
                    returnType: {
                      kind: 'void',
                    },
                    parameters: [],
                  },
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      ' This property is raised when the user clicks **Cancel** button.\n **Note** this does not close the dialog.\nIt is up to the consumer to re-render and remove the dialog from the UI.',
                    raw: '* This property is raised when the user clicks **Cancel** button.\n   *  **Note** this does not close the dialog.\n   * It is up to the consumer to re-render and remove the dialog from the UI.\n   ',
                  },
                ],
                trailingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'The title text for the dialog. The default is _Upload an avatar_.',
                    raw: '* The title text for the dialog. The default is _Upload an avatar_. ',
                  },
                ],
              },
              {
                kind: 'property',
                optional: true,
                key: {
                  kind: 'id',
                  name: 'title',
                },
                value: {
                  kind: 'string',
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'The title text for the dialog. The default is _Upload an avatar_.',
                    raw: '* The title text for the dialog. The default is _Upload an avatar_. ',
                  },
                ],
                trailingComments: [
                  {
                    type: 'commentBlock',
                    value: 'The primary button text. The default is _Save_.',
                    raw: '* The primary button text. The default is _Save_. ',
                  },
                ],
              },
              {
                kind: 'property',
                optional: true,
                key: {
                  kind: 'id',
                  name: 'primaryButtonText',
                },
                value: {
                  kind: 'string',
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value: 'The primary button text. The default is _Save_.',
                    raw: '* The primary button text. The default is _Save_. ',
                  },
                ],
                trailingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This optional property allows the consumer to display an error message. This may occur from a call to a service. The string is clipped if greater than 125 charaters (approximately 3 lines within the dialog).',
                    raw: '* This optional property allows the consumer to display an error message. This may occur from a call to a service. The string is clipped if greater than 125 charaters (approximately 3 lines within the dialog). ',
                  },
                ],
              },
              {
                kind: 'property',
                optional: true,
                key: {
                  kind: 'id',
                  name: 'errorMessage',
                },
                value: {
                  kind: 'string',
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This optional property allows the consumer to display an error message. This may occur from a call to a service. The string is clipped if greater than 125 charaters (approximately 3 lines within the dialog).',
                    raw: '* This optional property allows the consumer to display an error message. This may occur from a call to a service. The string is clipped if greater than 125 charaters (approximately 3 lines within the dialog). ',
                  },
                ],
                trailingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This optional property is used while the avatar is loaded.',
                    raw: '* This optional property is used while the avatar is loaded. ',
                  },
                ],
              },
              {
                kind: 'property',
                optional: true,
                key: {
                  kind: 'id',
                  name: 'isLoading',
                },
                value: {
                  kind: 'boolean',
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This optional property is used while the avatar is loaded.',
                    raw: '* This optional property is used while the avatar is loaded. ',
                  },
                ],
                trailingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This property decribe the text related to the Avatar.',
                    raw: '* This property decribe the text related to the Avatar. ',
                  },
                ],
              },
              {
                kind: 'property',
                optional: true,
                key: {
                  kind: 'id',
                  name: 'predefinedAvatarsText',
                },
                value: {
                  kind: 'string',
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This property decribe the text related to the Avatar.',
                    raw: '* This property decribe the text related to the Avatar. ',
                  },
                ],
                trailingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'The target width/height of the resulting (square) avatar. Leave blank for default (200x200)',
                    raw: '* The target width/height of the resulting (square) avatar. Leave blank for default (200x200) ',
                  },
                ],
              },
              {
                kind: 'property',
                optional: true,
                key: {
                  kind: 'id',
                  name: 'outputSize',
                },
                value: {
                  kind: 'number',
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'The target width/height of the resulting (square) avatar. Leave blank for default (200x200)',
                    raw: '* The target width/height of the resulting (square) avatar. Leave blank for default (200x200) ',
                  },
                ],
                trailingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This optional property allows the consumer to define the maximum image size that can be uploaded.',
                    raw: '* This optional property allows the consumer to define the maximum image size that can be uploaded. ',
                  },
                ],
              },
              {
                kind: 'property',
                optional: true,
                key: {
                  kind: 'id',
                  name: 'maxImageSize',
                },
                value: {
                  kind: 'number',
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This optional property allows the consumer to define the maximum image size that can be uploaded.',
                    raw: '* This optional property allows the consumer to define the maximum image size that can be uploaded. ',
                  },
                ],
                trailingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This optional property allows the consumer to define a custom label for select default avatar The default is _Select a default avatar_. ',
                    raw: '* This optional property allows the consumer to define a custom label for select default avatar. The default is _Select a default avatar_. ',
                  },
                ],
              },
              {
                kind: 'property',
                optional: true,
                key: {
                  kind: 'id',
                  name: 'selectAvatarLabel',
                },
                value: {
                  kind: 'string',
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This optional property allows the consumer to define a custom label for select default avatar. The default is _Select a default avatar_. ',
                    raw: '* This optional property allows the consumer to define a custom label for select default avatar. The default is _Select a default avatar_. ',
                  },
                ],
                trailingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This optional property allows the consumer to define a custom label for the default avatars show more button. The default is _Show more_. ',
                    raw: '* This optional property allows the consumer to define a custom label for the default avatars show more button. The default is _Show more_.  ',
                  },
                ],
              },
              {
                kind: 'property',
                optional: true,
                key: {
                  kind: 'id',
                  name: 'showMoreAvatarsButtonLabel',
                },
                value: {
                  kind: 'string',
                },
                leadingComments: [
                  {
                    type: 'commentBlock',
                    value:
                      'This optional property allows the consumer to define a custom label for the default avatars show more button. The default is _Show more_. ',
                    raw: '* This optional property allows the consumer to define a custom label for the default avatars show more button. The default is _Show more_. ',
                  },
                ],
              },
            ],
          },
        },
        {
          kind: 'generic',
          value: {
            kind: 'id',
            name: 'Partial',
          },
          key: {
            kind: 'any',
          },
          typeParams: {
            kind: 'typeParams',
            params: [
              {
                kind: 'generic',
                value: {
                  kind: 'import',
                  importKind: 'value',
                  name: 'WrappedComponentProps',
                  moduleSpecifier: 'react-intl-next',
                },
              },
            ],
          },
        },
      ],
      referenceIdName: 'AvatarPickerDialogWithIntlProps',
    },
    name: {
      kind: 'id',
      name: 'AvatarPickerDialog',
      type: null,
    },
  },
};

export default md`
${(
  <PropsTable
    heading="Avatar List Props"
    // @ts-ignore
    props={require('!!extract-react-types-loader!../../src/avatar-list')}
  />
)}

${(
  <PropsTable heading="Avatar Picker Dialog Props" props={avatarPickerProps} />
)}

${(
  <PropsTable
    heading="Predefined Avatar List Props"
    // @ts-ignore
    props={require('!!extract-react-types-loader!../../src/predefined-avatar-list')}
  />
)}

${(
  <PropsTable
    heading="Predefined Avatar View Props"
    // @ts-ignore
    props={require('!!extract-react-types-loader!../../src/predefined-avatar-view')}
  />
)}`;
