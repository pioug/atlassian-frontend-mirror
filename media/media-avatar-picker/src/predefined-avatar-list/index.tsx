/**@jsx jsx */
import { jsx } from '@emotion/react';
import { PureComponent } from 'react';

import { AvatarList, Avatar } from '../avatar-list';

import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import Button from '@atlaskit/button';
import { predefinedAvatarsWrapperStyles } from './styles';

interface ShowMoreButtonProps {
  onClick?: () => void;
}

class ShowMoreButton extends PureComponent<ShowMoreButtonProps, {}> {
  render() {
    // TODO: refactor this button to not use custom - component reverts to square shape when hovered
    return (
      <Button
        className="show-more-button"
        appearance="subtle"
        iconAfter={<EditorMoreIcon label="Show More" size="large" />}
        onClick={this.props.onClick}
      />
    );
  }
}

export interface PredefinedAvatarListProps {
  avatars: Array<Avatar>;
  selectedAvatar?: Avatar;
  onShowMore?: () => void;
  onAvatarSelected: (avatar: Avatar) => void;
}

export class PredefinedAvatarList extends PureComponent<
  PredefinedAvatarListProps,
  {}
> {
  static defaultProps = {
    avatars: [],
  };

  UNSAFE_componentWillMount() {
    this.setState((state) => {
      const { avatars } = this.props;

      return {
        ...state,
        avatars,
      };
    });
  }

  render() {
    const { avatars, selectedAvatar, onShowMore, onAvatarSelected } =
      this.props;
    return (
      <div css={predefinedAvatarsWrapperStyles} id="predefined-avatar-wrapper">
        <AvatarList
          avatars={avatars}
          selectedAvatar={selectedAvatar}
          onItemClick={onAvatarSelected}
        />
        <ShowMoreButton onClick={onShowMore} />
      </div>
    );
  }
}
