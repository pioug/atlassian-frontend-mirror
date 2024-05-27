import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useContext } from 'react';

import {
  EMBEDDED_CONFLUENCE_MODE,
  DEFAULT_LOCALE,
} from '@atlassian/embedded-confluence-common';
import { ExperienceTrackerContext } from '@atlassian/experience-tracker';

import {
  DEFAULT_ALLOWED_FEATURES,
  type PageAllowedFeatures,
} from '@atlassian/embedded-confluence-common/features';
import { Page, type PageProps } from '../';

const defaultProps: PageProps = {
  locale: DEFAULT_LOCALE,
};

const editPageUrl = `https://laika.jira-dev.com/wiki/spaces/HOM/pages/edit-embed/245465589?parentProduct=Test&locale=${defaultProps.locale}`;
const viewPageUrl = `https://laika.jira-dev.com/wiki/spaces/HOM/pages/245465589?parentProduct=Test&locale=${defaultProps.locale}`;

const MockViewPage = (props: any) => {
  function handleOnEdit() {
    props.navigationPolicy.navigate(props.url, {
      contentId: props.contentId,
      spaceKey: props.spaceKey,
      target: props.target,
      routeName: 'EDIT_PAGE_EMBED',
    });
  }

  function handleCustomNavPolicyEdit() {
    props.navigationPolicy.navigate(props.url, {
      contentId: props.contentId,
      spaceKey: props.spaceKey,
      target: props.target,
      routeName: 'SOMETHING_ELSE',
    });
  }

  return (
    <div>
      <>{props.allowedFeatures.toString()}</>
      <button onClick={handleOnEdit}>Edit</button>
      <button onClick={handleCustomNavPolicyEdit}>Custom Edit</button>
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

const shouldRenderViewPage = async () => {
  const edit = await screen.findByText('Edit');
  expect(edit).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText('Publish')).not.toBeInTheDocument();
    expect(screen.queryByText('Close')).not.toBeInTheDocument();
  });
};

const shouldRenderEditPage = async () => {
  const publish = await screen.findByText('Publish');
  expect(publish).toBeInTheDocument();

  const close = await screen.findByText('Close');
  expect(close).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });
};

const shouldNotRenderViewEditComponents = async () => {
  await waitFor(() => {
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Publish')).not.toBeInTheDocument();
    expect(screen.queryByText('Close')).not.toBeInTheDocument();
  });
};

test('should render view page correctly', async () => {
  render(<Page {...defaultProps} url={viewPageUrl} />);

  await shouldRenderViewPage();
});

test('should render view blog correctly', async () => {
  render(<Page {...defaultProps} url={viewPageUrl} />);

  await shouldRenderViewPage();
});

test('should render edit page correctly', async () => {
  render(<Page {...defaultProps} url={editPageUrl} />);

  await shouldRenderEditPage();
});

test('should render view if contentId, parentProduct, spaceKey, hostname are passed in', async () => {
  render(
    <Page
      {...defaultProps}
      contentId="123"
      spaceKey="ABC"
      hostname="jira-dev.com"
      parentProduct="TestProduct"
    />,
  );

  await shouldRenderViewPage();
});

test('should not render anything if the url is not supported in the named routes', async () => {
  render(
    <Page
      {...defaultProps}
      url={`https://hello.atlassian.net/wiki/spaces/ABC/blog/edit-embed/123?parentProduct=TestProduct&locale=${defaultProps.locale}`}
    />,
  );

  await shouldNotRenderViewEditComponents();
});

test('should switch from View to Edit if you click the edit button', async () => {
  render(<Page {...defaultProps} url={viewPageUrl} />);

  const edit = await screen.findByText('Edit');
  await userEvent.click(edit);

  await shouldRenderEditPage();
});

test('should switch from Edit to View if you click the Publish button', async () => {
  render(<Page {...defaultProps} url={editPageUrl} />);

  const publish = await screen.findByText('Publish');
  await userEvent.click(publish);

  await shouldRenderViewPage();
});

test('should switch from Edit to View if you click the Close button', async () => {
  render(<Page {...defaultProps} url={editPageUrl} />);

  const close = await screen.findByText('Close');
  await userEvent.click(close);

  await shouldRenderViewPage();
});

