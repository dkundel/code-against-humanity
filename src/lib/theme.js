import getMuiTheme from 'material-ui/styles/getMuiTheme';

export const TWILIO_RED = '#F22F46';
export const TWILIO_BLUE = '#0D122B';
export const TWILIO_DUSK = '#565B73';
export const TWILIO_SMOKE = '#94979B';

export const THEME_CONFIG = {
  palette: {
    primary1Color: TWILIO_RED,
    primary2Color: TWILIO_DUSK,
    primary3Color: TWILIO_SMOKE,
    accent1Color: TWILIO_BLUE
  }
};

export const Theme = getMuiTheme(THEME_CONFIG);

export default Theme;
