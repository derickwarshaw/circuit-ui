import React from 'react';
import styled, { css } from 'react-emotion';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import withTests from '../../util/withTests';
import Row from './Row';
import Col from '../Col';

const baseColStyles = ({ theme }) => css`
  color: ${theme.colors.white};
  font-size: 14px;
  font-weight: bold;
  line-height: 20px;
  height: 40px;
  padding: 10px;
  &:nth-of-type(n) {
    background-color: ${theme.colors.b500};
  }

  &:nth-of-type(2n) {
    background-color: ${theme.colors.b300};
  }
`;

const StyledCol = styled(Col)`
  ${baseColStyles};
`;

StyledCol.defaultProps = {
  skip: '0'
};

const baseRowStyles = ({ theme }) => css`
  border: 2px solid ${theme.colors.y100};
  margin-bottom: 8px;
`;

const StyledRow = styled(Row)`
  ${baseRowStyles};
`;

storiesOf('Row', module)
  .addDecorator(withTests('Row'))
  .add(
    'Default Row',
    withInfo()(() => (
      <div style={{ width: '100vw' }}>
        <StyledRow>
          <StyledCol span="4">Col 4</StyledCol>
          <StyledCol span="4">Col 4</StyledCol>
          <StyledCol span="4">Col 4</StyledCol>
        </StyledRow>
      </div>
    ))
  );
