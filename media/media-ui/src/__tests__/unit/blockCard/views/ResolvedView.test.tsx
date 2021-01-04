import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import { renderWithIntl } from '../../../__utils__/render';
import { BlockCardResolvedView } from '../../../../BlockCard';
import { getResolvedProps } from '../../../__mocks__/get-resolved-props';
import { ResolvedViewProps } from '../../../../BlockCard/views/ResolvedView';

let mockOnClick: React.MouseEventHandler = jest.fn();

describe('Block card views - Resolved', () => {
  let props: ResolvedViewProps;

  beforeEach(() => {
    mockOnClick = jest.fn().mockImplementation((event: React.MouseEvent) => {
      expect(event.isPropagationStopped()).toBe(true);
      expect(event.isDefaultPrevented()).toBe(true);
    });
    props = getResolvedProps({}, mockOnClick);
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders view', () => {
    const { getByTestId } = renderWithIntl(
      <BlockCardResolvedView testId="resolved-view" {...props} />,
    );
    const frame = getByTestId('resolved-view');
    expect(frame.textContent).toBe(
      'https://github.com/atlassian/changesetsHouse of Holbein',
    );
  });

  it('renders should show metadata', () => {
    const resolvedProps = {
      ...props,
      details: [{ text: 'fill my goblet up to the brim' }],
    };
    const { getByTestId } = renderWithIntl(
      <BlockCardResolvedView testId="resolved-view" {...resolvedProps} />,
    );
    const frame = getByTestId('resolved-view-meta');
    expect(frame.textContent).toBe('fill my goblet up to the brim');
  });

  it('renders should show byline', () => {
    const resolvedProps = {
      ...props,
      byline: 'V real react node',
    };
    const { getByTestId } = renderWithIntl(
      <BlockCardResolvedView testId="resolved-view" {...resolvedProps} />,
    );
    const frame = getByTestId('resolved-view-by');
    expect(frame.textContent).toBe('V real react node');
  });

  it('renders should show description', () => {
    const resolvedProps = {
      ...props,
      byline: 'Tall, large, Henry the eighth',
    };
    const { getByTestId } = renderWithIntl(
      <BlockCardResolvedView testId="resolved-view" {...resolvedProps} />,
    );
    const frame = getByTestId('resolved-view-by');
    expect(frame.textContent).toBe('Tall, large, Henry the eighth');
  });

  it('renders should show byline if both byline and description are passed', () => {
    const resolvedProps = {
      ...props,
      byline: 'V real react node',
      description: 'Tall, large, Henry the eighth',
    };
    const { getByTestId } = renderWithIntl(
      <BlockCardResolvedView testId="resolved-view" {...resolvedProps} />,
    );
    const frame = getByTestId('resolved-view-by');
    expect(frame.textContent).toBe('V real react node');
  });

  it('renders should show the metadata if both metadata and byline are passed', () => {
    const resolvedProps = {
      ...props,
      byline: 'V real react node',
      details: [{ text: 'fill my goblet up to the brim' }],
    };
    const { getByTestId } = renderWithIntl(
      <BlockCardResolvedView testId="resolved-view" {...resolvedProps} />,
    );
    const frame = getByTestId('resolved-view-meta');
    expect(frame.textContent).toBe('fill my goblet up to the brim');
  });

  it('renders a passed image as a background', () => {
    const resolvedProps = {
      ...props,
      thumbnail: 'Our riffs were on fire',
    };
    const { getByTestId } = renderWithIntl(
      <BlockCardResolvedView testId="resolved-view" {...resolvedProps} />,
    );
    const thumb = getByTestId('resolved-view-thumb');
    expect(thumb).toHaveStyleDeclaration(
      'background-image',
      `url(Our riffs were on fire)`,
    );
  });

  it('clicking on link should have no side-effects', () => {
    const { getByTestId } = renderWithIntl(
      <BlockCardResolvedView testId="resolved-view" {...props} />,
    );
    const view = getByTestId('resolved-view');
    const link = view.querySelector('a');

    expect(link).toBeTruthy();
    fireEvent.click(link!);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
