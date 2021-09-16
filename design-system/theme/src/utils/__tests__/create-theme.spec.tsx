import React from 'react';

import { mount } from 'enzyme';

import { createTheme, ThemeProp } from '../create-theme';

interface TestTokens {
  [index: string]: boolean;
}

test('component as a consumer', (done) => {
  const Theme = createTheme<TestTokens, void>(() => ({ test: true }));
  mount(
    <Theme.Consumer>
      {(tokens) => {
        expect(tokens.test).toBe(true);
        done();
        return null;
      }}
    </Theme.Consumer>,
  );
});

test('component as a provider (uses composition)', (done) => {
  const Theme = createTheme(() => ({
    test1: true,
    test2: false,
  }));
  mount(
    <Theme.Provider
      value={(theme) => ({
        ...theme({}),
        test2: true,
      })}
    >
      <Theme.Consumer>
        {(tokens) => {
          expect(tokens.test1).toBe(true);
          expect(tokens.test2).toBe(true);
          done();
          return null;
        }}
      </Theme.Consumer>
    </Theme.Provider>,
  );
});

interface TestProps {
  hasDefault?: boolean;
  hasContext?: boolean;
  isSupplied?: boolean;
}

test('cascade order', (done) => {
  const Theme = createTheme<TestTokens, TestProps>(() => {
    return { hasDefault: true };
  });
  const context: ThemeProp<TestTokens, TestProps> = (
    themehasDefault,
    props,
  ) => {
    expect(themehasDefault(props)).toEqual({ hasDefault: true });
    return { hasContext: true };
  };
  const supplied: ThemeProp<TestTokens, TestProps> = (themeContext, props) => {
    expect(themeContext(props)).toEqual({
      hasDefault: undefined,
      hasContext: true,
    });
    return { isSupplied: true };
  };
  mount(
    <Theme.Provider value={context}>
      <Theme.Provider value={supplied}>
        <Theme.Consumer>
          {(tokens) => {
            expect(tokens).toEqual({
              hasDefault: undefined,
              hasContext: undefined,
              isSupplied: true,
            });
            done();
            return null;
          }}
        </Theme.Consumer>
      </Theme.Provider>
    </Theme.Provider>,
  );
});
