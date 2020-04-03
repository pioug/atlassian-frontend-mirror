const createFieldResolver = (items: { label: string; value: string }[]) => (
  searchTerm?: string,
) => {
  if (searchTerm) {
    return Promise.resolve(
      items.filter(
        item =>
          item.label.search(new RegExp(searchTerm, 'i')) !== -1 ||
          item.value.search(new RegExp(searchTerm, 'i')) !== -1,
      ),
    );
  }

  return Promise.resolve(items);
};

export const spaceKeyFieldResolver = createFieldResolver([
  {
    label: 'XRay',
    value: 'XR',
  },
  {
    label: 'Feature Flags',
    value: 'FF',
  },
  {
    label: 'Sunny days',
    value: 'SD',
  },
  {
    label: 'Bushfires',
    value: 'BF',
  },
]);

export const usernameFieldResolver = createFieldResolver([
  {
    label: 'Leandro Augusto Lemos',
    value: 'llemos',
  },
  {
    label: 'Rifat Nabi',
    value: 'rnabi',
  },
]);

export const labelFieldResolver = createFieldResolver([
  {
    label: 'Meeting notes',
    value: 'meeting-notes',
  },
  {
    label: 'Decision register',
    value: 'decision-register',
  },
]);

export const confluenceContentFieldResolver = createFieldResolver([
  {
    label: 'How to populate custom fields?',
    value: '123456',
  },
  {
    label: 'What should we do with X?',
    value: '654321',
  },
]);
