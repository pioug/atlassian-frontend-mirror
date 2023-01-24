import React from 'react';
import { IconAndTitleLayout } from '../../index';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { expectElementWithText } from '../../../../../__tests__/__utils__/unit-helpers';

jest.mock('react-render-image');

describe('IconAndTitleLayout', () => {
  it('should render the text', async () => {
    renderWithIntl(
      <IconAndTitleLayout
        title="some text content"
        testId="icon-and-title-layout"
      />,
    );

    await expectElementWithText('icon-and-title-layout', 'some text content');
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

    it('renders shimmer placeholder while image is loading', () => {
      const { getByTestId } = renderWithIntl(
        <IconAndTitleLayout title="title" icon="src-loading" />,
      );

      const customDefaultIcon = getByTestId(
        'inline-card-icon-and-title-loading',
      );

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

  describe('rightSideSpacer prop', () => {
    it('should render spacer when undefined', async () => {
      const leftText = 'Left side text';
      const rightText = 'Right side text';
      renderWithIntl(
        <IconAndTitleLayout
          title={leftText}
          testId="icon-and-title-layout"
          rightSide={rightText}
        />,
      );

      await expectElementWithText(
        'icon-and-title-layout',
        `${leftText} - ${rightText}`,
      );
    });

    it('should render spacer when true', async () => {
      const leftText = 'Left side text';
      const rightText = 'Right side text';
      renderWithIntl(
        <IconAndTitleLayout
          title={leftText}
          testId="icon-and-title-layout"
          rightSide={rightText}
          rightSideSpacer={true}
        />,
      );

      await expectElementWithText(
        'icon-and-title-layout',
        `${leftText} - ${rightText}`,
      );
    });

    it('should not render spacer when false', async () => {
      const leftText = 'Left side text';
      const rightText = 'Right side text';
      renderWithIntl(
        <IconAndTitleLayout
          title={leftText}
          testId="icon-and-title-layout"
          rightSide={rightText}
          rightSideSpacer={false}
        />,
      );

      await expectElementWithText(
        'icon-and-title-layout',
        `${leftText}${rightText}`,
      );
    });
  });
});
