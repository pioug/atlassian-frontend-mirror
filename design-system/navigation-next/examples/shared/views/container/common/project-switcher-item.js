export const ProjectSwitcherItem = {
  id: 'container-header',
  type: 'ProjectSwitcher',
  defaultSelected: {
    avatar: 'endeavour',
    id: 'endeavour',
    pathname: '/projects/endeavour',
    text: 'Endeavour',
    subText: 'Software project',
  },
  options: [
    {
      label: 'Recent Projects',
      options: [
        {
          avatar: 'endeavour',
          id: 'endeavour',
          pathname: '/projects/endeavour',
          text: 'Endeavour',
          subText: 'Software project',
        },
        {
          avatar: 'design-system-support',
          id: 'design-system-support',
          pathname: '/projects/design-system-support',
          text: 'Design System Support',
          subText: 'Service desk project',
        },
      ],
    },
    {
      label: 'Other Projects',
      options: [
        {
          avatar: 'design-platform',
          id: 'design-platform',
          pathname: '/projects/design-platform',
          text: 'Design Platform',
          subText: 'Software project',
        },
        {
          avatar: 'donut-world',
          id: 'donut-world',
          pathname: '/projects/donut-world',
          text: 'Donut World',
          subText: 'Software project',
        },
        {
          avatar: 'kitkat',
          id: 'kitkat',
          pathname: '/projects/kitkat',
          text: 'KitKat',
          subText: 'Software project',
        },
        {
          avatar: 'tangerine',
          id: 'tangerine',
          pathname: '/projects/tangerine',
          text: 'Tangerine',
          subText: 'Software project',
        },
      ],
    },
  ],
};
