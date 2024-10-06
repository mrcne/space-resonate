import {Box, Image} from "@chakra-ui/react";
import React, {useEffect, useMemo, useState} from 'react';
import Globe from 'react-globe.gl';

import {useSeismicSettings} from "../../context/seismicSettings.tsx";
import {LandingSite} from "../../types/resources.ts";

import ResizableContainer from "../ResizeableContainer";

type Props = React.HTMLAttributes<HTMLDivElement>;

const GlobeWithEvents: React.FC<Props> = ({
  ...props
}) => {
  const [landingSites, setLandingSites] = useState<Record<string, LandingSite>>({});
  const {settings} = useSeismicSettings();

  const currentStation = 'apollo-12';

  const globeSrcByType = {
    'lunar': '//unpkg.com/globe.gl@2.27.2/example/moon-landing-sites/lunar_surface.jpg',
    'mars': './assets/temp_mars_surface.jpg',
    'pi': './assets/pi_image.jpg',
    'custom': '',
  }

  useEffect(() => {
    fetch('./assets/stations.json')
      .then(r => r.json())
      .then(setLandingSites);
  }, []);

  const labelsData = useMemo(() => (
    [landingSites[currentStation]]
  ), [landingSites, currentStation]);

  if (settings.dataSet === 'pi') {
    return <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      <Image
        src={globeSrcByType['pi']}
        alt="Pi image"
        borderRadius="full"
      />
    </Box>
  }

  return <ResizableContainer {...props} render={(width, height) => (
    <>
      <Globe
        globeImageUrl={globeSrcByType[settings.dataSet] ?? globeSrcByType['lunar']}
        width={width}
        height={height}
        rendererConfig={{
          antialias: true,
          alpha: true,
        }}
        showAtmosphere={true}
        labelText="label"
        labelSize={1.7}
        labelDotRadius={0.4}
        labelsData={labelsData}
        labelLabel={(d: any) => `
          <div><b>${d.label}</b></div>
          <div>${d.agency} - ${d.program} Program</div>
          <div>Landing on <i>${new Date(d.date).toLocaleDateString()}</i></div>
        `}
      />
    </>
  )}/>
};

export default GlobeWithEvents;