test('should not switch from draft (unpublished) Edit to View if clicking the Close button (View can only render published pages)', async () => {
  render(
    <Page
      {...defaultProps}
      url={`${editPageUrl}&draftShareId=test-draft-share-id`}
    />,
  );

  const close = await screen.findByText('Close');
  await userEvent.click(close);

  await shouldRenderEditPage();
});

test('should show Edit page if edit mode is passed in with contentId, spackeKey, hostname, and parentProduct', async () => {
  render(
    <Page
      {...defaultProps}
      contentId="245465589"
      spaceKey="HOM"
      hostname="laika.jira-dev.com"
      parentProduct="atlaskit"
      mode={EMBEDDED_CONFLUENCE_MODE.EDIT_MODE}
    />,
  );

  await shouldRenderEditPage();
});

test('should show View page if view mode is passed in with contentId, spackeKey, hostname, and parentProduct', async () => {
  render(
    <Page
      {...defaultProps}
      contentId="245465589"
      spaceKey="HOM"
      hostname="laika.jira-dev.com"
      parentProduct="atlaskit"
      mode={EMBEDDED_CONFLUENCE_MODE.VIEW_MODE}
    />,
  );

  await shouldRenderViewPage();
});

describe('if parent product passes allowedFeatures array', () => {
  test('should show default view allowedFeatures in view component as a default', async () => {
    const defaultViewAllowedFeatures = [
      ...DEFAULT_ALLOWED_FEATURES.view,
      'edit',
    ].join(',');
    const allowedFeatures = undefined;
    render(
      <Page
        {...defaultProps}
        url={viewPageUrl}
        allowedFeatures={allowedFeatures}
      />,
    );

    const expected = await screen.findByText(defaultViewAllowedFeatures);
    expect(expected).toBeInTheDocument();
  });

  test('should show correct parsed allowedFeatures for View and Edit components when we pass allowedFeatures(view: array, edit: array)', async () => {
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
    const expectedViewAllowedFeatures = [
      ...(allowedFeatures.view as []),
      'edit',
    ].join(',');
    const expectedEditAllowedFeatures = (allowedFeatures.edit as [string])[0];
    render(
      <Page
        {...defaultProps}
        url={viewPageUrl}
        allowedFeatures={allowedFeatures}
      />,
    );

    const expectedViewFeaturesElement = await screen.findByText(
      expectedViewAllowedFeatures,
    );
    expect(expectedViewFeaturesElement).toBeInTheDocument();

    const edit = await screen.findByText('Edit');
    await userEvent.click(edit);

    const expectedEditFeaturesElement = await screen.findByText(
      expectedEditAllowedFeatures,
    );
    expect(expectedEditFeaturesElement).toBeInTheDocument();
  });

  test('should show edit allowedFeature in view component when we pass allowedFeatures(view: [])', async () => {
    const allowedFeatures: PageAllowedFeatures = {
      view: [],
    };
    render(
      <Page
        {...defaultProps}
        url={viewPageUrl}
        allowedFeatures={allowedFeatures}
      />,
    );

    const edit = await screen.findByText('edit');
    expect(edit).toBeInTheDocument();
  });

  test("should show show correct parsed allowedFeatures in view component when we pass allowedFeatures(view: 'all')", async () => {
    const allowedFeatures: PageAllowedFeatures = {
      view: 'all',
    };
    render(
      <Page
        {...defaultProps}
        url={viewPageUrl}
        allowedFeatures={allowedFeatures}
      />,
    );

    const all = await screen.findByText('all');
    expect(all).toBeInTheDocument();
  });
});

test('If parent product passes navigationPolicy that has navigate function, should use it for child page', async () => {
  const mockNavigationPolicy = {
    navigate: jest.fn(),
  };
  render(
    <Page
      {...defaultProps}
      url={viewPageUrl}
      navigationPolicy={mockNavigationPolicy}
    />,
  );

  const customEdit = await screen.findByText('Custom Edit');
  await userEvent.click(customEdit);

  await waitFor(() => {
    expect(mockNavigationPolicy.navigate).toHaveBeenCalled();
  });
});
