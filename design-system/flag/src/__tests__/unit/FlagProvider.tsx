import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import {
  CreateFlagArgs,
  DismissFn,
  FlagsProvider,
  useFlags,
} from '../../index';

jest.mock('@atlaskit/motion', () => {
  const actualMotion = jest.requireActual('@atlaskit/motion');
  return {
    ...actualMotion,
    ExitingPersistence: ({ children }: any) => children,
  };
});

const getUniqueId = (() => {
  let count: number = 0;
  return () => `flag-provider-unique-id:${count++}`;
})();

const Consumer: React.FC<Partial<CreateFlagArgs>> = (props) => {
  const { showFlag } = useFlags();
  const show = (): void => {
    showFlag({
      id: getUniqueId(),
      title: 'title',
      description: 'description',
      icon: <div></div>,
      testId: 'flag',
      ...props,
    });
  };
  return (
    <>
      <button type="button" onClick={show}>
        show
      </button>
    </>
  );
};

describe('flag provider', () => {
  it('should render children', () => {
    const { getByText } = render(<FlagsProvider>child</FlagsProvider>);
    expect(getByText('child')).toBeDefined();
  });

  it('should render 3 flags', () => {
    const { queryAllByText, getByText } = render(
      <FlagsProvider>
        <Consumer />
      </FlagsProvider>,
    );
    const showFlagButton = getByText('show');
    act(() => {
      fireEvent.click(showFlagButton);
      fireEvent.click(showFlagButton);
      fireEvent.click(showFlagButton);
    });

    expect(queryAllByText('title')).toHaveLength(3);
  });

  it('should dismiss the 2nd flag and only render 1 when directly closing the flag', () => {
    jest.useFakeTimers();
    const { queryAllByText, getByText, getByTestId } = render(
      <FlagsProvider>
        <Consumer />
      </FlagsProvider>,
    );
    const showFlagButton = getByText('show');
    act(() => {
      fireEvent.click(showFlagButton);
      fireEvent.click(showFlagButton);
    });
    act(() => {
      fireEvent.click(getByTestId('flag-dismiss'));
    });

    act(() => jest.runAllTimers());
    expect(queryAllByText('title')).toHaveLength(1);
    jest.useRealTimers();
  });
});

describe('flags-renderer', () => {
  it('should render two flags', () => {
    let showFlag: (args: CreateFlagArgs) => DismissFn = () => () => {};
    function App() {
      const result = useFlags();
      showFlag = result.showFlag;
      return null;
    }
    const { queryAllByText } = render(
      <FlagsProvider>
        <App />
      </FlagsProvider>,
    );
    act(() => {
      showFlag({
        title: 'title1',
        icon: <div></div>,
      });
      showFlag({
        title: 'title2',
        icon: <div></div>,
      });
    });
    expect(queryAllByText(/title/)).toHaveLength(2);
  });

  it('should dismiss the first flag', () => {
    let showFlag: (args: CreateFlagArgs) => DismissFn = () => () => {};
    function App() {
      const result = useFlags();
      showFlag = result.showFlag;
      return null;
    }

    const { getByText, queryAllByText } = render(
      <FlagsProvider>
        <App />
      </FlagsProvider>,
    );
    let dismissFirstFlag: DismissFn = () => {};
    act(() => {
      dismissFirstFlag = showFlag({
        id: 'id1',
        title: 'title1',
        icon: <div></div>,
      });
      showFlag({
        id: 'id2',
        title: 'title2',
        icon: <div></div>,
      });
    });
    act(() => {
      dismissFirstFlag();
    });
    expect(queryAllByText(/title/)).toHaveLength(1);
    expect(getByText('title2')).toBeDefined();
  });

  it('should dismiss the second flag', () => {
    let showFlag: (args: CreateFlagArgs) => DismissFn = () => () => {};
    function App() {
      const result = useFlags();
      showFlag = result.showFlag;
      return null;
    }
    const { getByText, queryAllByText } = render(
      <FlagsProvider>
        <App />
      </FlagsProvider>,
    );
    act(() => {
      showFlag({
        title: 'title1',
        icon: <div></div>,
      });
      const dismissFlag = showFlag({
        title: 'title2',
        icon: <div></div>,
      });
      dismissFlag();
    });
    expect(queryAllByText(/title/)).toHaveLength(1);
    expect(getByText('title1')).toBeDefined();
  });

  it('should not submit multiple flags if the id is a duplicate', () => {
    let showFlag: (args: CreateFlagArgs) => DismissFn = () => () => {};
    function App() {
      const result = useFlags();
      showFlag = result.showFlag;
      return null;
    }
    const { queryAllByText } = render(
      <FlagsProvider>
        <App />
      </FlagsProvider>,
    );
    act(() => {
      showFlag({
        id: 'duplicate-id',
        title: 'title1',
        icon: <div></div>,
      });
      showFlag({
        id: 'duplicate-id',
        title: 'title2',
        icon: <div></div>,
      });
    });
    expect(queryAllByText(/title/)).toHaveLength(1);
  });
});
