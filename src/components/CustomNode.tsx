import { FC } from 'react';
import styled, { css } from 'styled-components';

const CustomNode: FC<{
   onClick: () => void
   text: string
   isStart?: boolean
}> = props => {
   return <g>
      {/* `foreignObject` requires width & height to be explicitly set. */}
      <foreignObject
         onClick={props.onClick}
         width={ props.isStart ? 600 : 570}
         height={ props.isStart ? 184 : 5000}
      >
         <Style {...props}>
            {props.text}
         </Style>
      </foreignObject>
   </g>;
}

const Style = styled.p<{ isStart?: boolean }>`
   background: #FFFFFF;
   box-shadow: 0px 8px 30px 4px #E5E5E5;
   border-radius: 20px;
   margin: auto;
   margin-top: 32px;
   width: 345px;

   top: 0px;
   text-align: left;
   padding: 28px 27px;
   font-family: -apple-system, BlinkMacSystemFont, sans-serif;
   font-weight: bold;
   font-size: 14px;
   line-height: auto;
   /* or 150% */
   color: #434343;

   ${p => p.isStart && css`
      margin: 32px;
      padding: 15px 20px 20px;
      width: 500px;
      height: 120px;
      font-family: -apple-system, BlinkMacSystemFont, mono;
      color: #434343;
      font-style: normal;
      font-weight: normal;
   `}
`;

export default CustomNode;