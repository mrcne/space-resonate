import React from 'react';
import Globe from 'react-globe.gl';
import ResizableContainer from "../ResizeableContainer";

type GlobeTypes = 'moon' | 'mars';

type Props = {
  message?: string;
  type?: GlobeTypes;
} & React.HTMLAttributes<HTMLDivElement>;

const GlobeWithEvents: React.FC<Props> = ({
  type = 'moon',
  message,
  ...props
}) => {
  return <ResizableContainer {...props} render={( width, height) => (
    <div>
      <h2>{type}</h2>
      <Globe
        globeImageUrl="//unpkg.com/globe.gl@2.27.2/example/moon-landing-sites/lunar_surface.jpg"
        width={width}
        height={height}
      />
    </div>
  )}/>
};

export default GlobeWithEvents;
