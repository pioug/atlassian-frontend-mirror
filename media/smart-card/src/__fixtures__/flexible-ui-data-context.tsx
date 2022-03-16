import { FlexibleUiDataContext } from '../state/flexible-ui-context/types';
import { IconType, MediaType } from '../constants';

const context: FlexibleUiDataContext = {
  commentCount: 10,
  viewCount: 21,
  reactCount: 31,
  voteCount: 41,
  linkIcon: {
    label: 'Link icon',
    icon: 'BitBucket:Project' as IconType,
  },
  authorGroup: [
    { name: 'Alexander Hamilton' },
    { name: 'Spongebob Squarepants' },
  ],
  collaboratorGroup: [{ name: 'James Bond' }, { name: 'Spiderman' }],
  createdBy: 'Doctor Stephen Vincent Strange',
  createdOn: '2020-02-04T12:40:12.353+0800',
  modifiedBy: 'Tony Stark',
  modifiedOn: '2022-01-12T12:40:12.353+0800',
  preview: { type: MediaType.Image, url: 'image-url' },
  priority: {
    icon: 'Badge:PriorityMajor' as IconType,
    label: 'Major',
  },
  programmingLanguage: 'Javascript',
  snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  subscriberCount: 20,
  state: {
    text: 'Link state',
    appearance: 'success',
  },
  title: 'Link title',
  url: 'link-url',
  provider: {
    icon: 'Provider:Confluence' as IconType,
    label: 'Confluence',
  },
};

export default context;
