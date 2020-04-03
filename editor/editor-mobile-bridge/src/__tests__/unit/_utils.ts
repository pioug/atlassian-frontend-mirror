import { EditorViewWithComposition } from '../../types';

const InputEvent = (window as any).InputEvent;

const androidCompose = (view: EditorViewWithComposition, events: Event[]) =>
  events.forEach(event => view.dom.dispatchEvent(event));

export function androidComposeStart(
  view: EditorViewWithComposition,
  data?: string,
) {
  return androidCompose(view, [
    new CompositionEvent('compositionstart'),
    new InputEvent('beforeinput', {
      data,
      isComposing: true,
      inputType: 'insertCompositionText',
    }),
    new CompositionEvent('compositionupdate', {
      data,
    }),
    new InputEvent('input', {
      data,
      isComposing: true,
      inputType: 'insertCompositionText',
    }),
  ]);
}

export function androidComposeContinue(
  view: EditorViewWithComposition,
  data: string,
) {
  return androidCompose(view, [
    new InputEvent('beforeinput', {
      data,
      isComposing: true,
      inputType: 'insertCompositionText',
    }),
    new CompositionEvent('compositionupdate', {
      data,
    }),
    new InputEvent('input', {
      data,
      isComposing: true,
      inputType: 'insertCompositionText',
    }),
  ]);
}

export function androidComposeEnd(
  view: EditorViewWithComposition,
  data: string,
) {
  return androidCompose(view, [
    new CompositionEvent('compositionend', {
      data,
    } as CompositionEvent),
  ]);
}
