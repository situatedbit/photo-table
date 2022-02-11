import { useEffect, useState, useMemo } from "react";
import {
  getSharedDoc,
  Doc,
  Error as ShareDBError,
} from "@/models/client/sharedb";
import { AddNumOp, ListDeleteOp, ListInsertOp } from "sharedb";
import { Image } from "@/models/image";

export interface Table {
  images: Image[];
}

const emptyTable: Table = {
  images: [] as Image[],
};

export function useSharedTable(tableId: string): [Doc<Table>, Table] {
  const [table, setTable] = useState(emptyTable);
  const doc = useMemo(() => getSharedDoc("tables", tableId), [tableId]);

  useEffect(() => {
    doc.subscribe((error: ShareDBError) => {
      if (error) return console.error(error);
    });

    const handleLoad = () => {
      setTable({ ...doc.data });
      // DEBUG
      console.log("loaded", { ...doc.data });
    };
    doc.on("load", handleLoad);

    const handleOp = () => {
      setTable({ ...doc.data });
      // DEBUG
      console.log("op", { ...doc.data });
    };
    doc.on("op", handleOp);

    return () => {
      doc.unsubscribe();
      doc.off("load", handleLoad);
      doc.off("op", handleOp);
    };
  }, [tableId, doc]);

  return [doc, table];
}

export function appendImageOp(images: Image[], image: Image): ListInsertOp {
  return { p: ["images", images.length], li: image };
}

export function removeImageOp(image: Image, index: number): ListDeleteOp {
  return { p: ["images", index], ld: image };
}

export function moveImageOp(
  imageIndex: number,
  prop: "left" | "top",
  increment: number
): AddNumOp {
  return { p: ["images", imageIndex, prop], na: increment };
}

export function setImageZIndexOp(
  imageIndex: number,
  currentZIndex: number,
  targetZIndex: number
): AddNumOp {
  return {
    p: ["images", imageIndex, "zIndex"],
    na: targetZIndex - currentZIndex,
  };
}
