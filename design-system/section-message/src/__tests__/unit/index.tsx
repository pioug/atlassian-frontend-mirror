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

import SectionMessage, { SectionMessageAction } from '../../index';
import { Appearance } from '../../types';

const appearancesCases: {
  name: Appearance;
  backgroundColor: string;
  icon: ({}) => JSX.Element;
}[] = [
  {
    name: 'information',
    backgroundColor: '#DEEBFF',
    icon: (props: {}) => <InfoIcon {...props} label="information" />,
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
    name: 'success',
    backgroundColor: '#E3FCEF',
    icon: (props: {}) => <CheckCircleIcon {...props} label="success" />,
  },
  {
    name: 'discovery',
    backgroundColor: '#EAE6FF',
    icon: (props: {}) => <QuestionCircleIcon {...props} label="discovery" />,
  },
];
const CustomLinkComponent = React.forwardRef(
  (props = {}, ref: React.Ref<HTMLButtonElement>) => (
    <button {...props} ref={ref}>
      hello world
    </button>
  ),
);

const getByHref = queryByAttribute.bind(null, 'href');

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
      const actions = [
        <SectionMessageAction>aye</SectionMessageAction>,
        <SectionMessageAction>aye</SectionMessageAction>,
      ];
      const { getAllByText } = render(
        <SectionMessage actions={actions}>boo</SectionMessage>,
      );

      expect(getAllByText('aye')).toHaveLength(2);
    });

    it('should render React Nodes as actions', () => {
      const MyAction = () => <span>Hello, World!</span>;
      const Aye = (
        <SectionMessageAction>
          <MyAction />
        </SectionMessageAction>
      );
      const { getByText } = render(
        <SectionMessage actions={[Aye]}>boo</SectionMessage>,
      );

      expect(getByText('Hello, World!')).toBeInTheDocument();
    });

    it('should render a link when passed an action', () => {
      const { container } = render(
        <SectionMessage
          actions={
            <SectionMessageAction href="https://atlaskit.atlassian.com/">
              aye
            </SectionMessageAction>
          }
        >
          boo
        </SectionMessage>,
      );

      expect(
        getByHref(container, 'https://atlaskit.atlassian.com/')?.textContent,
      ).toBe('aye');
    });

    it('should render a custom component when an action with href is passed', () => {
      const { container } = render(
        <SectionMessage
          actions={
            <SectionMessageAction
              href="https://atlaskit.atlassian.com/"
              linkComponent={CustomLinkComponent}
            >
              aye
            </SectionMessageAction>
          }
        >
          boo
        </SectionMessage>,
      );

      expect(
        getByHref(container, 'https://atlaskit.atlassian.com/')?.textContent,
      ).toBe('hello world');
    });

    it('should call "onClick" on the click of an action with "onClick" but no "href"', () => {
      const onClick = jest.fn();
      const action = (
        <SectionMessageAction onClick={onClick}>aye</SectionMessageAction>
      );
      const { getByText } = render(
        <SectionMessage actions={[action]}>boo</SectionMessage>,
      );
      const sectionMsgAction = getByText('aye');
      fireEvent.click(sectionMsgAction);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should NOT render custom component for an action with onClick but no href', () => {
      const onClick = jest.fn();
      const action = (
        <SectionMessageAction
          onClick={onClick}
          linkComponent={CustomLinkComponent}
        >
          aye
        </SectionMessageAction>
      );
      const { queryAllByText } = render(
        <SectionMessage actions={[action]}>boo</SectionMessage>,
      );
      const sectionMsgAction = queryAllByText('hello world');

      expect(sectionMsgAction).toHaveLength(0);
    });

    it('should NOT render custom component for action with no onClick and no href', () => {
      const action = (
        <SectionMessageAction linkComponent={CustomLinkComponent}>
          aye
        </SectionMessageAction>
      );
      const { queryAllByText } = render(
        <SectionMessage actions={[action]}>boo</SectionMessage>,
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
