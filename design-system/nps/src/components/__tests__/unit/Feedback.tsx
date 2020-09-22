import React from 'react';

import { shallow } from 'enzyme';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import FieldTextArea from '@atlaskit/field-text-area';

import { Description, Header } from '../../common';
import Feedback, {
  CommentBox,
  RatingsButtons,
  SendButton,
} from '../../Feedback';
import { ButtonWrapper } from '../../styled/common';
import { Comment } from '../../styled/feedback';

describe('Feedback page', () => {
  describe('Component', () => {
    const getDefaultProps = () => ({
      messages: {
        title: 'A',
        description: 'B',
        optOut: 'C',
        scaleLow: 'D',
        scaleHigh: 'E',
        commentPlaceholder: 'F',
        done: 'G',
      },
      canClose: true,
      canOptOut: true,
      onClose: jest.fn(),
      onOptOut: jest.fn(),
      onRatingSelect: jest.fn(),
      onCommentChange: jest.fn(),
      onSubmit: jest.fn(),
    });

    beforeEach(() => {});
    it('should render a header', () => {
      const props = getDefaultProps();
      const wrapper = shallow(<Feedback {...props} />);
      expect(wrapper.find(Header).exists()).toBe(true);
    });

    it('should render a description', () => {
      const props = getDefaultProps();
      const wrapper = shallow(<Feedback {...props} />);
      const desc = wrapper.find(Description);
      expect(desc.exists()).toBe(true);
      expect(desc.children().first().text()).toEqual(
        props.messages.description,
      );
    });

    it('should render RatingsButtons', () => {
      const props = getDefaultProps();
      const wrapper = shallow(<Feedback {...props} />);
      wrapper.setState({ rating: 2 });

      const ratingsButtons = wrapper.find(RatingsButtons);
      expect(ratingsButtons.exists()).toBe(true);
      expect(ratingsButtons.prop('selected')).toEqual(2);
      ratingsButtons.prop('onRatingSelect')(2);
      expect(props.onRatingSelect).toHaveBeenCalled();
    });

    it('should render a comment box and send button if state.rating is not null', () => {
      const props = getDefaultProps();
      const wrapper = shallow(<Feedback {...props} />);
      wrapper.setState({ rating: 2 });

      const commentBox = wrapper.find(CommentBox);
      expect(commentBox.exists()).toBe(true);
      commentBox.prop('onCommentChange')('a');
      expect(props.onCommentChange).toHaveBeenCalled();

      const sendButton = wrapper.find(SendButton);
      expect(sendButton.exists()).toBe(true);
      sendButton.prop('onClick')();
      expect(props.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          rating: expect.anything(),
          comment: expect.any(String),
        }),
      );
    });

    it('should not render a comment box or send button if state.rating is not null', () => {
      const props = getDefaultProps();
      const wrapper = shallow(<Feedback {...props} />);
      wrapper.setState({ rating: null });
      expect(wrapper.find(CommentBox).exists()).toBe(false);
      expect(wrapper.find(SendButton).exists()).toBe(false);
    });
  });

  describe('CommentBox', () => {
    const placeholder = 'Put ya comment';
    let onCommentChange = () => {};

    beforeEach(() => {
      onCommentChange = jest.fn();
    });

    const getCommentBox = () => (
      <CommentBox placeholder={placeholder} onCommentChange={onCommentChange} />
    );

    it('should render a StyledComment', () => {
      const wrapper = shallow(getCommentBox());
      expect(wrapper.find(Comment).exists()).toBe(true);
    });

    it('should render a FieldTextArea', () => {
      const wrapper = shallow(getCommentBox());
      const el = wrapper.find(Comment).find(FieldTextArea).first();
      expect(el.exists()).toBe(true);
      expect(el.prop('placeholder')).toBe(placeholder);
      el.prop('onChange')({ target: { value: 2 } });
      expect(onCommentChange).toHaveBeenCalled();
    });
  });

  describe('SendButton', () => {
    const label = 'Send';
    let onClick = () => {};

    beforeEach(() => {
      onClick = jest.fn();
    });

    const getSendButton = () => (
      <SendButton sendLabel={label} onClick={onClick} />
    );

    it('should render a ButtonWrapper', () => {
      const wrapper = shallow(getSendButton());
      expect(wrapper.find(ButtonWrapper).exists()).toBe(true);
    });

    it('should render a Button', () => {
      const wrapper = shallow(getSendButton());
      const el = wrapper.find(ButtonWrapper).find(Button).first();
      expect(el.exists()).toBe(true);
      expect(el.prop('onClick')).toBe(onClick);
    });
  });

  describe('RatingsButtons', () => {
    const selected = null;
    let onRatingSelect = () => {};

    beforeEach(() => {
      onRatingSelect = jest.fn();
    });

    const getRatingsButtons = (props?: {}) => (
      <RatingsButtons
        selected={selected}
        onRatingSelect={onRatingSelect}
        {...props}
      />
    );

    it('should render a button group', () => {
      const wrapper = shallow(getRatingsButtons());
      expect(wrapper.find(ButtonGroup).exists()).toBe(true);
    });

    it('should render 11 buttons', () => {
      const wrapper = shallow(getRatingsButtons());
      expect(wrapper.find(Button).getElements().length).toBe(11);
    });

    it('should render no selected button if selected is null', () => {
      const wrapper = shallow(getRatingsButtons());
      expect(wrapper.find(Button).find('[isSelected=true]').exists()).toBe(
        false,
      );
    });

    it('should render one selected button if selected is not null', () => {
      const wrapper = shallow(
        getRatingsButtons({
          selected: 1,
        }),
      );
      expect(
        wrapper.find(Button).find('[isSelected=true]').getElements().length,
      ).toBe(1);
    });

    it('should call onRatingSelect callback when the selected rating is clicked', () => {
      const wrapper = shallow(
        getRatingsButtons({
          selected: 1,
        }),
      );
      expect(onRatingSelect).not.toHaveBeenCalled();
      const selectedButton = wrapper
        .find(Button)
        .find('[isSelected=true]')
        .first();
      selectedButton.simulate('click');
      expect(onRatingSelect).toHaveBeenCalledWith(1);
    });

    it('should call onRatingSelect callback when an unselected rating is clicked', () => {
      const wrapper = shallow(
        getRatingsButtons({
          selected: 1,
        }),
      );
      expect(onRatingSelect).not.toHaveBeenCalled();
      const selectedButton = wrapper.childAt(5);
      selectedButton.simulate('click');
      expect(onRatingSelect).toHaveBeenCalledWith(5);
    });
  });
});
