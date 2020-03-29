import React from 'react';
import { shallow } from 'enzyme';
import NPS, { FeedbackNPS, FollowUpProps } from '../../NPS';
import { NPSWrapper } from '../../styled/nps';

const createButton = (id: string, fn: () => void) => (
  <button id={id} onClick={fn}>
    {id}
  </button>
);

const rating = 2;
const comment = 'hi';
const role = 'a';
const allowContact = true;

const getDefaultProps = () => ({
  canClose: true,
  canOptOut: true,
  onClose: jest.fn(),
  onOptOut: jest.fn(),
  onRatingSelect: jest.fn(),
  onCommentChange: jest.fn(),
  onRoleSelect: jest.fn(),
  onAllowContactChange: jest.fn(),
  onFeedbackSubmit: jest.fn(),
  onFollowupSubmit: jest.fn(),
  onFinish: jest.fn(),

  renderFeedback: (feedbackProps: FeedbackNPS) => (
    <div id="feedback">
      {createButton('close', () => feedbackProps.onClose())}
      {createButton('opt-out', () => feedbackProps.onOptOut())}
      {createButton('rating-select', () =>
        feedbackProps.onRatingSelect(rating),
      )}
      {createButton('comment-change', () =>
        feedbackProps.onCommentChange(comment),
      )}
      {createButton('submit', () =>
        feedbackProps.onSubmit({ rating, comment }),
      )}
    </div>
  ),
  renderFollowup: (feedbackProps: FollowUpProps) => (
    <div id="followup">
      {createButton('close', () => feedbackProps.onClose())}
      {createButton('opt-out', () => feedbackProps.onOptOut())}
      {createButton('role-select', () => feedbackProps.onRoleSelect(role))}
      {createButton('can-contact-change', () =>
        feedbackProps.onAllowContactChange(allowContact),
      )}
      {createButton('submit', () =>
        feedbackProps.onSubmit({ role, allowContact }),
      )}
    </div>
  ),
  renderThankyou: () => <div id="thankyou">Thanks!</div>,
});

describe('NPS', () => {
  it('should render an NPSWrapper', () => {
    const wrapper = shallow(<NPS {...getDefaultProps()} />);
    expect(wrapper.find(NPSWrapper).exists()).toBe(true);
  });

  it('should render the feedback page first', () => {
    const wrapper = shallow(<NPS {...getDefaultProps()} />);
    expect(wrapper.find('#feedback').exists()).toBe(true);
  });

  it('should render the followup page after submitting the feedback page', () => {
    const wrapper = shallow(<NPS {...getDefaultProps()} />);
    expect(wrapper.find('#followup').exists()).toBe(false);
    wrapper.find('#feedback #submit').simulate('click');
    expect(wrapper.find('#followup').exists()).toBe(true);
  });

  it('should render the thankyou page after submitting the followup page', () => {
    const wrapper = shallow(<NPS {...getDefaultProps()} />);

    expect(wrapper.find('#feedback').exists()).toBe(true);
    expect(wrapper.find('#followup').exists()).toBe(false);

    wrapper.find('#feedback #submit').simulate('click');
    expect(wrapper.find('#feedback').exists()).toBe(false);
    expect(wrapper.find('#followup').exists()).toBe(true);

    wrapper.find('#followup #submit').simulate('click');
    expect(wrapper.find('#followup').exists()).toBe(false);
    expect(wrapper.find('#thankyou').exists()).toBe(true);
  });

  it('should call onRatingSelect prop when rating is selected', () => {
    const props = getDefaultProps();
    const wrapper = shallow(<NPS {...props} />);
    wrapper.find('#feedback #rating-select').simulate('click');
    expect(props.onRatingSelect).toHaveBeenCalledWith(2);
  });

  it('should call onCommentChange prop when comment changes', () => {
    const props = getDefaultProps();
    const wrapper = shallow(<NPS {...props} />);
    wrapper.find('#feedback #comment-change').simulate('click');
    expect(props.onCommentChange).toHaveBeenCalledWith('hi');
  });

  it('should call onFeedbackSubmit prop when feedback page is submitted', () => {
    const props = getDefaultProps();
    const wrapper = shallow(<NPS {...props} />);
    wrapper.find('#feedback #submit').simulate('click');
    expect(props.onFeedbackSubmit).toHaveBeenCalledWith({
      rating,
      comment,
      role: null,
      allowContact: false,
    });
  });

  it('should call onRoleSelect prop when role selected', () => {
    const props = getDefaultProps();
    const wrapper = shallow(<NPS {...props} />);
    wrapper.find('#feedback #submit').simulate('click');
    wrapper.find('#followup #role-select').simulate('click');
    expect(props.onRoleSelect).toHaveBeenCalledWith(role);
  });

  it('should call onAllowContactChange prop when allowContact is changed', () => {
    const props = getDefaultProps();
    const wrapper = shallow(<NPS {...props} />);
    wrapper.find('#feedback #submit').simulate('click');
    wrapper.find('#followup #can-contact-change').simulate('click');
    expect(props.onAllowContactChange).toHaveBeenCalledWith(allowContact);
  });

  it('should call onFollowupSubmit prop when followup page is submitted', () => {
    const props = getDefaultProps();
    const wrapper = shallow(<NPS {...props} />);
    wrapper.find('#feedback #submit').simulate('click');
    wrapper.find('#followup #submit').simulate('click');
    expect(props.onFollowupSubmit).toHaveBeenCalledWith({
      rating,
      comment,
      role,
      allowContact,
    });
  });

  it('should call onFinish prop when followup page is submitted', () => {
    const props = getDefaultProps();
    const wrapper = shallow(<NPS {...props} />);
    wrapper.find('#feedback #submit').simulate('click');
    wrapper.find('#followup #submit').simulate('click');
    expect(props.onFinish).toHaveBeenCalledWith({
      rating,
      comment,
      role,
      allowContact,
    });
  });
});
