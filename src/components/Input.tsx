import { FC } from 'react';
import styled from 'styled-components';
import Button from './Button';
import Loading from './Loading';

const Input: FC<{
  onClick: () => void,
  isLoading: boolean,
  setProblem: (problem: string) => void
  problem: string
}> = props => {
  return <Style>
          <div className="bg-gray-100 rounded p-8" style={{ maxWidth: 1000 }}>
            <input
              value={props.problem}
              onChange={(e) => props.setProblem(e.target.value)}
              className="w-full border shadow font- p-4 rounded-lg my-2"
              placeholder="How might we" 
              maxLength={200}
            />
            {props.isLoading ? (
              <Loading />
            ) : (
              <Button onClick={() => props.onClick()}/>
            )}
          </div>
  </Style>;
} 

const Style = styled.div`
  div {      
     background: #FFFFFF;
     text-align: center;
  }
`;


export default Input;