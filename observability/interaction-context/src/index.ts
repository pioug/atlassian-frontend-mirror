import { createContext } from 'react';

export interface InteractionContextType {
  /**
   * Hold a in-progress interaction
   *
   * Usage:
   * ```
   * function MyLoading(){
   *     const context = useContext(InteractionContext);
   *
   *     useLayoutEffect(() => {
   *       if (!context) {
   *         return context.hold(name)
   *       }
   *     }, [context, name]);
   *
   *     return <Spinner />
   * }
   *
   * ```
   */
  hold(name: string | undefined): void | (() => void);

  /**
   * Trace a press event
   * Measures from your trigger (e.g. a button click)
   *
   * Usage:
   * ```
   * function MyComponent(){
   *     const context = useContext(InteractionContext)
   *
   *     const onClick = (event: MouseEvent) => {
   *       context.tracePress('event', event.timeStamp)
   *       // handling the click event
   *     };
   *
   *     return <Button onClick={onClick} />
   * }
   *
   * ```
   * Pass along the timeStamp from the original event if you have one - We need it
   * to measure input delay
   */
  tracePress(name: string | undefined, timestamp?: number): void;
}

export default createContext<InteractionContextType | null>(null);
