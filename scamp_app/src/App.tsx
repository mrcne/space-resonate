import {Flex} from '@chakra-ui/react'

import PanelCenter from "./components/PanelCenter";
import PanelMain from "./components/PanelMain";
import PanelSide from "./components/PanelSide";

import './App.css'

function App() {
  return (
    <Flex
      w="100%"
      minHeight="100vh"
      alignItems="stretch"
    >
      <PanelMain />
      <PanelCenter flex="1" />
      <PanelSide />
    </Flex>
  )
}

export default App
