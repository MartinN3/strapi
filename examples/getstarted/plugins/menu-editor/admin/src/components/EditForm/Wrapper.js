import styled from 'styled-components';

const Item = styled.div`
  cursor: move;
  border: dashed 1px #e2e2e2;
  margin-bottom: -1px;
  margin-left: 0px;
  border-image: initial;
  padding: 16px;
  background: rgb(255, 255, 255);
`;

const Wrapper = styled.div`
  background: #ffffff;
  padding: 45px 30px 22px 30px;
  border-radius: 2px;
  box-shadow: 0 2px 4px #e3e9f3;

  .inputStyle {
    max-width: 358px;
  }

  .subFormWrapper {
    margin-bottom: 14px;
    padding: 23px 30px 0 30px;
    background-color: #fafafb;
  }
`;

export { Wrapper, Item };
