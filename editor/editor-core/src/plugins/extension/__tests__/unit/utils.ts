import * as pmUtils from 'prosemirror-utils';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';

import { getSelectedDomElement } from '../../utils';

describe('getSelectedDomElement', () => {
  const root = document.createElement('div');
  root.innerHTML = `
    <div id="bodiedExtension">
      <div>
        <div id="outerContainer" class="extension-container">
          <div id="insideBodiedExtension">
            <div id="extension">
              <div>
                <div id="innerContainer" class="extension-container">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <div>
  `;

  beforeAll(() => {
    root.id = 'root';
    // Need it for our custom closestElement
    document.body.append(root);
  });

  afterAll(() => {
    document.getElementById('#root')?.remove();
  });

  describe('extension', () => {
    it('should return inner extension-container when selected', () => {
      const container = root.querySelector('#innerContainer')!;
      jest
        .spyOn(pmUtils, 'findDomRefAtPos')
        .mockImplementation(() => root.querySelector('#extension')!);

      const sel = getSelectedDomElement(
        defaultSchema,
        {} as any,
        {
          node: defaultSchema.nodes.extension.createAndFill(),
        } as any,
      );

      expect(sel).toEqual(container);
    });

    it('should return outer extension-container when bodied extension is selected', () => {
      const container = root.querySelector('#outerContainer')!;
      jest
        .spyOn(pmUtils, 'findDomRefAtPos')
        .mockImplementation(
          () => root.querySelector('#insideBodiedExtension')!,
        );

      const sel = getSelectedDomElement(
        defaultSchema,
        {} as any,
        {
          node: { type: defaultSchema.nodes.bodiedExtension },
        } as any,
      );

      expect(sel).toEqual(container);
    });
  });

  describe('bodiedExtension', () => {
    it('should return outer extension-container when selected', () => {
      const container = root.querySelector('#outerContainer')!;
      jest
        .spyOn(pmUtils, 'findDomRefAtPos')
        .mockImplementation(() => root.querySelector('#bodiedExtension')!);

      const sel = getSelectedDomElement(
        defaultSchema,
        {} as any,
        {
          node: { type: defaultSchema.nodes.bodiedExtension },
        } as any,
      );

      expect(sel).toEqual(container);
    });
  });
});
