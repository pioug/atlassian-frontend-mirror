import React from 'react';
import { mount } from 'enzyme';
import { IconAndTitleLayout } from '../../index';
import { TitleWrapper } from '../../styled';
import { renderWithIntl } from '../../../../__tests__/__utils__/render';

jest.mock('react-render-image');

describe('IconAndTitleLayout', () => {
  it('should render the text', () => {
    const element = mount(<IconAndTitleLayout title="some text content" />);

    expect(element.find(TitleWrapper).text()).toContain('some text content');
  });

  describe('renderIcon', () => {
    it('renders icon', () => {
      const { getByTestId } = renderWithIntl(
        <IconAndTitleLayout
          title="title"
          icon={<span data-testid="inline-card-icon-icon" />}
        />,
      );

      const icon = getByTestId('inline-card-icon-icon');

      expect(icon).toBeDefined();
    });

    it('renders icon from url', () => {
      const { getByTestId } = renderWithIntl(
        <IconAndTitleLayout
          title="title"
          icon="src-loaded"
          testId="inline-card-icon"
        />,
      );

      const urlIcon = getByTestId('inline-card-icon-image');

      expect(urlIcon).toBeDefined();
    });

    it('renders default icon if neither icon nor url provided', () => {
      const { getByTestId } = renderWithIntl(
        <IconAndTitleLayout title="title" testId="inline-card-icon" />,
      );

      const defaultIcon = getByTestId('inline-card-icon-default');

      expect(defaultIcon).toBeDefined();
    });

    it('renders default icon on broken url', () => {
      const { getByTestId } = renderWithIntl(
        <IconAndTitleLayout title="title" icon="src-error" />,
      );

      const defaultIcon = getByTestId('inline-card-icon-and-title-default');

      expect(defaultIcon).toBeDefined();
    });

    it('renders provided default icon on broken url', () => {
      const { getByTestId } = renderWithIntl(
        <IconAndTitleLayout
          title="title"
          icon="src-error"
          defaultIcon={<span data-testid="inline-card-icon-custom-default" />}
        />,
      );

      const customDefaultIcon = getByTestId('inline-card-icon-custom-default');

      expect(customDefaultIcon).toBeDefined();
    });
  });

  it('should render emoji in place of default icon when emoji is provided', () => {
    const emojiIcon = <span data-testid="emoji">😍</span>;
    const { getByTestId, queryByTestId } = renderWithIntl(
      <IconAndTitleLayout
        title="title"
        testId="inline-card-icon"
        emoji={emojiIcon}
      />,
    );

    const emoji = getByTestId('emoji');
    expect(emoji).toBeDefined();
    expect(queryByTestId('inline-card-icon-default')).toBeNull;
  });
});
