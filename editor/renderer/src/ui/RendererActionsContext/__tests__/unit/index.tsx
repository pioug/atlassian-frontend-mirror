import React from 'react';
import { create, act } from 'react-test-renderer';

import Renderer from '../../../Renderer';
import { initialDoc } from '../../../../__tests__/__fixtures__/initial-doc';
import { RendererActionsContext } from '../../index';

describe('Registering renderer actions', () => {
  it('cannot register two Renderer instances under the same context', () => {
    expect(() => {
      act(() => {
        create(
          <RendererActionsContext>
            <>
              <Renderer document={{ version: 1, ...initialDoc }} />
              <Renderer document={{ version: 1, ...initialDoc }} />
            </>
          </RendererActionsContext>,
        );
      });
    }).toThrowError(
      `Renderer has already been registered! It's not allowed to re-register with another new Renderer instance.`,
    );
  });

  it('can register a single Renderer instance', () => {
    expect(() => {
      act(() => {
        create(
          <RendererActionsContext>
            <Renderer document={{ version: 1, ...initialDoc }} />
          </RendererActionsContext>,
        );
      });
    }).not.toThrowError();
  });

  it('can render multiple Renderers without a wrapping context', () => {
    expect(() => {
      act(() => {
        create(
          <>
            <Renderer document={{ version: 1, ...initialDoc }} />
            <Renderer document={{ version: 1, ...initialDoc }} />
          </>,
        );
      });
    }).not.toThrowError();
  });
});
