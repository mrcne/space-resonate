import {Box, BoxProps, Heading} from "@chakra-ui/react";

const PanelSide: React.FC<BoxProps> = (props) => {

  return <Box
    {...props}
    padding="2"
  >
    <Heading as="h1" size="sm">2019-04-11 08:33:08</Heading>
    Confidence: 0.8
  </Box>
};

export default PanelSide;
