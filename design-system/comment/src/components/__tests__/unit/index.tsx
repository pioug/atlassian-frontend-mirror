import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import Avatar from '@atlaskit/avatar';
import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import Lozenge from '@atlaskit/lozenge';
import Button from '@atlaskit/button';

import WarningIcon from '@atlaskit/icon/glyph/warning';

import Comment, {
  CommentAction,
  CommentAuthor,
  CommentEdited,
  CommentLayout,
  CommentTime,
} from '../../..';
import { ActionsContainer } from '../../../styled/FooterStyles';
import { TopItem } from '../../../styled/HeaderStyles';
import { Container, Highlight } from '../../../styled/LayoutStyles';
import { Content } from '../../../styled/CommentStyles';
import HeaderItems from '../../Header';

describe('@atlaskit comments', () => {
  describe('Comment', () => {
    describe('exports', () => {
      it('the Comment component', () => {
        expect(Comment).not.toBe(undefined);
        expect(new Comment({ avatar: undefined })).toBeInstanceOf(Component);
      });
    });

    describe('construction', () => {
      it('should be able to create a component', () => {
        const wrapper = shallow(<Comment avatar="" />);
        expect(wrapper).not.toBe(undefined);
        expect(wrapper.instance()).toBeInstanceOf(Component);
      });
    });

    describe('props', () => {
      describe('actions prop', () => {
        it('should render action items in the correct container', () => {
          const actions = [
            <CommentAction />,
            <CommentAction>action content</CommentAction>,
            <CommentAction onClick={() => {}}>action content</CommentAction>,
          ];
          const wrapper = mount(<Comment avatar="" actions={actions} />);
          const container = wrapper.find(ActionsContainer);
          expect(container.find(CommentAction).length).toBe(actions.length);
          actions.forEach(action => {
            expect(container.contains(action)).toBe(true);
          });
        });
      });

      describe('author prop', () => {
        it('should render the author in the correct container', () => {
          const author = <CommentAuthor>Joshua Nelson</CommentAuthor>;
          const wrapper = mount(<Comment avatar="" author={author} />);
          expect(wrapper.find(Container).contains(author)).toBe(true);
        });
      });

      describe('avatar prop', () => {
        it('should be reflected to the CommentLayout', () => {
          const avatar = <Avatar src="test/src" label="test label" />;
          const wrapper = shallow(<Comment avatar={avatar} />);
          expect(wrapper.find(CommentLayout).prop('avatar')).toBe(avatar);
        });
      });

      describe('content prop', () => {
        it('should render the provided content in the correct container', () => {
          const content = <p>My sample content</p>;
          const wrapper = mount(<Comment avatar="" content={content} />);
          expect(wrapper.find(Content).contains(content)).toBe(true);
        });

        it('can render string content', () => {
          const textContent = 'My sample content';
          const wrapper = mount(<Comment avatar="" content={textContent} />);
          expect(wrapper.find(Content).text()).toBe(textContent);
        });
      });

      describe('afterContent prop', () => {
        it('should render "after content" when provided', () => {
          const content = <p>My sample content</p>;
          const afterContent = <button>My sample after content</button>;
          const wrapper = mount(
            <Comment avatar="" content={content} afterContent={afterContent} />,
          );
          expect(wrapper.contains(content)).toBe(true);
          expect(wrapper.contains(afterContent)).toBe(true);
        });
      });

      describe('time prop', () => {
        it('should render the time in the correct container', () => {
          const time = <CommentTime>30 August, 2016</CommentTime>;
          const wrapper = mount(<Comment avatar="" time={time} />);
          expect(wrapper.find(Container).contains(time)).toBe(true);
        });
      });

      describe('edited prop', () => {
        it('should render edited correctly', () => {
          const edited = <CommentEdited>Edited</CommentEdited>;
          const wrapper = mount(<Comment avatar="" edited={edited} />);
          expect(wrapper.find(Container).contains(edited)).toBe(true);
        });
      });

      describe('type prop', () => {
        it('should render a Lozenge with the type in the correct container', () => {
          const type = 'type';
          const wrapper = mount(<Comment avatar="" type={type} />);
          expect(wrapper.find(TopItem).find(Lozenge).length).toBe(1);
        });
      });

      describe('restrictedTo prop', () => {
        it('should render a Lock icon and restrictedTo text when supplied', () => {
          const wrapper = mount(
            <Comment avatar="" restrictedTo="atlassian-staff" />,
          );
          expect(wrapper.find(LockFilledIcon).length).toBe(1);
          expect(wrapper.text()).toEqual(
            expect.stringMatching('atlassian-staff'),
          );
        });

        it('should not render a Lock icon if restrictedTo prop is not set', () => {
          const wrapper = mount(<Comment avatar="" />);
          expect(wrapper.find(LockFilledIcon).length).toBe(0);
        });
      });

      describe('highlighted prop', () => {
        it('should render a highlight underlay inside the container', () => {
          const wrapper = mount(<Comment avatar="" highlighted />);
          expect(wrapper.find(Highlight).length).toBe(1);
        });
      });

      describe('isSaving and savingText props', () => {
        describe('if isSaving prop is set', () => {
          it('should render the default savingText if no savingText is set', () => {
            const wrapper = mount(<Comment avatar="" isSaving />);
            expect(wrapper.text()).toEqual(
              expect.stringContaining('Sending...'),
            );
          });

          it('should render the savingText text if it is set', () => {
            const wrapper = mount(
              <Comment avatar="" isSaving savingText="Saving..." />,
            );
            expect(wrapper.text()).toEqual(
              expect.stringContaining('Saving...'),
            );
          });

          it('should not render CommentActions', () => {
            const actions = [
              <CommentAction />,
              <CommentAction>action content</CommentAction>,
              <CommentAction onClick={() => {}}>action content</CommentAction>,
            ];
            const wrapper = mount(
              <Comment
                avatar=""
                actions={actions}
                isSaving
                savingText="Saving..."
                isError
                errorActions={actions}
              />,
            );
            expect(wrapper.find(CommentAction).length).toBe(0);
          });

          it('should apply .optimistic-saving-content styles', () => {
            const wrapper = mount(
              <Comment avatar="" isSaving savingText="Saving..." />,
            );
            expect(wrapper.find(Content).prop('isDisabled')).toBe(true);
          });
        });

        describe('if isSaving prop is not set', () => {
          it('should not render savingText', () => {
            const wrapper = mount(<Comment avatar="" savingText="Saving..." />);
            expect(wrapper.text()).not.toEqual(
              expect.stringContaining('Saving...'),
            );
          });

          it('should not apply .optimistic-saving-content styles', () => {
            const wrapper = mount(<Comment avatar="" savingText="Saving..." />);
            expect(wrapper.find(Content).prop('isDisabled')).toBe(false);
          });
        });
      });

      describe('isError, errorActions and errorLabel props', () => {
        const errorActions = [
          <CommentAction>Retry</CommentAction>,
          <CommentAction onClick={() => {}}>Cancel</CommentAction>,
        ];

        describe('if isError prop is set', () => {
          it('should render the default (empty) if no errorIconLabel is set', () => {
            const wrapper = mount(
              <Comment avatar="" isError errorActions={errorActions} />,
            );
            expect(wrapper.find(WarningIcon).length).toBe(1);
            expect(
              wrapper
                .find(WarningIcon)
                .at(0)
                .prop('label'),
            ).toBe('');
          });

          it('should render the errorIconLabel text if it is set', () => {
            const label = 'Error';
            const wrapper = mount(
              <Comment
                avatar=""
                isError
                errorActions={errorActions}
                errorIconLabel={label}
              />,
            );
            expect(wrapper.find(WarningIcon).length).toBe(1);
            expect(
              wrapper
                .find(WarningIcon)
                .at(0)
                .prop('label'),
            ).toBe(label);
          });

          it('should render the icon and errorActions instead of the actions', () => {
            const actions = [
              <CommentAction />,
              <CommentAction>action content</CommentAction>,
              <CommentAction onClick={() => {}}>action content</CommentAction>,
            ];
            const wrapper = mount(
              <Comment
                avatar=""
                actions={actions}
                isError
                errorActions={errorActions}
              />,
            );
            expect(wrapper.find(CommentAction).length).toBe(2);
            const actionItems = wrapper.find(ActionsContainer);
            expect(actionItems.find(WarningIcon).length).toBe(1);
            expect(
              actionItems
                .find(Button)
                .at(0)
                .text(),
            ).toContain('Retry');
            expect(
              actionItems
                .find(Button)
                .at(1)
                .text(),
            ).toBe('Cancel');
          });

          it('should apply .optimistic-saving-content styles', () => {
            const wrapper = mount(<Comment avatar="" isError />);
            expect(wrapper.find(Content).prop('isDisabled')).toBe(true);
          });
        });

        describe('if isError prop is not set', () => {
          it('should not render the icon and errorActions', () => {
            const wrapper = mount(
              <Comment avatar="" errorActions={errorActions} />,
            );
            expect(wrapper.find(WarningIcon).length).toBe(0);
            expect(wrapper.find(CommentAction).length).toBe(0);
          });

          it('should not apply .optimistic-saving-content styles', () => {
            const wrapper = mount(<Comment avatar="" />);
            expect(wrapper.find(Content).prop('isDisabled')).toBe(false);
          });
        });
      });

      describe('Top items', () => {
        it('Should render in the order author, type, time, restrictedTo', () => {
          const time = <CommentTime>30 August, 2016</CommentTime>;
          const wrapper = mount(
            <Comment
              author="Mary"
              avatar=""
              type="Type"
              time={time}
              restrictedTo="atlassian-staff"
            />,
          );
          const headerItems = wrapper.find(HeaderItems);
          expect(headerItems.props().author).toBe('Mary');
          expect(headerItems.props().restrictedTo).toBe('atlassian-staff');
          expect(headerItems.props().type).toContain('Type');
          expect(headerItems.find(CommentTime).text()).toContain(
            '30 August, 2016',
          );
        });

        it('Should render in the order author, type, savingText, restrictedTo', () => {
          const wrapper = mount(
            <Comment
              author="Mary"
              avatar=""
              type="Type"
              restrictedTo="atlassian-staff"
              isSaving
              savingText="Saving..."
            />,
          );
          expect(wrapper.find(CommentLayout).text()).toEqual(
            expect.stringContaining('Saving...'),
          );
        });

        it('should not render time if isSaving is set', () => {
          const time = <CommentTime>30 August, 2016</CommentTime>;
          const wrapper = mount(
            <Comment
              avatar=""
              author="Mary"
              type="Type"
              time={time}
              restrictedTo="atlassian-staff"
              isSaving
              savingText="Saving..."
            />,
          );
          expect(wrapper.find(CommentTime).length).toBe(0);
          expect(wrapper.text()).toEqual(expect.stringContaining('Saving...'));
        });
      });
    });

    describe('nesting', () => {
      it('should reflect children to the CommentLayout', () => {
        const childComment = <Comment avatar="" content="child" />;
        const wrapper = shallow(
          <Comment avatar="" content="parent'">
            {childComment}
          </Comment>,
        );
        expect(wrapper.find(CommentLayout).prop('children')).toBe(childComment);
      });
    });
  });
});
