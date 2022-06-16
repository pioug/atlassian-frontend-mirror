import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { FlexibleUiContext } from '../../src/state/flexible-ui-context';
import { getContext } from '../utils/flexible-ui';
import { isFlexibleUiBlock } from '../../src/utils/flexible';
import { IconType, MediaType, SmartLinkStatus } from '../../src/constants';
import avatar1 from '../images/avatar-1.svg';
import avatar2 from '../images/avatar-2.svg';
import avatar3 from '../images/avatar-3.svg';
import previewImage from '../images/rectangle.svg';

const today = new Date();
const yesterday = new Date().setDate(today.getDate() - 1);
const lastMonth = new Date().setDate(today.getMonth() - 1);
const context = getContext({
  authorGroup: [{ name: 'Aliza', src: avatar3 }],
  collaboratorGroup: [
    { name: 'Steve', src: avatar2 },
    { name: 'Angie', src: avatar1 },
    { name: 'Rolan' },
  ],
  commentCount: 22,
  createdBy: 'Aliza',
  createdOn: new Date(lastMonth).toISOString(),
  modifiedBy: 'Steve',
  modifiedOn: new Date(yesterday).toISOString(),
  preview: { type: MediaType.Image, url: previewImage },
  priority: { icon: IconType.PriorityMajor },
  programmingLanguage: 'Javascript',
  reactCount: 78,
  snippet:
    'Nunc justo lectus, blandit ut ultrices a, elementum quis quam. In ut dolor ac nulla gravida scelerisque vitae sit amet ipsum. Pellentesque vitae luctus lorem. Etiam enim ligula, lobortis vel convallis ut, elementum ut nibh. Mauris ultricies mi risus, vel condimentum lorem convallis eu. Cras pharetra, dui nec gravida rutrum, mauris odio commodo mauris, eu lacinia dui mi nec tortor. Curabitur eleifend tortor eros, id venenatis est posuere sit amet. ',
  state: { appearance: 'success', text: 'DONE' },
  subscriberCount: 45,
  viewCount: 2,
  voteCount: 4,
  url:
    'https://atlaskit.atlassian.com/packages/media/smart-card/docs/flexible-ui',
  latestCommit: '64862f5',
});

const renderChildren = (children: React.ReactNode): React.ReactNode =>
  React.Children.map(children, (child) => {
    if (React.isValidElement(child) && isFlexibleUiBlock(child)) {
      const node = child as React.ReactElement;
      const status = node.props.status || SmartLinkStatus.Resolved;
      return React.cloneElement(node, { status, ...node.props });
    }
    return child;
  });

const ExampleContainer: React.FC = ({ children }) => (
  <IntlProvider locale="en">
    <FlexibleUiContext.Provider value={context}>
      {renderChildren(children)}
    </FlexibleUiContext.Provider>
  </IntlProvider>
);

export default ExampleContainer;
