import React from 'react';
import LinkSearchListItem, {
  Name,
  ContainerName,
  Container,
} from '../LinkSearchListItem';
import { getDefaultItems } from './__helpers';
import { Props as LinkSearchListItemProps } from '../LinkSearchListItem';
import { expectFunctionToHaveBeenCalledWith } from '@atlaskit/media-test-helpers';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';

interface SetupOptions extends LinkSearchListItemProps {}

describe('ListSearchListItem', () => {
  const setup = (userOptions: Partial<SetupOptions> = {}) => {
    const defaultOptions: Required<SetupOptions> = {
      item: getDefaultItems()[0],
      selected: true,
      onSelect: jest.fn(),
      onMouseMove: jest.fn(),
      onMouseEnter: jest.fn(),
      onMouseLeave: jest.fn(),
    };
    const options: Required<SetupOptions> = {
      ...defaultOptions,
      ...userOptions,
    };

    const component = mountWithIntl(<LinkSearchListItem {...options} />);

    return {
      component: component.find(Container),
      item: options.item,
      onMouseMove: options.onMouseMove,
      onMouseEnter: options.onMouseEnter,
      onMouseLeave: options.onMouseLeave,
      onSelect: options.onSelect,
    };
  };

  beforeAll(() => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('2020-10-25T01:10:44.797Z').valueOf());
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should render the item', () => {
    const { component, item } = setup();

    expect(component.find(Container).props().selected).toEqual(true);
    expect(component.find(Name).text()).toEqual(item.name);
    expect(component.find(ContainerName).text()).toEqual(item.container);
    expect(component.find(HTMLImageElement).props().src).toEqual(item.iconUrl);
  });

  it('should call onSelect and prevent default when mouse is down on the element', () => {
    const { component, onSelect, item } = setup();
    const event: Partial<React.MouseEvent> = {
      preventDefault: jest.fn(),
    };
    component.simulate('click', event);
    expectFunctionToHaveBeenCalledWith(onSelect, [item.url, item.name]);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should call onMouseMove when mouse is moved over element', () => {
    const { component, onMouseMove, item } = setup();

    component.simulate('mousemove');
    expectFunctionToHaveBeenCalledWith(onMouseMove, [item.objectId]);
  });

  it('should call onMouseEnter when mouse hover over element', () => {
    const { component, onMouseEnter, item } = setup();

    component.simulate('mouseenter');
    expectFunctionToHaveBeenCalledWith(onMouseEnter, [item.objectId]);
  });

  it('should call onMouseLeave when mouse hover off element', () => {
    const { component, onMouseLeave, item } = setup();

    component.simulate('mouseleave');
    expectFunctionToHaveBeenCalledWith(onMouseLeave, [item.objectId]);
  });

  it('should render iconComponent when prop is available', () => {
    const { component } = setup({
      item: {
        ...getDefaultItems()[0],
        iconUrl: undefined,
        icon: <MoreIcon label="more" />,
      },
    });

    expect(component.find(MoreIcon)).toHaveLength(1);
  });

  it("should not render icon based on iconUrl when it's not provided", () => {
    const { component } = setup({
      item: {
        ...getDefaultItems()[0],
        iconUrl: undefined,
        icon: <MoreIcon label="more" />,
      },
    });

    expect(component.find(HTMLImageElement)).toHaveLength(0);
  });

  it('should prefer icon over iconUrl when both are provided', () => {
    const { component } = setup({
      item: {
        ...getDefaultItems()[0],
        icon: <MoreIcon label="more" />,
      },
    });

    expect(component.find(HTMLImageElement)).toHaveLength(0);
    expect(component.find(MoreIcon)).toHaveLength(1);
  });

  it('should render lastViewedDate', () => {
    const { component } = setup({
      item: {
        ...getDefaultItems()[0],
        lastViewedDate: new Date('2020-06-24T01:10:44.797Z'),
        icon: <MoreIcon label="more" />,
      },
    });

    expect(
      component.find('span[data-test-id="link-search-timestamp"]').text(),
    ).toMatchInlineSnapshot(`"  Viewed June 24, 2020 "`);
  });

  it('should render with spaces', () => {
    const { component } = setup({
      item: {
        ...getDefaultItems()[0],
        lastUpdatedDate: new Date('2020-06-24T01:10:44.797Z'),
        icon: <MoreIcon label="more" />,
      },
    });

    expect(component.find(ContainerName).text()).toMatchInlineSnapshot(
      `"some-container-1  •  Updated June 24, 2020 "`,
    );
  });

  it('should render lastUpdatedDate', () => {
    const { component } = setup({
      item: {
        ...getDefaultItems()[0],
        lastUpdatedDate: new Date('2020-06-24T01:10:44.797Z'),
        icon: <MoreIcon label="more" />,
      },
    });

    expect(
      component.find('span[data-test-id="link-search-timestamp"]').text(),
    ).toMatchInlineSnapshot(`"  Updated June 24, 2020 "`);
  });

  it('should prefer lastViewedDate over lastUpdatedDate', () => {
    const { component } = setup({
      item: {
        ...getDefaultItems()[0],
        lastViewedDate: new Date('2020-06-24T01:10:44.797Z'),
        lastUpdatedDate: new Date('2020-06-24T01:10:44.797Z'),
        icon: <MoreIcon label="more" />,
      },
    });

    expect(
      component.find('span[data-test-id="link-search-timestamp"]').text(),
    ).toMatchInlineSnapshot(`"  Viewed June 24, 2020 "`);
  });

  it('should render relative time if it was less than 7 days ago', () => {
    const { component } = setup({
      item: {
        ...getDefaultItems()[0],
        lastViewedDate: new Date('2020-10-24T01:10:44.797Z'),
        icon: <MoreIcon label="more" />,
      },
    });

    expect(
      component.find('span[data-test-id="link-search-timestamp"]').text(),
    ).toMatchInlineSnapshot(`"  Viewed 1 day ago"`);
  });

  it('should render absolute time if it was more than 7 days ago', () => {
    const { component } = setup({
      item: {
        ...getDefaultItems()[0],
        lastViewedDate: new Date('2020-06-24T01:10:44.797Z'),
        icon: <MoreIcon label="more" />,
      },
    });

    expect(
      component.find('span[data-test-id="link-search-timestamp"]').text(),
    ).toMatchInlineSnapshot(`"  Viewed June 24, 2020 "`);
  });
});
