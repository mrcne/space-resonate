import React, {useEffect, useMemo, useState} from 'react';
import Globe from 'react-globe.gl';
import {LandingSite} from "../../types/resources.ts";

import {DataSetType} from "../../types/seismicSettings.ts";
import ResizableContainer from "../ResizeableContainer";

type Props = {
  message?: string;
  type?: DataSetType;
} & React.HTMLAttributes<HTMLDivElement>;

const GlobeWithEvents: React.FC<Props> = ({
  type = 'lunar',
  message,
  ...props
}) => {
    const [landingSites, setLandingSites] = useState<Record<string, LandingSite>>({});

    const currentStation = 'apollo-12'

    useEffect(() => {
      fetch('./resources/stations.json')
        .then(r =>r.json())
        .then(setLandingSites);
    }, []);

  const labelsData = useMemo(() => (
    [landingSites[currentStation]]
  ) , [landingSites, currentStation]);

  return <ResizableContainer {...props} render={( width, height) => (
    <>
      <h2>{message}</h2>
      <Globe
        globeImageUrl="//unpkg.com/globe.gl@2.27.2/example/moon-landing-sites/lunar_surface.jpg"
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
