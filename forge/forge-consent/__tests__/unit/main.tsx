import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { temporarilySilenceActAndAtlaskitDeprecationWarnings } from '@atlassian/aux-test-utils';

import {
  AppPermissionsGroup,
  DescriptionList,
  PermissionsGroup,
  typeofAction,
} from '../../src/ui/forge-consent/main';

const readJiraPermissions = {
  service: 'jira',
  scopes: [
    {
      action: 'read',
      entities: ['issue', 'project'],
      descriptions: ['Read jira issue', 'Read jira project'],
      ids: ['read:issue:jira', 'read:project:jira'],
    },
  ],
};

const appPermissions = [readJiraPermissions];

temporarilySilenceActAndAtlaskitDeprecationWarnings();

describe('Permission component', () => {
  test('displays the permission title and expands description', async () => {
    const { getByText } = render(
      <AppPermissionsGroup
        appPermissions={appPermissions}
      ></AppPermissionsGroup>,
    );
    //const serviceName = getByText('Jira');
    const entity = getByText('issue, project');
    // expect(serviceName).toBeTruthy();
    expect(entity).toBeTruthy();
  });

  test('displays the permission title and icon', async () => {
    const { scopes } = readJiraPermissions;
    const { getByText } = render(
      <DescriptionList descriptions={scopes[0].descriptions}></DescriptionList>,
    );
    const description = getByText('Read jira issue');
    expect(description).toBeTruthy();
  });

  test('display permissions group is showing the View for read', async () => {
    const { scopes } = readJiraPermissions;

    const { getByText } = render(
      <PermissionsGroup
        entities={scopes[0].entities}
        action={typeofAction(scopes[0].action)}
        descriptions={scopes[0].descriptions}
      ></PermissionsGroup>,
    );

    const action = getByText('View');
    expect(action).toBeTruthy();
  });

  test('display permissions group is showing the View for read', async () => {
    const { scopes } = readJiraPermissions;

    const { getByText } = render(
      <PermissionsGroup
        entities={scopes[0].entities}
        action={typeofAction(scopes[0].action)}
        descriptions={scopes[0].descriptions}
      ></PermissionsGroup>,
    );

    const action = getByText('View');
    expect(action).toBeTruthy();
  });

  test('calls onClick with expanded information', async () => {
    const onClick = jest.fn();
    const { scopes } = readJiraPermissions;
    const { getByTestId } = render(
      <PermissionsGroup
        entities={scopes[0].entities}
        action={typeofAction(scopes[0].action)}
        descriptions={scopes[0].descriptions}
        onClick={onClick}
      />,
    );

    const permissionBtn = getByTestId('permission-button');

    fireEvent.click(permissionBtn);
    expect(onClick).toHaveBeenCalledWith(expect.anything(), true);
    fireEvent.click(permissionBtn);
    expect(onClick).toHaveBeenCalledWith(expect.anything(), false);
  });
});

test('associate aria attributes between button and details', async () => {
  const onClick = jest.fn();
  const { scopes } = readJiraPermissions;
  const { getByTestId } = render(
    <PermissionsGroup
      entities={scopes[0].entities}
      action={typeofAction(scopes[0].action)}
      descriptions={scopes[0].descriptions}
      onClick={onClick}
    />,
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
