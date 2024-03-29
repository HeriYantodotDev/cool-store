import styled from 'styled-components';

export const BaseButton = styled.button`
  min-width: 120px;
  // max-width: 50px;
  width: auto;
  height: 50px;
  letter-spacing: 0.5px;
  line-height: 50px;
  padding: 0 10px 0 10px;
  font-size: 15px;
  background-color: black;
  color: white;
  text-transform: uppercase;
  font-family: 'Open Sans Condensed';
  font-weight: bolder;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin-right: 10px;

  &:hover {
    background-color: silver;
    color: black;
    // border: 1px solid black;
  }
`;

export const GoogleSignInButton = styled(BaseButton)`
  background-color: #4285f4;
  color: white;

  &:hover {
    background-color: rgb(53, 37, 223);
    border: none;
    color: white;
  }
`;

export const InvertedButton = styled(BaseButton)`
  background-color: silver;
  color: black;
  border: 1px solid black;

  &:hover {
    background-color: black;
    color: silver;
    border: none;
  }
`;
