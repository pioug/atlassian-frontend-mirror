import { State } from '../domain';

export default function serviceConnect(state: State, action: any): State {
  if (action.type === 'SERVICE_CONNECT') {
    const view = (Object as any).assign({}, state.view, {
      connect: { name: action.serviceName },
      path: false,
    });
    return (Object as any).assign({}, state, { view });
  } else {
    return state;
  }
}
