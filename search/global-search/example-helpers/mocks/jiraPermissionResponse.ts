export const permissionResponseWithUserPickerPermission = {
  permissions: {
    USER_PICKER: {
      id: '27',
      key: 'USER_PICKER',
      name: 'Browse users and groups',
      type: 'GLOBAL',
      description: 'Description',
      havePermission: true,
    },
  },
};

export const permissionResponseWithoutUserPickerPermission = {
  permissions: {
    USER_PICKER: {
      id: '27',
      key: 'USER_PICKER',
      name: 'Browse users and groups',
      type: 'GLOBAL',
      description: 'Description',
      havePermission: false,
    },
  },
};
