import { useEffect, useState } from "react";
import Header from "../../components/header/header";
import MapCanvas from "../../components/map/map";
import { getDimensions } from "../../components/map/gridManager";
import debounce from "debounce";
import CardCell from "../../components/map/cellCard/card"

function Play() {

  const dimensions = getDimensions({ x: 0, y: 0 }, 48);
  const [key, setKey] = useState(0);
  useEffect(() => {
    const handler = debounce(() => setKey((oldValue) => oldValue + 1), 20);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler)
  });

  const [cell, setCell] = useState(0);
  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const [coordinatesPerId, setCoordinatesPerId] = useState(new Map());

  return (
    <div className="">
      <Header />
      <MapCanvas key={key} initialTopLeft={dimensions.topLeft} initialBottomRight={dimensions.bottomRight}
        setCell={setCell} setCoord={setCoord} coordinatesPerId={coordinatesPerId} />
      <CardCell cellNumber={cell} coord={coord} coordinatesPerId={coordinatesPerId} />
    </div>
  );

}
export default Play;