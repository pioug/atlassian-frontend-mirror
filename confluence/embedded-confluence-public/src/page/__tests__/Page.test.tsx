import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useContext } from 'react';
import { IntlProvider } from 'react-intl-next';

import { EMBEDDED_CONFLUENCE_MODE } from '@atlassian/embedded-confluence-common';
import { ExperienceTrackerContext } from '@atlassian/experience-tracker';

import { PageAllowedFeatures } from '@atlassian/embedded-confluence-common/features';
import { Page } from '../Page';

const BasicPage = (props: React.ComponentProps<typeof Page>) => (
  <IntlProvider locale="en">
    <Page {...props} />
  </IntlProvider>
);

const editPageUrl =
  'https://laika.jira-dev.com/wiki/spaces/HOM/pages/edit-embed/245465589?parentProduct=Test&locale=en-US';
const viewPageUrl =
  'https://laika.jira-dev.com/wiki/spaces/HOM/pages/245465589?parentProduct=Test&locale=en-US';

const MockViewPage = (props: any) => {
  function handleOnEdit() {
    props.navigationPolicy.navigate(props.url, {
      contentId: props.contentId,
      spaceKey: props.spaceKey,
      target: props.target,
      routeName: 'EDIT_PAGE_EMBED',
    });
  }

  return (
    <div>
      <>{props.allowedFeatures.toString()}</>
      <button onClick={handleOnEdit}>Edit</button>
    </div>
  );
};

const MockEditPage = (props: any) => {
  const mockExperienceTracker = useContext(ExperienceTrackerContext);

  function handleOnPublish() {
    mockExperienceTracker.start({
      name: 'edit-page/publish',
      id: '245465589',
    });
    mockExperienceTracker.succeed({
      name: 'edit-page/publish',
    });
  }

  function handleOnClose() {
    mockExperienceTracker.start({
      name: 'edit-page/close',
      id: '245465589',
    });
    mockExperienceTracker.succeed({
      name: 'edit-page/close',
    });
  }

  return (
    <div>
      <>{props.allowedFeatures ? props.allowedFeatures.toString() : ''}</>
      <button onClick={handleOnPublish}>Publish</button>
      <button onClick={handleOnClose}>Close</button>
    </div>
  );
};

jest.mock('../../view-page/ViewPage', () => ({
  ...jest.requireActual<any>('../../view-page/ViewPage'),
  ViewPage: (props: any) => MockViewPage(props),
}));

jest.mock('../../edit-page/EditPage', () => ({
  ...jest.requireActual<any>('../../edit-page/EditPage'),
  EditPage: (props: any) => MockEditPage(props),
}));

function shouldRenderViewPage() {
  expect(screen.getByText('Edit')).toBeInTheDocument();
  expect(screen.queryByText('Publish')).not.toBeInTheDocument();
  expect(screen.queryByText('Close')).not.toBeInTheDocument();
}

function shouldRenderEditPage() {
  expect(screen.getByText('Publish')).toBeInTheDocument();
  expect(screen.getByText('Close')).toBeInTheDocument();
  expect(screen.queryByText('Edit')).not.toBeInTheDocument();
}

function shouldNotRenderViewEditComponents() {
  expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  expect(screen.queryByText('Publish')).not.toBeInTheDocument();
  expect(screen.queryByText('Close')).not.toBeInTheDocument();
}

test('should render view page correctly', async () => {
  render(<BasicPage url={`${viewPageUrl}`} />);

  shouldRenderViewPage();
});

test('should render view blog correctly', async () => {
  render(<BasicPage url={`${viewPageUrl}`} />);

  shouldRenderViewPage();
});

test('should render edit page correctly', async () => {
  render(<BasicPage url={editPageUrl} />);

  shouldRenderEditPage();
});

test('should render view if contentId, parentProduct, spaceKey, hostname are passed in', async () => {
  render(
    <BasicPage
      contentId={'123'}
      spaceKey={'ABC'}
      hostname={'jira-dev.com'}
      parentProduct={'TestProduct'}
    />,
  );

  shouldRenderViewPage();
});

test('should not render anything if the url is not supported in the named routes', () => {
  render(
    <BasicPage
      url={
        'https://hello.atlassian.net/wiki/spaces/ABC/blog/edit-embed/123?parentProduct=TestProduct&locale=en-US'
      }
    />,
  );

  shouldNotRenderViewEditComponents();
});

