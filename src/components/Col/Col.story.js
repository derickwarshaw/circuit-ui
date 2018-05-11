import React from 'react';
import styled, { css } from 'react-emotion';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import withTests from '../../util/withTests';
import Col from './Col';

const baseColStyles = ({ theme }) => css`
  background-color: ${theme.colors.p500};
  color: ${theme.colors.white};
  font-size: 14px;
  font-weight: bold;
  line-height: 20px;
  height: 40px;
  padding: 10px;
`;

const StyledCol = styled(Col)`
  ${baseColStyles};
`;

StyledCol.defaultProps = {
  skip: '0'
};

storiesOf('Col', module)
  .addDecorator(withTests('Col'))
  .add(
    'Default Col',
    withInfo()(() => (
      <div style={{ width: '100vw' }}>
        <StyledCol span="12">Default Column</StyledCol>
      </div>
    ))
  );
