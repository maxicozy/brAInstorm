import { FC } from 'react';
import styled from 'styled-components';

const CustomNode: FC<{
   onClick: () => void
   name: string
}> = props => {
   return <Style>
      {/* `foreignObject` requires width & height to be explicitly set. */}
      <foreignObject
         onClick={props.onClick}
         width={600}
         height={600}
      >
         <div>
            <p>
               {props.name}
            </p>
         </div>
      </foreignObject>
   </Style>;
} 

const Style = styled.g`
   div {      
      background: #FFFFFF;
      box-shadow: 0px 8px 30px 4px #E5E5E5;
      border-radius: 20px;

      p {
         text-align: left;
         padding: 52px 45px 20px;
         font-family: -apple-system, BlinkMacSystemFont, sans-serif;
         font-style: normal;
         font-weight: bold;
         font-size: 24px;
         line-height: 36px;
         /* or 150% */


color: #000000;
      }
   }
`;

export default CustomNode;