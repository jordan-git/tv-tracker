import React from "react";
import styled from 'styled-components';

const Text = styled.span`
  font-size: 1.5em;
  color: palevioletred;
`;

export default function Home() {
  return (
    <div>
      <Text>Home</Text>
    </div>
  );
}