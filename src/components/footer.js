import React from 'react';
import styled from 'styled-components';

import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import { red500, grey800, grey500 } from 'material-ui/styles/colors';

import { MutedText } from './common';

const CenteredFooter = styled.footer`text-align: center;`;

const FooterLink = styled.a`
  color: ${grey500};

  &:hover,
  &:focus {
    color: ${grey800};
    text-decoration: underline;
  }
`;

const Footer = () => {
  return (
    <CenteredFooter>
      <MutedText>
        Made with <ActionFavorite color={red500} /> by{' '}
        <FooterLink href="https://github.com/dkundel">
          Dominik Kundel
        </FooterLink>
      </MutedText>
      <MutedText>
        Powered by{' '}
        <FooterLink href="https://www.twilio.com/docs/api/sync">
          Twilio Sync
        </FooterLink>
      </MutedText>
    </CenteredFooter>
  );
};

export default Footer;
