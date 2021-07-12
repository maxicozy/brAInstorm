import { FC } from 'react';
import styled from 'styled-components';

const Button: FC<{
   onClick?: () => void
}> = props => {
   return <Style>
      <button
         onClick={props.onClick}
      >
         <p>generate</p>
      </button>
   </Style>
}

const Style = styled.g`
   button { 
    margin-top: 14px;     
    background: #FFFFFF;
    box-shadow: 0px 8px 30px 4px #E5E5E5;
    border-radius: 67px;
    width: 110px;
    height: 35px; 

      p {
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-style: normal;
        font-weight: bold;
        font-size: 12px;
        line-height: 36px;
        /* identical to box height, or 150% */

        text-align: center;

        color: #FFD600;
      }
   }
`;

export default Button;