import { FC, FormEvent, useCallback } from 'react';
import styled, { css } from 'styled-components';
import Button from './Button';
import Loading from './Loading';

const Input: FC<{
  onSubmit?: () => void,
  isLoading?: boolean,
  setProblem: (input: string) => void
  problem: string
  disabled?: boolean,
}> = ({ onSubmit, isLoading, setProblem, problem, disabled }) => {

  const submit = useCallback((e: FormEvent) => {
    e.preventDefault();
    onSubmit?.()
  }, [onSubmit])

  return <Style disabled={disabled} onSubmit={submit}>
    <textarea
      disabled={disabled}
      value={problem}
      onChange={(e) => setProblem(e.target.value)}
      className="w-full"
      placeholder="How might we... ?"
      maxLength={300}
    />
    {isLoading ? (
      <Loading />
    ) : (
      <Button />
    )}
  </Style>;
}

const Style = styled.form<{ disabled?: boolean }>`

  text-align: center;
  width: 500px;
  height: 200px;
  
  textarea {
    color: #434343;
    height: 120px;
    padding: 15px 20px 20px;
    font-family: -apple-system, BlinkMacSystemFont, mono;
    font-style: normal;
    font-size: 14px;
    line-height: auto;
    background: #FFFFFF;
    box-shadow: 0px 8px 30px 4px #E5E5E5;
    border-radius: 20px;
    border: none;
    overflow: auto;
    outline: none;
    resize: none;
    ${p => p.disabled && css`
      font-weight: bold;
      color: #FFD600;
      text-align: center;
      padding-top: 50px;
   `}
  }
`;


export default Input;