test('should switch from View to Edit if you click the edit button', async () => {
  render(<BasicPage url={viewPageUrl} />);

  await userEvent.click(screen.getByText('Edit'));

  shouldRenderEditPage();
});

test('should switch from Edit to View if you click the Publish button', async () => {
  render(<BasicPage url={editPageUrl} />);

  await userEvent.click(screen.getByText('Publish'));

  shouldRenderViewPage();
});

test('should switch from Edit to View if you click the Close button', async () => {
  render(<BasicPage url={editPageUrl} />);

  await userEvent.click(screen.getByText('Close'));

  shouldRenderViewPage();
});

test('should not switch from draft (unpublished) Edit to View if clicking the Close button (View can only render published pages)', async () => {
  const draftUrl = `${editPageUrl}&draftShareId=test-draft-share-id`;
  render(<BasicPage url={draftUrl} />);

  await userEvent.click(screen.getByText('Close'));

  shouldRenderEditPage();
});

test('should show Edit page if edit mode is passed in with contentId, spackeKey, hostname, and parentProduct', async () => {
  render(
    <BasicPage
      contentId={'245465589'}
      spaceKey={'HOM'}
      hostname={'laika.jira-dev.com'}
      parentProduct={'atlaskit'}
      mode={EMBEDDED_CONFLUENCE_MODE.EDIT_MODE}
    />,
  );

  shouldRenderEditPage();
});

test('should show View page if view mode is passed in with contentId, spackeKey, hostname, and parentProduct', async () => {
  render(
    <BasicPage
      contentId={'245465589'}
      spaceKey={'HOM'}
      hostname={'laika.jira-dev.com'}
      parentProduct={'atlaskit'}
      mode={EMBEDDED_CONFLUENCE_MODE.VIEW_MODE}
    />,
  );

  shouldRenderViewPage();
});

describe('if parent product passes allowedFeatures array', () => {
  test('should show default view allowedFeatures in view component as a default', async () => {
    const defaultViewAllowedFeatures =
      'byline-contributors,byline-extensions,page-comments,page-reactions,edit';
    const allowedFeatures = undefined;
    render(<BasicPage url={viewPageUrl} allowedFeatures={allowedFeatures} />);

    expect(screen.getByText(defaultViewAllowedFeatures)).toBeInTheDocument();
  });

  test('should show correct parsed allowedFeatures for View and Edit components when we pass allowedFeatures(view: array, edit: array)', async () => {
    const expectedAllowedFeatures = `byline-contributors,byline-extensions,delete,inline-comments,page-comments,page-reactions,sticky-header,edit`;
    const allowedFeatures: PageAllowedFeatures = {
      view: [
        'byline-contributors',
        'byline-extensions',
        'delete',
        'inline-comments',
        'page-comments',
        'page-reactions',
        'sticky-header',
      ],
      edit: ['delete-draft'],
    };
    render(<BasicPage url={viewPageUrl} allowedFeatures={allowedFeatures} />);
    expect(screen.getByText(expectedAllowedFeatures)).toBeInTheDocument();

    await userEvent.click(screen.getByText('Edit'));

    expect(screen.getByText('delete-draft')).toBeInTheDocument();
  });

  test('should show edit allowedFeature in view component when we pass allowedFeatures(view: [])', async () => {
    const allowedFeatures: PageAllowedFeatures = {
      view: [],
    };
    render(<BasicPage url={viewPageUrl} allowedFeatures={allowedFeatures} />);

    expect(screen.getByText('edit')).toBeInTheDocument();
  });

  test("should show show correct parsed allowedFeatures in view component when we pass allowedFeatures(view: 'all')", async () => {
    const allowedFeatures: PageAllowedFeatures = {
      view: 'all',
    };
    render(<BasicPage url={viewPageUrl} allowedFeatures={allowedFeatures} />);

    expect(screen.getByText('all')).toBeInTheDocument();
  });
});

describe('if parent product passes its navigation policy', () => {
  test('If parent product passes navigationPolicy that has navigate function, should use it for child page', async () => {
    const mockNavigationPolicy = {
      navigate: jest.fn(),
    };
    render(
      <BasicPage url={viewPageUrl} navigationPolicy={mockNavigationPolicy} />,
    );

    await userEvent.click(screen.getByText('Edit'));

    expect(mockNavigationPolicy.navigate).toHaveBeenCalled();
  });
});
