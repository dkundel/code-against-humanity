import React, { Component } from 'react';
import styled from 'styled-components';

import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import { red500, grey500 } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';

import { MutedText } from './common';

class SubmissionEntry extends Component {
  render() {
    const { selected, onSelect, children, key, hideHeart } = this.props;

    const Icon = selected ? (
      <ActionFavorite color={red500} />
    ) : (
      <ActionFavoriteBorder />
    );

    return (
      <ListItem
        primaryText={<MutedText>{children}</MutedText>}
        rightIcon={!hideHeart && Icon}
        onClick={() => onSelect()}
        key={'entry' + key}
      />
    );
  }
}

export default SubmissionEntry;
