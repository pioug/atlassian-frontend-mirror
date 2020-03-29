import { mount } from 'enzyme';
import React from 'react';
import { createTheme, ThemeProp } from '../createTheme';

interface TestTokens {
  [index: string]: boolean;
}

test('component as a consumer', done => {
  const Theme = createTheme<TestTokens, any>(() => ({ test: true }));
  mount(
    <Theme.Consumer>
      {(tokens: TestTokens) => {
        expect(tokens.test).toBe(true);
        done();
        return null;
      }}
    </Theme.Consumer>,
  );
});

test('component as a provider (uses composition)', done => {
  const Theme = createTheme(() => ({
    test1: true,
    test2: false,
  }));
  mount(
    <Theme.Provider
      value={theme => ({
        ...theme({}),
        test2: true,
      })}
    >
      <Theme.Consumer>
        {tokens => {
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
  default?: boolean;
  context?: boolean;
  supplied?: boolean;
}

test('cascade order', done => {
  const Theme = createTheme<TestTokens, TestProps>(() => {
    return { default: true };
  });
  const context: ThemeProp<TestTokens, TestProps> = (themeDefault, props) => {
    expect(themeDefault(props)).toEqual({ default: true });
    return { context: true };
  };
  const supplied: ThemeProp<TestTokens, TestProps> = (themeContext, props) => {
    expect(themeContext(props)).toEqual({ default: undefined, context: true });
    return { supplied: true };
  };
  mount(
    <Theme.Provider value={context}>
      <Theme.Provider value={supplied}>
        <Theme.Consumer>
          {tokens => {
            expect(tokens).toEqual({
              default: undefined,
              context: undefined,
              supplied: true,
            });
            done();
            return null;
          }}
        </Theme.Consumer>
      </Theme.Provider>
    </Theme.Provider>,
  );
});
