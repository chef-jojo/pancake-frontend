import styled from "@emotion/styled";
import { space } from "styled-system";
import { Td } from "./Cell";

const Table = styled.table`
  max-width: 100%;
  width: 100%;

  tbody tr:last-child {
    ${Td} {
      border-bottom: 0;
    }
  }

  ${space}
`;

export default Table;
