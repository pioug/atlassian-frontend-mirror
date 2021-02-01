import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import React from 'react';
import { Props, ShowMore } from '../../../components/ShowMore';

describe('ShowMore', () => {
  const renderShowMore = (props: Props) => <ShowMore {...props} />;

  it('should trigger onClick', () => {
    const onClick = jest.fn();
    const showMore = mountWithIntl(renderShowMore({ onClick }));

    showMore.find('button').simulate('mouseDown');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should add classNames', () => {
    const className = {
      container: 'container-class',
      button: 'button-class',
    };
    const showMore = mountWithIntl(renderShowMore({ className }));

    expect(showMore.children().first().prop('className')).toContain(
      'container-class',
    );
    expect(showMore.find('button').prop('className')).toContain('button-class');
  });

  it('should add style', () => {
    const style = {
      container: { display: 'flex' },
      button: { backgroundColor: '#fff' },
    };
    const showMore = mountWithIntl(renderShowMore({ style }));

    expect(showMore.children().first().prop('style')).toMatchObject(
      style.container,
    );
    expect(showMore.find('button').prop('style')).toMatchObject(style.button);
  });
});
