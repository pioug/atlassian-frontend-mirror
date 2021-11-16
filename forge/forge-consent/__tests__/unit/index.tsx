import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { B200, B400 } from '@atlaskit/theme/colors';
import { temporarilySilenceActAndAtlaskitDeprecationWarnings } from '@atlassian/aux-test-utils';

import {
  addSubdomainMessage,
  Egress,
  getEgressPermissionDescription,
  getEgressPermissionTitle,
  Permission,
} from '../../src/ui/forge-consent/main';

temporarilySilenceActAndAtlaskitDeprecationWarnings();

const readJiraPermission = {
  id: 'read:jira-user',
  name: 'View user information in Jira',
  description:
    'View user information in Jira that you have access to, including usernames, email addresses, and avatars.',
};

const permissionsList = [
  '*.google.com',
  'google.com',
  'www.noodle.com',
  'poodle.com',
  '*.yoodle.com',
  'www.woo.dle',
].sort();

const egress = {
  name: `Share data with ${permissionsList.length} domain${
    permissionsList.length > 1 ? 's' : ''
  } outside of Atlassian.`,
  addresses: permissionsList,
};

describe('Permission component', () => {
  test('displays the permission title and expands description', async () => {
    const { name, description } = readJiraPermission;
    const { getByText } = render(
      <Permission
        title={name}
        icon={
          <AtlassianIcon
            size="small"
            iconColor={B200}
            iconGradientStart={B400}
            iconGradientStop={B200}
          />
        }
      >
        {description}
      </Permission>,
    );

    const scopePermission = getByText(name);
    expect(scopePermission).toBeTruthy();
    fireEvent.click(scopePermission);
    expect(getByText(description)).toBeTruthy();
  });

  test('calls onClick with expanded information', async () => {
    const onClick = jest.fn();
    const { name, description } = readJiraPermission;
    const { getByText } = render(
      <Permission
        title={name}
        icon={
          <AtlassianIcon
            size="small"
            iconColor={B200}
            iconGradientStart={B400}
            iconGradientStop={B200}
          />
        }
        onClick={onClick}
      >
        {description}
      </Permission>,
    );

    const scopePermission = getByText(name);
    fireEvent.click(scopePermission);
    expect(onClick).toHaveBeenCalledWith(expect.anything(), true);
    fireEvent.click(scopePermission);
    expect(onClick).toHaveBeenCalledWith(expect.anything(), false);
  });

  test('associate aria attributes between button and details', async () => {
    const { name, description } = readJiraPermission;
    const { getByTestId } = render(
      <Permission
        title={name}
        icon={
          <AtlassianIcon
            size="small"
            iconColor={B200}
            iconGradientStart={B400}
            iconGradientStop={B200}
          />
        }
      >
        {description}
      </Permission>,
    );

    const permissionBtn = getByTestId('permission-button');
    expect(permissionBtn).toHaveAttribute('aria-expanded', 'false');
    const permissionDetails = getByTestId('permission-details');
    expect(permissionBtn).toHaveAttribute(
      'aria-controls',
      permissionDetails.getAttribute('id'),
    );
    expect(permissionDetails).toHaveAttribute('aria-hidden', 'true');
    fireEvent.click(permissionBtn);
    expect(permissionBtn).toHaveAttribute('aria-expanded', 'true');
    expect(permissionDetails).toHaveAttribute('aria-hidden', 'false');
  });

  test('getEgressPermissionTitle and with unlimited locations', async () => {
    const egressDomains = [...egress.addresses, '*'];

    expect(getEgressPermissionTitle(egressDomains)).toBe(
      'Share data with unlimited locations outside of Atlassian.',
    );
    expect(getEgressPermissionDescription(egressDomains)).toBe(
      'The app may share personal data outside of Atlassian cloud to unlimited locations on the internet. This may be required for the app to fetch data from user-defined sources, though this can put your data privacy at risk.',
    );
  });

  test('getEgressPermissionTitle and with limited locations (i.e. not incuding `*`)', async () => {
    const { addresses } = egress;

    expect(getEgressPermissionTitle(addresses)).toBe(
      'Share data with 6 domains outside of Atlassian.',
    );
    expect(getEgressPermissionDescription(addresses)).toBe(
      'This allows the app to share personal data outside of Atlassian cloud via the following domains:',
    );
  });

  test('addSubdomainMessage', async () => {
    const { addresses } = egress;

    expect(new Set(addSubdomainMessage([...addresses, '*']))).toEqual(
      new Set([
        'google.com and any of its subdomains',
        'only subdomains of yoodle.com',
        'poodle.com',
        'www.noodle.com',
        'www.woo.dle',
      ]),
    );
  });

  test('renders egress information', async () => {
    const { addresses } = egress;
    const { getByText } = render(
      <Egress defaultIsExpanded addresses={addresses} />,
    );
    const egressTitle = getByText(getEgressPermissionTitle(addresses));
    expect(egressTitle).toBeTruthy();
    const domainMessages = addSubdomainMessage(addresses);
    domainMessages.forEach(domainMessage => {
      expect(getByText(domainMessage)).toBeTruthy();
    });
  });

  test('Not rendering egress information when there are no egress domains', async () => {
    const { queryByTestId } = render(<Egress addresses={[]} />);

    expect(queryByTestId('permission-button')).not.toBeInTheDocument();
    expect(queryByTestId('permission-details')).not.toBeInTheDocument();
  });

  test('renders egress information with unlimited locations (i.e. when one of the egress domains is `*`)', () => {
    const egressDomains = [...egress.addresses, '*'];

    const { getByText, queryByText } = render(
      <Egress defaultIsExpanded addresses={egressDomains} />,
    );

    const egressTitle = getByText(getEgressPermissionTitle(egressDomains));
    expect(egressTitle).toBeTruthy();
    const egressDescription = getByText(
      getEgressPermissionDescription(egressDomains),
    );
    expect(egressDescription).toBeTruthy();
    const domainMessages = addSubdomainMessage(egressDomains);
    expect(queryByText(domainMessages[0])).not.toBeInTheDocument();
  });

  test('renders egress information with limited locations', () => {
    const egressDomains = [...egress.addresses];

    const { getByText, queryByText } = render(
      <Egress defaultIsExpanded addresses={egressDomains} />,
    );

    const egressTitle = getByText(getEgressPermissionTitle(egressDomains));
    expect(egressTitle).toBeTruthy();
    const egressDescription = getByText(
      getEgressPermissionDescription(egressDomains),
    );
    expect(egressDescription).toBeTruthy();
    const domainMessages = addSubdomainMessage(egressDomains);
    domainMessages.forEach(domainMessage => {
      expect(queryByText(domainMessage)).toBeInTheDocument();
    });
  });
});
