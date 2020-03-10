import styled from 'styled-components';
import theme from 'styles/theme.style.js';

const Title = styled.Text`
  font-size: 40px;
  color: #9373d8;
  font-weight: bold;
  font-family: 'Trebuchet MS';
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: #212121;
  margin-top: 32px;
  font-family: Inter;
  text-align: center;
  font-weight: 400;
`;

const AppTitle = styled.Text`
  color: ${theme.COLOR_TITLE};
  font-size: 18px;
  font-weight: ${theme.FONT_WEIGHT_BOLD};
`;

export {Title, Subtitle, AppTitle};
