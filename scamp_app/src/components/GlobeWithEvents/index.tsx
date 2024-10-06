import React from 'react';
import Globe from 'react-globe.gl';

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
  return <ResizableContainer {...props} render={( width, height) => (
    <>
      <h2>{message}</h2>
      <Globe
        globeImageUrl="//unpkg.com/globe.gl@2.27.2/example/moon-landing-sites/lunar_surface.jpg"
        width={width}
        height={height}
        rendererConfig={{
          antialias: false,
          alpha: false,
        }}
        showAtmosphere={false}
      />
    </>
  )}/>
};

export default GlobeWithEvents;
