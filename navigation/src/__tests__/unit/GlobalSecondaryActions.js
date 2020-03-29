import React, { PureComponent } from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import GlobalSecondaryActions, {
  maxSecondaryItems,
} from '../../components/js/GlobalSecondaryActions';

configure({ adapter: new Adapter() });

const { describe } = window;
const { it } = window;

class Child extends PureComponent {
  render() {
    return <div>Hi there</div>;
  }
}

describe('<GlobalSecondaryActions />', () => {
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockReset();
    spy.mockRestore();
  });

  it('should render secondary items', () => {
    const wrapper = shallow(
      <GlobalSecondaryActions actions={[<Child />, <Child />]} />,
    );

    expect(wrapper.find(Child).length).toBe(2);
  });

  it('should call console.warn if attempting to mount with more than five secondary actions', () => {
    shallow(
      <GlobalSecondaryActions
        actions={[
          <Child />,
          <Child />,
          <Child />,
          <Child />,
          <Child />,
          <Child />,
        ]}
      />,
    );
    expect(spy).toHaveBeenCalled();
  });

  it('should call console.warn if attempting to update with more than five secondary actions', () => {
    const wrapper = shallow(<GlobalSecondaryActions actions={[]} />);
    wrapper.setProps({
      actions: [
        <Child />,
        <Child />,
        <Child />,
        <Child />,
        <Child />,
        <Child />,
      ],
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should only render up to 5 secondary actions', () => {
    const actions = [
      <Child />,
      <Child />,
      <Child />,
      <Child />,
      <Child />,
      <Child />,
    ];
    const wrapper = mount(<GlobalSecondaryActions actions={actions} />);
    const children = wrapper.find(Child);
    expect(children.length).toBe(5);
    expect(spy).toHaveBeenCalledWith(
      `AkGlobalNavigation will only render up to ${maxSecondaryItems} secondary actions.`,
    );
  });
});
