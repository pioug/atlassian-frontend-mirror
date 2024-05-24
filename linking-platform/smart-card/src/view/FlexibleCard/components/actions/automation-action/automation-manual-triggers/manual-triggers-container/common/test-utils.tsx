import React, { Component, type ReactElement, type ComponentProps, Fragment } from 'react';

import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { DiProvider } from 'react-magnetic-di';

import type {
  Ari,
  Environment,
  InvocationResponse,
  InvocationResult,
  UserInputs,
} from './types';
import { IntlProvider } from 'react-intl-next';


/**
 * Creates a stubbed invocation API call for triggering rules. Will return
 * the supplied invocation result for all objects the rule was called
 * for.
 */
export const createStubInvokeManuallyTriggeredRule =
  (
    stubbedInvocationResultForAllObjects: InvocationResult,
    responseDelay?: number,
  ) =>
  async (
    _env: Environment | null,
    _site: Ari,
    _ruleId: number,
    objects: string[],
    _inputs?: UserInputs,
  ): Promise<InvocationResponse> => {
    const response = objects.reduce(
      (acc, current) => ({
        ...acc,
        [current]: stubbedInvocationResultForAllObjects,
      }),
      {},
    );

    return responseDelay
      ? new Promise(resolve => setTimeout(resolve, responseDelay))
      : Promise.resolve(response);
  };

/**
 * Default stubbed invokeManuallyTriggeredRule call. Returns 'SUCCESS' for
 * all objects the rule was called for.
 */
export const successStubInvokeManuallyTriggeredRule =
  createStubInvokeManuallyTriggeredRule('SUCCESS', 2000);

const Provider = ({
    children,
    use,
    target,
}: JSX.LibraryManagedAttributes<typeof DiProvider, ComponentProps<typeof DiProvider>>) => (
    <IntlProvider locale="en">
        <DiProvider use={use} target={target}>
            {children}
        </DiProvider>
    </IntlProvider>
);

/**
 * Render into a container which is appended to `document.body`.
 *
 * Includes `IntlProvider` wrapper
 *
 * @param node The React element to render
 * @param dependencies List of React Magnetic DI dependencies to inject
 * @param options React Testing Library options
 */
export const renderWithDi = (
    node: ReactElement,
    dependencies: any[] = [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: RenderOptions & { target?: any },
): RenderResult =>
    render(node, {
        ...options,
        wrapper({ children }) {
            const CustomWrapper = options?.wrapper ?? Fragment;
            return (
                <Provider use={[ ...dependencies]} target={options?.target}>
                    <CustomWrapper>{children}</CustomWrapper>
                </Provider>
            );
        },
    });

export const createGenericComponent = <T extends any = any>(
  displayName: string,
  renderChildren: boolean = true,
  childrenParams?: unknown,
): T =>
  class extends Component<any> {
    static displayName = displayName;

    render() {
      if (renderChildren && typeof this.props.children === 'function') {
        if (childrenParams) {
          return this.props.children(childrenParams);
        }
        return this.props.children();
      }
      if (renderChildren && this.props.children) {
        return this.props.children;
      }
      return null;
    }
  } as T;
