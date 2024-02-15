import React, { FunctionComponent, useEffect, useState } from 'react';

import { Subject } from 'rxjs/Subject';

import { PortalActions } from '../../ui/jql-editor-portal-provider/types';
import { PluginContainerKey } from '../types';

/**
 * Abstract class for Prosemirror plugin views which need to mount a React component. Concrete subclasses must implement
 * {@link ReactPluginView#getComponent} which specifies the React component to render, along with
 * {@link ReactPluginView#getInitialComponentProps} which returns any props to pass to the component on initial render.
 *
 * After the class is constructed, the caller must invoke {@link ReactPluginView#init} in order to mount the component.
 *
 * If there are external changes which the component needs to respond to, {@link ReactPluginView#componentSubject} can
 * be used to trigger a re-render of the component with updated props. For example:
 * ```
 * update = (view: EditorView) => {
 *   this.componentSubject.next(this.getComponentProps(view));
 * };
 *
 * getComponentProps = (view: EditorView) => {
 *   // Some logic to get props from the Prosemirror view
 * }
 * ```
 */
export default abstract class ReactPluginView<ComponentProps extends {}> {
  protected readonly componentSubject: Subject<ComponentProps> =
    new Subject<ComponentProps>();
  private readonly portalActions: PortalActions;
  private readonly portalKey: string;
  private readonly containerKey: PluginContainerKey;

  /**
   * Construct a Prosemirror plugin view which will render a React component in a portal.
   *
   * @param portalActions Provides callback functions which can be invoked to create and destroy a portal.
   * @param portalKey Unique identifier for the plugin component.
   * @param containerKey Key representing the HTML container the React component will be portalled into.
   * @protected
   */
  protected constructor(
    portalActions: PortalActions,
    portalKey: string,
    containerKey: PluginContainerKey,
  ) {
    this.portalActions = portalActions;
    this.portalKey = portalKey;
    this.containerKey = containerKey;
  }

  init = () => {
    const Component = this.getComponent();

    const PortallingComponent = () => {
      const [state, setState] = useState<ComponentProps>(() =>
        this.getInitialComponentProps(),
      );

      useEffect(() => {
        // Subscribe to the RxJS subject so concrete subclasses can emit events to re-render the plugin component.
        const subscription = this.componentSubject.subscribe(updatedProps => {
          setState(updatedProps);
        });

        return () => subscription.unsubscribe();
      }, []);

      return <Component {...state} />;
    };

    // Dispatch onCreatePortal which will allow the handler to create a new portalled React component
    this.portalActions.onCreatePortal(
      this.portalKey,
      <PortallingComponent />,
      this.containerKey,
    );
  };

  destroy() {
    // Dispatch onDestroyPortal which will allow the handler to remove the portalled React component.
    this.portalActions.onDestroyPortal(this.portalKey);
  }

  /**
   * Return a React component to render for the plugin.
   */
  protected abstract getComponent: () => FunctionComponent<ComponentProps>;

  /**
   * Return props to set on the component for initial render.
   */
  protected abstract getInitialComponentProps: () => ComponentProps;
}
