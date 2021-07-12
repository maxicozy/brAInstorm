import { useCallback, useState } from "react";

export interface Point {
  x: number
  y: number
}

export const useCenteredTree = () => {
  const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 });
  const containerRef = useCallback((containerElem) => {
    if (containerElem) {
      const { width, height } = containerElem.getBoundingClientRect();
      setTranslate({ x: width / 2 - 32 - 250, y: height / 2 - 32 - 100 });
    }
  }, []);
  return [translate, containerRef, setTranslate] as [typeof translate, typeof containerRef, typeof setTranslate];
};
