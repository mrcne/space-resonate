import {Box, BoxProps, Heading, Image} from "@chakra-ui/react";
import {useCallback} from "react";

import {useSeismicSettings} from "../../context/seismicSettings.tsx";
import {SeismicSettings} from "../../types/seismicSettings.ts";

const PanelSide: React.FC<BoxProps> = (props) => {
  const { settings } = useSeismicSettings();

  const filePath = useCallback((event: SeismicSettings['event'], dataSet: SeismicSettings['dataSet']) => {
    return `./data/${dataSet}/training/plots/${event}.png`;
  }, []);

  if (!settings.event) {
    return <Box
      {...props}
      padding="2"
      width="400px"
    >
      <Heading as="h2" size="sm">No event selected</Heading>
    </Box>
  }

  return <Box
    {...props}
    padding="2"
    width="400px"
  >
    <Heading as="h2" size="sm">{settings.event}</Heading>
    Confidence: 0.8
    <br />
    <Image
      maxWidth="100%"
      src={filePath(settings.event, settings.dataSet)}
      alt={`${settings.event} seismic event`}
    />
  </Box>
};

export default PanelSide;
