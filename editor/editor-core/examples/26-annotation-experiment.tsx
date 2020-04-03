import React from 'react';
import WithEditorActions from './../src/ui/WithEditorActions';
import { exampleDocumentWithComments } from '../example-helpers/example-doc-with-comments';
import { ExampleInlineCommentComponent } from '../../editor-test-helpers/src';
import {
  default as FullPageExample,
  SaveAndCancelButtons,
} from './5-full-page';

type AnnotationCheckboxProps = {
  id: string;
  checked: boolean;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
};
function AnnotationCheckbox(props: AnnotationCheckboxProps) {
  const { id, checked, onChange } = props;
  return (
    <label style={{ display: 'block', lineHeight: '2em' }} htmlFor={id}>
      <input onChange={onChange} type="checkbox" id={id} checked={checked} />
      {id}
    </label>
  );
}

type State = {
  annotationStates: Map<string, boolean>;
};

export default class ExampleAnnotationExperiment extends React.Component<
  any,
  State
> {
  state = {
    pollingInterval: 10000,
    annotationStates: new Map([
      ['12e213d7-badd-4c2a-881e-f5d6b9af3752', false],
      ['9714aedf-5300-43f4-ac10-a2e4326189d2', true],
      ['13272b41-b9a9-427a-bd58-c00766999638', false],
      ['68ac8f3f-2fb6-4720-8439-c9da1f17b0b2', true],
      ['80f91695-4e24-433d-93e1-6458b8bb2415', false],
      ['f963dc2a-797c-445d-9703-9381c82ccf55', true],
      ['be3e7d44-053d-454b-93d2-2575c6fca2c1', false],
      ['abb3279e-109a-4a05-b8b7-111363d81041', true],
      ['98666c34-f666-49be-b17d-d01d112b5c1b', false],
      ['d1257edc-604a-4f8a-b3fa-8e24cbd0894b', false],
      ['75a321e5-ee26-41c2-8ef1-c81849df3f40', false],
      ['eef53b24-17c6-46e8-bab4-6f0b0478e80a', true],
      ['93e89148-ad5c-4bdd-965f-60b91b0e7774', true],
      ['422510e2-3bff-4b67-a87f-e24e3ef38fe0', false],
      ['9704428e-1b22-4bdd-8948-967658fda9b8', true],
      ['a4ca35cb-8964-4f5a-b7ad-101c82c789f4', true],
    ]),
  };

  handleAnnotationChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const id = evt.target.id;
    this.setState((prevState: State) => {
      prevState.annotationStates.set(id, !prevState.annotationStates.get(id));
      return prevState;
    });
  };

  render() {
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '20%', padding: '16px' }}>
          <h3>Resolved Annotations</h3>
          (Document refreshes every 10 seconds)
          {[...this.state.annotationStates.entries()].map(([key, val]) => (
            <AnnotationCheckbox
              id={key}
              key={key}
              checked={val}
              onChange={this.handleAnnotationChange}
            />
          ))}
        </div>
        <div style={{ flex: '80%' }}>
          <FullPageExample
            defaultValue={exampleDocumentWithComments}
            allowHelpDialog
            annotationProvider={{
              component: ExampleInlineCommentComponent,
              providers: {
                inlineComment: {
                  pollingInterval: 10000,
                  getState: async () =>
                    [...this.state.annotationStates.entries()].map(
                      ([id, resolved]) => ({
                        id,
                        state: { resolved },
                        annotationType: 'inlineComment',
                      }),
                    ),
                },
              },
            }}
            primaryToolbarComponents={
              <WithEditorActions
                render={actions => (
                  <React.Fragment>
                    <SaveAndCancelButtons editorActions={actions} />
                  </React.Fragment>
                )}
              />
            }
          />
        </div>
      </div>
    );
  }
}
