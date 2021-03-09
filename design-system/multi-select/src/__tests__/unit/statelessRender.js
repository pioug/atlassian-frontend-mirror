import React from 'react';
import { shallow, mount } from 'enzyme';
import { Label, FieldBaseStateless as FieldBase } from '@atlaskit/field-base';
import Avatar from '@atlaskit/avatar';
import Droplist, { Group, Item } from '@atlaskit/droplist';
import Tag from '@atlaskit/tag';
import TagGroup from '@atlaskit/tag-group';
import SearchIcon from '@atlaskit/icon/glyph/search';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import Spinner from '@atlaskit/spinner';

import { MultiSelectStateless } from '../..';
import { SelectWrapper } from '../../styled/Stateless';
import InitialLoading from '../../styled/InitialLoading';
import NoMatches from '../../styled/NoMatch';
import { TriggerDiv } from '../../styled/Trigger';
import Footer from '../../components/Footer';
import FooterDiv from '../../styled/Footer';

describe('@atlaskit/multi-select - stateless', () => {
  const animStub = window.cancelAnimationFrame;
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  describe('render', () => {
    it('sanity check', () => {
      expect(shallow(<MultiSelectStateless />).exists()).toBe(true);
    });

    it('should render with correct CSS class name', () => {
      expect(mount(<MultiSelectStateless />).find(SelectWrapper).length).toBe(
        1,
      );
    });

    it('should render Label when the prop is set', () => {
      expect(mount(<MultiSelectStateless />).find(Label).length).toBe(0);
      expect(
        mount(<MultiSelectStateless label="test" />).find(Label).length,
      ).toBe(1);
    });

    it('should render Droplist', () => {
      expect(mount(<MultiSelectStateless />).find(Droplist).length).toBe(1);
    });

    it('should pass shouldFlip to Droplist', () => {
      expect(
        mount(<MultiSelectStateless shouldFlip />)
          .find(Droplist)
          .props().shouldFlip,
      ).toBe(true);
    });

    it('should render Fieldbase inside Droplist', () => {
      expect(mount(<MultiSelectStateless />).find(FieldBase).length).toBe(1);
      expect(
        mount(<MultiSelectStateless />)
          .find(Droplist)
          .find(FieldBase).length,
      ).toBe(1);
    });

    it('should render Trigger inside Fieldbase', () => {
      const wrapper = mount(<MultiSelectStateless />);
      expect(wrapper.find(TriggerDiv).length).toBe(1);
      expect(wrapper.find(FieldBase).find(TriggerDiv).length).toBe(1);
    });

    it('should render Footer if shouldAllowCreateItem is true and the search value is not empty', () => {
      expect(
        mount(
          <MultiSelectStateless
            filterValue="test"
            isOpen
            shouldAllowCreateItem
          />,
        ).find(Footer).length,
      ).toBe(1);
    });

    it('should NOT render Footer if shouldAllowCreateItem is false and footer is not passed', () => {
      expect(
        mount(<MultiSelectStateless filterValue="test" isOpen />).find(
          FooterDiv,
        ).length,
      ).toBe(0);
    });

    it('should render search text and label in the footer when shouldAllowCreateItem is true', () => {
      const wrapper = mount(
        <MultiSelectStateless
          createNewItemLabel="new"
          filterValue="test"
          isOpen
          shouldAllowCreateItem
        />,
      );
      expect(wrapper.find(Footer).text()).toBe('test (new)');
    });

    it('should render Footer if footer`s content prop is passed', () => {
      const footer = {
        content: 'footer',
      };
      const wrapper = mount(<MultiSelectStateless footer={footer} isOpen />);
      expect(wrapper.find(Footer).length).toBe(1);
      expect(wrapper.find(Footer).text()).toBe('footer');
    });

    it('if shouldAllowCreateItem and footer are passed at the same time, "new item" footer has the priority and general footer shouldnt be rendered', () => {
      const footer = {
        elemBefore: <div />,
        content: 'footer',
      };
      const wrapper = mount(
        <MultiSelectStateless
          createNewItemLabel="new"
          filterValue="test"
          footer={footer}
          isOpen
          shouldAllowCreateItem
        />,
      );
      expect(wrapper.find(Footer).text()).toBe('test (new)');
    });

    it('should render ExpandIcon if no custom icon provided', () => {
      expect(mount(<MultiSelectStateless />).find(ExpandIcon).length).toBe(1);
    });

    it('should render custom icon if provided', () => {
      const icon = <SearchIcon label="" />;
      const select = mount(<MultiSelectStateless icon={icon} />);
      expect(select.find(SearchIcon).length).toBe(1);
      expect(select.find(ExpandIcon).length).toBe(0);
    });

    describe('groups and items', () => {
      const items = [
        {
          heading: 'test',
          items: [
            { value: 1, content: '1', description: 'item1' },
            { value: 2, content: '2', description: 'item2' },
          ],
        },
      ];

      const itemsIn3Groups = [
        {
          heading: 'group 1',
          items: [
            { value: 1, content: '1' },
            { value: 2, content: '2' },
          ],
        },
        {
          heading: 'group 2',
          items: [
            { value: 3, content: '3' },
            { value: 4, content: '4' },
          ],
        },
        {
          heading: 'group 3',
          items: [
            { value: 5, content: '5' },
            { value: 6, content: '6' },
          ],
        },
      ];

      it('should render groups and items inside Droplist (when open)', () => {
        const select = mount(<MultiSelectStateless items={items} isOpen />);
        expect(select.find(Group).length).toBe(1);
        expect(select.find(Item).length).toBe(2);
        expect(select.find(Group).find(Item).length).toBe(2);
      });

      it('should not render a group if all items in that group are selected', () => {
        const selectedItems = [items[0].items[0], items[0].items[1]];
        const select = mount(
          <MultiSelectStateless
            items={items}
            selectedItems={selectedItems}
            isOpen
          />,
        );
        expect(select.find(Group).length).toBe(0);
      });

      it('should render 3 groups with all non-selected items', () => {
        const selectedItems = [
          itemsIn3Groups[0].items[0],
          itemsIn3Groups[1].items[1],
        ];
        const select = mount(
          <MultiSelectStateless
            items={itemsIn3Groups}
            selectedItems={selectedItems}
            isOpen
          />,
        );

        expect(select.find(Group).length).toBe(3);
        expect(select.find(Group).at(0).find(Item).length).toBe(1);
        expect(select.find(Group).at(1).find(Item).length).toBe(1);
        expect(select.find(Group).at(2).find(Item).length).toBe(2);
      });

      it('should not render a group if all items in the group are selected', () => {
        const selectedItems = [
          itemsIn3Groups[1].items[0],
          itemsIn3Groups[1].items[1],
        ];
        const select = mount(
          <MultiSelectStateless
            items={itemsIn3Groups}
            selectedItems={selectedItems}
            isOpen
          />,
        );

        expect(select.find(Group).length).toBe(2);
        expect(select.find(Group).at(0).find(Item).length).toBe(2);
        expect(select.find(Group).at(0).props().heading).toBe('group 1');
        expect(select.find(Group).at(1).find(Item).length).toBe(2);
        expect(select.find(Group).at(1).props().heading).toBe('group 3');
      });

      it('should render loading state for initial fetching when properties are set and no items', () => {
        const emptyArray = [];
        const select = mount(
          <MultiSelectStateless items={emptyArray} isOpen isLoading />,
        );

        expect(select.find(Spinner).length).toBe(1);
        const loadingElement = select.find(InitialLoading);
        expect(loadingElement.length).toBe(1);
        // a11y props
        expect(loadingElement.props()['aria-live']).toBe('polite');
        expect(loadingElement.props().role).toBe('status');
      });

      it('should not render loading state when field is not open', () => {
        const emptyArray = [];
        const select = mount(
          <MultiSelectStateless items={emptyArray} isOpen={false} isLoading />,
        );

        expect(select.find(Spinner).length).toBe(0);
        expect(select.find(InitialLoading).length).toBe(0);
      });

      it('should render a no matches found if there is no item at all', () => {
        const emptyArray = [];
        const select = mount(
          <MultiSelectStateless items={emptyArray} selectedItems={[]} isOpen />,
        );

        expect(select.find(NoMatches).length).toBe(1);
      });

      it('should render a no matches found if all items are selected', () => {
        const selectedItems = itemsIn3Groups
          .map(group => group.items)
          .reduceRight((prev, curr) => prev.concat(curr));

        const select = mount(
          <MultiSelectStateless
            items={itemsIn3Groups}
            selectedItems={selectedItems}
            isOpen
          />,
        );

        expect(select.find(NoMatches).length).toBe(1);
      });

      it('should not render a no matches found message if at least an item is available in dropdown', () => {
        const selectedItems = [
          itemsIn3Groups[0].items[0],
          itemsIn3Groups[0].items[1],
          itemsIn3Groups[1].items[0],
          itemsIn3Groups[1].items[1],
          itemsIn3Groups[2].items[0],
        ];

        const select = mount(
          <MultiSelectStateless
            items={itemsIn3Groups}
            selectedItems={selectedItems}
            isOpen
          />,
        );

        expect(select.find(NoMatches).length).toBe(0);
      });

      it('should filter selected items by their values not reference', () => {
        const select = mount(
          <MultiSelectStateless
            items={items}
            selectedItems={[{ content: 'new', value: 2 }]}
            isOpen
          />,
        );

        expect(select.find(Group).length).toBe(1);
        expect(select.find(Group).find(Item).length).toBe(1);
        expect(select.find(Group).find(Item).props().description).toBe('item1');
      });
    });

    it('should render elemBefore inside Droplist (when open)', () => {
      const items = [
        {
          heading: 'test',
          items: [
            { value: 1, content: '1', elemBefore: <Avatar size="small" /> },
            { value: 2, content: '2', elemBefore: <Avatar size="small" /> },
          ],
        },
      ];
      const select = mount(<MultiSelectStateless items={items} isOpen />);

      expect(select.find(Avatar).length).toBe(2);
    });

    it('should pass props to Item', () => {
      const selectItems = [
        {
          heading: 'test',
          items: [
            {
              value: 1,
              content: 'Test1',
              description: 'Descr',
              isDisabled: true,
              elemBefore: '1',
              elemAfter: '2',
            },
          ],
        },
      ];
      const select = mount(
        <MultiSelectStateless
          isOpen
          id="testId"
          name="testName"
          items={selectItems}
        />,
      );
      const itemProps = select.find(Item).props();
      expect(itemProps.description).toBe('Descr');
      expect(itemProps.isDisabled).toBe(true);
      expect(itemProps.elemBefore).toBe('1');
      expect(itemProps.elemAfter).toBe('2');
    });
  });

  describe('selectedTags', () => {
    const items = [
      {
        heading: 'test',
        items: [
          {
            value: 1,
            content: '1',
            tag: { elemBefore: <Avatar size="small" />, appearance: 'rounded' },
          },
          { value: 2, content: '2' },
          {
            value: 3,
            content: '3',
            tag: { elemBefore: <Avatar size="small" /> },
          },
        ],
      },
    ];
    const selectedItems = [items[0].items[0], items[0].items[1]];

    it('should render selectedTags', () => {
      const wrapper = mount(
        <MultiSelectStateless items={items} selectedItems={selectedItems} />,
      );
      const tagGroup = wrapper.find(TagGroup);
      expect(tagGroup.find(Tag).length).toBe(2);
    });

    it('should pass on tag.elemBefore prop to selected tags', () => {
      const wrapper = mount(
        <MultiSelectStateless items={items} selectedItems={selectedItems} />,
      );
      const tagGroup = wrapper.find(TagGroup);
      expect(tagGroup.find(Tag).length).toBe(2);
      expect(tagGroup.find(Avatar).length).toBe(1);
    });

    it('should pass on tag.appearance prop to selected tags', () => {
      const wrapper = mount(
        <MultiSelectStateless items={items} selectedItems={selectedItems} />,
      );
      const tagGroup = wrapper.find(TagGroup);
      expect(tagGroup.find(Tag).length).toBe(2);
      expect(tagGroup.find(Tag).at(0).prop('appearance')).toBe('rounded');
    });
  });
});
