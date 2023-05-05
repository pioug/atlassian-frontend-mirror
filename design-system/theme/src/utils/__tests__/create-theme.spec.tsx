import React from 'react';

import { render } from '@testing-library/react';

import { createTheme, ThemeProp } from '../create-theme';

interface TestTokens {
  [index: string]: boolean;
}

describe('createTheme', () => {
  describe('component as a consumer', () => {
    it('should create context with provided tokens', (done) => {
      const Theme = createTheme<TestTokens, void>(() => ({ test: true }));
      render(
        <Theme.Consumer>
          {(tokens) => {
            expect(tokens.test).toBe(true);
            done();
            return null;
          }}
        </Theme.Consumer>,
      );
    });
  });

  describe('component as a provider', () => {
    it('should be capable to override theme tokens', (done) => {
      const Theme = createTheme(() => ({
        test1: true,
        test2: false,
      }));
      render(
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
  });

  interface TestProps {
    hasDefault?: boolean;
    hasContext?: boolean;
    isSupplied?: boolean;
  }

  describe('cascade order', () => {
    it('should respect the deepest (closest to the content warpper) theme provider context', (done) => {
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
      const supplied: ThemeProp<TestTokens, TestProps> = (
        themeContext,
        props,
      ) => {
        expect(themeContext(props)).toEqual({
          hasDefault: undefined,
          hasContext: true,
        });
        return { isSupplied: true };
      };

      render(
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
  });
});
