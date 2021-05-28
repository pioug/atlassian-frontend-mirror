import React from 'react';
import { Icon } from '../../../../BlockCard/components/Icon';
import { renderWithIntl } from '../../../__utils__/render';

jest.mock('react-render-image');

describe('Icon', () => {
  it('renders icon', () => {
    const { getByTestId } = renderWithIntl(
      <Icon icon={<span data-testid="block-card-icon-icon" />} />,
    );

    const icon = getByTestId('block-card-icon-icon');

    expect(icon).toBeDefined();
  });

  it('renders icon from url', () => {
    const { getByTestId } = renderWithIntl(
      <Icon url="src-loaded" testId="custom-block-card" />,
    );

    const urlIcon = getByTestId('custom-block-card-image');

    expect(urlIcon).toBeDefined();
  });

  it('renders default icon if neither icon nor url provided', () => {
    const { getByTestId } = renderWithIntl(<Icon />);

    const defaultIcon = getByTestId('block-card-icon-default');

    expect(defaultIcon).toBeDefined();
  });

  it('renders default icon on broken url', () => {
    const { getByTestId } = renderWithIntl(
      <Icon url="src-error" testId="block-card-icon" />,
    );

    const defaultIcon = getByTestId('block-card-icon-default');

    expect(defaultIcon).toBeDefined();
  });

  it('renders provided default icon on broken url', () => {
    const { getByTestId } = renderWithIntl(
      <Icon
        url="src-error"
        defaultIcon={<span data-testid="block-card-icon-custom-default" />}
      />,
    );

    const customDefaultIcon = getByTestId('block-card-icon-custom-default');

    expect(customDefaultIcon).toBeDefined();
  });
});
