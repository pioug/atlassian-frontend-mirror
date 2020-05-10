import RendererActions from '../../index';

const mockArg = {} as any;
const mockArg2 = {} as any;

describe('RendererActions', () => {
  it(`can't register the same RendererActions instance on more than one ref`, () => {
    const actions = new RendererActions(true);
    actions._privateRegisterRenderer(mockArg, mockArg, mockArg);
    expect(() => {
      actions._privateRegisterRenderer(mockArg2, mockArg2, mockArg2);
    }).toThrowError(
      "Renderer has already been registered! It's not allowed to re-register with another new Renderer instance.",
    );
  });

  it(`no-ops when not init'd from a correct source`, () => {
    const actions = new RendererActions();
    actions._privateRegisterRenderer(mockArg, mockArg, mockArg);
    expect(() => {
      actions._privateRegisterRenderer(mockArg, mockArg, mockArg);
    }).not.toThrowError(
      "Renderer has already been registered! It's not allowed to re-register with another new Renderer instance.",
    );
  });
});
