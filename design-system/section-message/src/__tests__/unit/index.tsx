import React from 'react';

import {
  cleanup,
  fireEvent,
  queryByAttribute,
  render,
} from '@testing-library/react';
import cases from 'jest-in-case';
import styled from 'styled-components';

import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import InfoIcon from '@atlaskit/icon/glyph/info';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { h500 } from '@atlaskit/theme/typography';

import SectionMessage from '../../index';
import { Appearance } from '../../types';

const mockConsoleErrorListener = jest.spyOn(console, 'error').mockReturnValue();
const appearancesCases = [
  {
    name: 'info',
    backgroundColor: '#DEEBFF',
    icon: (props: {}) => <InfoIcon {...props} label="info" />,
  },
  {
    name: 'warning',
    backgroundColor: '#FFFAE6',
    icon: (props: {}) => <WarningIcon {...props} label="warning" />,
  },
  {
    name: 'error',
    backgroundColor: '#FFEBE6',
    icon: (props: {}) => <ErrorIcon {...props} label="error" />,
  },
  {
    name: 'confirmation',
    backgroundColor: '#E3FCEF',
    icon: (props: {}) => <CheckCircleIcon {...props} label="confirmation" />,
  },
  {
    name: 'change',
    backgroundColor: '#EAE6FF',
    icon: (props: {}) => <QuestionCircleIcon {...props} label="change" />,
  },
];

const getByHref = queryByAttribute.bind(null, 'href');

beforeEach(() => {
  jest.clearAllMocks();
});
// cleanup can be removed once we move to RTL v9
afterEach(cleanup);

describe('SectionMessage', () => {
  it('should render correct defaults', () => {
    const { getByText } = render(<SectionMessage>boo</SectionMessage>);

    expect(getByText('boo')).toBeInTheDocument();
  });

  it('should render both <Title /> and children if there is a title', () => {
    const { getByText } = render(
      <SectionMessage title="things">boo</SectionMessage>,
    );

    expect(getByText('things')).toBeInTheDocument();
    expect(getByText('boo')).toBeInTheDocument();
  });

  it('should match title style from theme typography', () => {
    const Header = styled.h1`
      ${h500}
    `;
    const { getByText } = render(<Header>Hello</Header>);

    const styles = window.getComputedStyle(getByText('Hello'));

    const { getByText: getByTextForSectionMessage } = render(
      <SectionMessage title="header">boo</SectionMessage>,
    );

    expect(getByTextForSectionMessage('header')).toHaveStyle(
      `
      font-size: ${styles.fontSize};
      font-style: ${styles.fontStyle};
      line-height: ${styles.lineHeight};
      margin: 0 0 8px;
      color: ${styles.color};
      font-weight: ${styles.fontWeight};
      letter-spacing: ${styles.letterSpacing};
     `,
    );
  });

  describe('actions', () => {
    it('should render actions beneath the section message description', () => {
      const aye = { key: 'aye', text: 'aye' };
      const bee = { key: 'bee', text: 'aye' };
      const actions = [aye, bee];
      const { getAllByText } = render(
        <SectionMessage actions={actions}>boo</SectionMessage>,
      );

      expect(getAllByText('aye')).toHaveLength(2);
    });

    it('should use the key provided to actions and not warn about unique "key" prop', () => {
      const Aye = { text: 'aye', key: 'ayeKey' };
      render(<SectionMessage actions={[Aye]}>boo</SectionMessage>);

      expect(mockConsoleErrorListener.mock.calls.length).toBe(0);
    });

    it('should warn about duplicate key prop', () => {
      const aye = { text: 'aye', key: 'ayeKey' };
      const bye = { text: 'bye', key: 'ayeKey' };
      render(<SectionMessage actions={[aye, bye]}>boo</SectionMessage>);

      expect(mockConsoleErrorListener.mock.calls.length).toBe(1);
    });

    it('should render React Nodes as actions', () => {
      const MyAction = () => <span>Hello, World!</span>;
      const Aye = { text: <MyAction />, key: 'greeting' };
      const { getByText } = render(
        <SectionMessage actions={[Aye]}>boo</SectionMessage>,
      );

      expect(getByText('Hello, World!')).toBeInTheDocument();
    });

    it('should render a link when passed an action', () => {
      const { container } = render(
        <SectionMessage
          actions={[
            {
              key: 'aye',
              text: 'aye',
              href: 'https://atlaskit.atlassian.com/',
            },
          ]}
        >
          boo
        </SectionMessage>,
      );

      expect(
        getByHref(container, 'https://atlaskit.atlassian.com/')?.textContent,
      ).toBe('aye');
    });

    it('should render a custom component when an action with href is passed', () => {
      const Custom = (props: {}) => <button {...props}>hello world</button>;
      const { container } = render(
        <SectionMessage
          linkComponent={Custom}
          actions={[
            {
              key: 'aye',
              text: 'aye',
              href: 'https://atlaskit.atlassian.com/',
            },
          ]}
        >
          boo
        </SectionMessage>,
      );

      expect(
        getByHref(container, 'https://atlaskit.atlassian.com/')?.textContent,
      ).toBe('hello world');
    });

    it('should call "onClick" on the click of an action with "onClick" but no "href"', () => {
      const action = { key: 'aye', text: 'aye', onClick: jest.fn() };
      const { getByText } = render(
        <SectionMessage actions={[action]}>boo</SectionMessage>,
      );
      const sectionMsgAction = getByText('aye');
      fireEvent.click(sectionMsgAction);

      expect(action.onClick).toHaveBeenCalledTimes(1);
    });

    it('should NOT render custom component for an action with onClick but no href', () => {
      const action = { key: 'aye', text: 'aye', onClick: jest.fn() };
      const Custom = (props: {}) => <button {...props}>hello world</button>;
      const { queryAllByText } = render(
        <SectionMessage linkComponent={Custom} actions={[action]}>
          boo
        </SectionMessage>,
      );
      const sectionMsgAction = queryAllByText('hello world');

      expect(sectionMsgAction).toHaveLength(0);
    });

    it('should NOT render custom component for action with no onClick and no href', () => {
      const Custom = (props: {}) => <button {...props}>hello world</button>;
      const action = {
        key: 'aye',
        text: 'aye',
      };
      const { queryAllByText } = render(
        <SectionMessage linkComponent={Custom} actions={[action]}>
          boo
        </SectionMessage>,
      );
      const sectionMsgAction = queryAllByText('hello world');

      expect(sectionMsgAction).toHaveLength(0);
    });
  });

  cases(
    'appearances',
    ({
      name,
      icon,
    }: {
      name: Appearance;
      icon: (props: {}) => JSX.Element;
    }) => {
      const { getByLabelText, getAllByRole } = render(
        <SectionMessage icon={icon} appearance={name}>
          boo
        </SectionMessage>,
      );

      const foundIcon = getByLabelText(name);

      expect(foundIcon).toBeInTheDocument();
      expect(
        getAllByRole(
          (content, element) =>
            content === 'presentation' &&
            element.tagName.toLowerCase() === 'svg',
        ),
      ).toHaveLength(1);
    },
    appearancesCases,
  );

  cases(
    'background color styled rule',
    ({
      name,
      backgroundColor,
    }: {
      name: Appearance;
      backgroundColor: string;
    }) => {
      const { getByTestId } = render(
        <SectionMessage testId="section-msg" appearance={name}>
          boo
        </SectionMessage>,
      );
      const sectionMsg = getByTestId('section-msg');

      expect(sectionMsg).toHaveStyle(`background-color:${backgroundColor}`);
    },
    appearancesCases,
  );
});
