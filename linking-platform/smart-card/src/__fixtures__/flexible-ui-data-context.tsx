import { FlexibleUiDataContext } from '../state/flexible-ui-context/types';
import { IconType, MediaType } from '../constants';
import { SmartLinkActionType } from '@atlaskit/linking-types';

const context: FlexibleUiDataContext = {
  attachmentCount: 3,
  authorGroup: [
    { name: 'Alexander Hamilton' },
    { name: 'Spongebob Squarepants' },
  ],
  checklistProgress: '4/7',
  collaboratorGroup: [{ name: 'James Bond' }, { name: 'Spiderman' }],
  commentCount: 10,
  createdBy: 'Doctor Stephen Vincent Strange',
  createdOn: '2020-02-04T12:40:12.353+0800',
  downloadAction: {
    downloadUrl: 'https://www.link-url.com',
  },
  dueOn: '2022-02-22T12:40:12.353+0800',
  followAction: {
    action: {
      action: {
        actionType: SmartLinkActionType.FollowEntityAction,
        resourceIdentifiers: {},
      },
      providerKey: 'object-provider',
    },
    value: true,
  },
  latestCommit: '03e6a82',
  linkIcon: {
    icon: 'BitBucket:Project' as IconType,
    label: 'Link icon',
  },
  location: {
    text: 'Location title',
    url: 'https://www.locationMcLocationton.com/foo',
  },
  modifiedBy: 'Tony Stark',
  modifiedOn: '2022-01-12T12:40:12.353+0800',
  ownedBy: 'Bruce Banner',
  ownedByGroup: [
    {
      name: 'Bruce Banner',
      src: 'https://person-url',
    },
  ],
  assignedTo: 'Bruce Assigned',
  assignedToGroup: [
    {
      name: 'Bruce Assigned',
      src: 'https://person-url',
    },
  ],
  preview: { type: MediaType.Image, url: 'image-url' },
  previewAction: {
    downloadUrl: 'https://www.link-url.com',
    linkIcon: { url: 'Provider:Confluence' },
    providerName: 'dropbox-object-provider',
    src: 'https://www.link-url.com',
    title: 'embed title',
    url: 'https://www.link-url.com',
  },
  priority: {
    icon: 'Badge:PriorityMajor' as IconType,
    label: 'Major',
  },
  programmingLanguage: 'Javascript',
  provider: {
    icon: 'Provider:Confluence' as IconType,
    label: 'Confluence',
  },
  reactCount: 31,
  readTime: '5 minutes',
  snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  sourceBranch: 'lp-flexible-smart-links',
  state: {
    appearance: 'success',
    text: 'Link state',
  },
  subscriberCount: 20,
  storyPoints: 3,
  subTasksProgress: '3/4',
  targetBranch: 'master',
  title: 'Link title',
  url: 'https://www.link-url.com',
  viewAction: {
    viewUrl: 'https://www.link-url.com',
  },
  sentOn: '2023-08-10T03:45:14.797Z',
  viewCount: 21,
  voteCount: 41,
};

export default context;
