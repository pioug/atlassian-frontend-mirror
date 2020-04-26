import RendererActions from '../../index';

describe('RendererActions', () => {
  it(`can't register the same RendererActions instance on more than one ref`, () => {
    const actions = new RendererActions(true);
    actions._privateRegisterRenderer({}, {} as any);
    expect(() => {
      actions._privateRegisterRenderer({}, {} as any);
    }).toThrowError(
      "Renderer has already been registered! It's not allowed to re-register with another new Renderer instance.",
    );
  });

  it(`no-ops when not init'd from a correct source`, () => {
    const actions = new RendererActions();
    actions._privateRegisterRenderer({}, {} as any);
    expect(() => {
      actions._privateRegisterRenderer({}, {} as any);
    }).not.toThrowError(
      "Renderer has already been registered! It's not allowed to re-register with another new Renderer instance.",
    );
  });
});
