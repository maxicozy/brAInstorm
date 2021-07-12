import { FC } from 'react';
import styled from 'styled-components';
import spinnerSrc from '../spinner.svg';

const Loading: FC = () => {
   return <Style className="px-4 py-1 flex items-center justify-center">
      <button>
         <img src={spinnerSrc} className="w-5 h-5 mr-2" alt="Haha you're blind" />
         <p>generating...</p>
      </button>
   </Style>;
}

const Style = styled.g`
   button {
   display: flex;
   align-items: center;
   justify-content: center;
   margin-top: 10px;     
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

export default Loading;