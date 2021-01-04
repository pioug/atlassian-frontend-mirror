import { ResolvedViewProps } from '../../BlockCard/views/ResolvedView';

export const mockUrl = 'https://github.com/changesets/changesets';
export const getResolvedProps = (
  overrides = {},
  onClick: React.MouseEventHandler = () => {},
): ResolvedViewProps => ({
  link: mockUrl,
  icon: { icon: 'https://github.com/atlassian/changesets' },
  title: 'House of Holbein',
  users: [],
  actions: [],
  handleAvatarClick: () => {},
  onClick,
  ...overrides,
});
