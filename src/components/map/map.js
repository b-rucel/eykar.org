import { Delaunay } from "d3-delaunay";
import "./map.css";
import React, { useRef, useEffect, useState } from "react";
import { getTileCenter } from "./grid/gridManager";
import { drawMap } from "./grid/biomes";
import { CListener, KListeners, WListener } from "../map/grid/listeners";

function MapCanvas({ topLeft, setTopLeft, bottomRight, setBottomRight, coordinatesPerId, activePlots, voronoi, setPlotInfo, setPlot, contract, inPlay }) {
  const canvasRef = useRef(null);
  const [xPrefix, setXPrefix] = useState(0);
  const [yPrefix, setYPrefix] = useState(0);
  const xStep = useRef(1);
  const yStep = useRef(1);
  const [zoomIn, setZoomIn] = useState({ x: 0, y: 0, zoom: 0 });

  useEffect(() => {
    const scale = window.devicePixelRatio;
    const canvas = canvasRef.current;
    canvas.focus();
    canvas.width = canvas.clientWidth * scale;
    canvas.height = canvas.clientHeight * scale;
    const context = canvas.getContext("2d");
    context.scale(scale, scale);
    const mapWidth = bottomRight.x - topLeft.x;
    const mapHeight = bottomRight.y - topLeft.y;
    xStep.current = context.canvas.width / (scale * (mapWidth + 1));
    yStep.current = context.canvas.height / (scale * (mapHeight + 1));

    let Iterator = {
      _i: -1,
      _j: -1,
      id: 0,

      [Symbol.iterator]() {
        return this;
      },

      next() {
        let center = getTileCenter(
          topLeft.x,
          this._i,
          topLeft.y,
          this._j,
          xStep.current,
          yStep.current,
          xPrefix,
          yPrefix
        );
        coordinatesPerId.set(this.id++, [
          this._i + Math.floor(topLeft.x),
          this._j + Math.floor(topLeft.y),
        ]);
        if (this._j >= mapHeight + 1) {
          this._i++;
          this._j = -1;
          return { done: false, value: [center.x, center.y] };
        } else {
          this._j++;
          return { done: this._i > mapWidth + 2, value: [center.x, center.y] };
        }
      },
    };
    voronoi.setVoronoi = Delaunay.from(Iterator).voronoi([
      0,
      0,
      canvas.width,
      canvas.height,
    ]);
    drawMap(activePlots, coordinatesPerId, context, voronoi);

    const wlisterner = new WListener(bottomRight, topLeft, setZoomIn, canvas);
    const listenMouseWheel = wlisterner.handleMouseWheel.bind(wlisterner);
    canvas.addEventListener("mousewheel", listenMouseWheel);

    let listenClick;
    if (inPlay) {
      const clisterner = new CListener(setPlotInfo, voronoi, coordinatesPerId, setPlot, contract);
      listenClick = clisterner.handleMouseClick.bind(clisterner);
      canvas.addEventListener("click", listenClick);
    }
    return () => {
      canvas.removeEventListener("mousewheel", listenMouseWheel);
      if (inPlay)
        canvas.removeEventListener("click", listenClick);
    };
  }, [
    bottomRight,
    topLeft,
    xPrefix,
    yPrefix,
    coordinatesPerId,
    voronoi,
    xStep,
    yStep,
    inPlay,
    activePlots
  ]);

  useEffect(() => {
    if (zoomIn.zoom !== 0) {
      const mapWidth = bottomRight.x - topLeft.x;
      const mapHeight = bottomRight.y - topLeft.y;
      setZoomIn({ x: zoomIn.x, y: zoomIn.y, zoom: 0 });
      if (zoomIn.zoom === 1) {
        const newTopLeft = {
          x: topLeft.x + 0.05 * zoomIn.x,
          y: topLeft.y + 0.05 * zoomIn.y,
        };
        const newBottomRight = {
          x: 0.95 * mapWidth + newTopLeft.x,
          y: 0.95 * mapHeight + newTopLeft.y,
        };
        setXPrefix(newTopLeft.x - Math.trunc(newTopLeft.x));
        setYPrefix(newTopLeft.y - Math.trunc(newTopLeft.y));
        setTopLeft(newTopLeft);
        setBottomRight(newBottomRight);
      } else {
        const newTopLeft = {
          x: topLeft.x - 0.05 * zoomIn.x,
          y: topLeft.y - 0.05 * zoomIn.y,
        };
        const newBottomRight = {
          x: 1.05 * mapWidth + newTopLeft.x,
          y: 1.05 * mapHeight + newTopLeft.y,
        };
        setTopLeft(newTopLeft);
        setBottomRight(newBottomRight);
      }
    }
  }, [
    zoomIn.zoom,
    zoomIn.x,
    zoomIn.y,
    bottomRight.x,
    bottomRight.y,
    topLeft.x,
    topLeft.y,
    setTopLeft,
    setBottomRight,
    setYPrefix,
    setXPrefix,
  ]);

  const [repeatStreak, setRepeatStreak] = useState(0);

  const kListeners = new KListeners(
    xStep,
    yStep,
    setRepeatStreak,
    repeatStreak,
    xPrefix,
    yPrefix,
    setXPrefix,
    setYPrefix,
    bottomRight,
    setBottomRight,
    topLeft,
    setTopLeft
  );
  return (
    <canvas
      className="map"
      ref={canvasRef}
      onKeyDown={kListeners.onKeyPressed.bind(kListeners)}
      tabIndex={1}
    />
  );
}

export default MapCanvas;