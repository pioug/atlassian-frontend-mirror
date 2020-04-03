import React from 'react';
import { shallow, mount } from 'enzyme';
import cases from 'jest-in-case';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import InfoIcon from '@atlaskit/icon/glyph/info';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import Button from '@atlaskit/button';
import styled from 'styled-components';
import toJson from 'enzyme-to-json';

import SectionMessage from '../..';
import { Appearance } from '../../types';
import { Title, Action } from '../../components/styled';

// We added a property `type` because `name` was clashing with `name` from jest-in-case
const appearancesCase = [
  {
    name: 'info',
    type: 'info',
    icon: InfoIcon,
  },
  {
    name: 'warning',
    type: 'warning',
    icon: WarningIcon,
  },
  {
    name: 'error',
    type: 'error',
    icon: ErrorIcon,
  },
  {
    name: 'confirmation',
    type: 'confirmation',
    icon: CheckCircleIcon,
  },
  {
    name: 'change',
    type: 'change',
    icon: QuestionCircleIcon,
  },
];

describe('SectionMessage', () => {
  it('should render correct defaults', () => {
    const wrapper = mount(<SectionMessage>boo</SectionMessage>);
    expect(wrapper.prop('appearance')).toBe('info');
    expect(wrapper.prop('title')).toBe(undefined);
    expect(wrapper.prop('actions')).toBe(undefined);
  });

  it('should not render <Title /> if there is a title', () => {
    const wrapper = shallow(
      <SectionMessage title="things">boo</SectionMessage>,
    );
    const title = wrapper.find(Title);
    expect(title.length).toBe(1);
  });

  describe('actions', () => {
    it('should render beneath the section message', () => {
      const Aye = { key: 'aye', text: 'aye' };
      const Bee = { key: 'bee', text: 'bee' };
      const wrapper = shallow(
        <SectionMessage actions={[Aye, Bee]}>boo</SectionMessage>,
      );

      expect(wrapper.find(Action).length).toBe(2);
    });

    it('should use the key provided', () => {
      const Aye = { text: 'aye', key: 'ayeKey' };
      const actionWrapper = shallow(
        <SectionMessage actions={[Aye]}>boo</SectionMessage>,
      )
        .find(Action)
        .at(0);

      expect(actionWrapper.key()).toBe('ayeKey');
    });

    it('should render React Nodes as children', () => {
      const MyAction = () => <span>Hello, World!</span>;

      const Aye = { text: <MyAction />, key: 'greeting' };

      const actionWrapper = shallow(
        <SectionMessage actions={[Aye]}>boo</SectionMessage>,
      )
        .find(Action)
        .at(0)
        .find(MyAction)
        .dive();

      expect(toJson(actionWrapper)).toMatchSnapshot();
    });
  });

  it('should render a link button when passed a link', () => {
    const wrapper = shallow(
      <SectionMessage actions={[{ key: 'aye', text: 'aye', href: 'Stuff' }]}>
        boo
      </SectionMessage>,
    );
    const btn = wrapper.find(Button);
    expect(btn.length).toBe(1);
    expect(btn.prop('appearance')).toBe('link');
    expect(btn.prop('href')).toBe('Stuff');
    expect(btn.prop('children')).toBe('aye');
  });

  it('should render a button using a custom component', () => {
    const Custom = styled.a``;
    const wrapper = mount(
      <SectionMessage
        linkComponent={Custom}
        actions={[{ key: 'aye', text: 'aye', href: 'Stuff' }]}
      >
        boo
      </SectionMessage>,
    );
    expect(wrapper.find(Button).find(Custom).length).toBe(1);
  });

  it('should accept a custom icon to use', () => {
    const wrapper = mount(
      <SectionMessage icon={WarningIcon}>boo</SectionMessage>,
    );
    expect(wrapper.find(InfoIcon).length).toBe(0);
    expect(wrapper.find(WarningIcon).length).toBe(1);
  });

  cases(
    'appearances',
    ({ type, icon }: { type: Appearance; icon: string }) => {
      const wrapper = shallow(
        <SectionMessage appearance={type}>boo</SectionMessage>,
      );

      const foundIcon = wrapper.find(icon);
      expect(foundIcon.length).toBe(1);
    },
    appearancesCase,
  );

  describe('styled rule', () => {
    it('should have background color and default color', () => {
      expect(shallow(<SectionMessage>test</SectionMessage>)).toHaveStyleRule(
        'background-color',
        '#DEEBFF',
      );
    });
  });
});
