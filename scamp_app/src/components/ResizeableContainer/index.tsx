import React, { useRef, useEffect, useState } from 'react';

type Props = {
  render: (width: number, height?: number) => React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const ResizableContainer: React.FC<Props> = ({ render, ...props }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === containerRef.current) {
          setWidth(entry.contentRect.width);
          setHeight(entry.contentRect.height);
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} {...props}>
      {render(width, height)}
    </div>
  );
};

export default ResizableContainer;
