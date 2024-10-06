import {Box, BoxProps} from "@chakra-ui/react";
import GlobeWithEvents from "../GlobeWithEvents";

const PanelCenter: React.FC<BoxProps> = (props) => {

  return <Box
    {...props}
  >
    <GlobeWithEvents className="globe-container" />
  </Box>
};

export default PanelCenter;
