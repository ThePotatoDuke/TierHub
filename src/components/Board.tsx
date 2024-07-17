import React, { act, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Row } from "../Type";
import Tier from "./Tier";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
function Board() {
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const createNewRow = (color: string) => {
    const newRow: Row = {
      id: rows.length + 1,
      title: `Tier ${rows.length + 1}`,
      color: color,
      items: [], // Initialize an empty items array
    };
    setRows([...rows, newRow]);
  };
  const createNewItem = (rowId: number, imageUrl: string) => {
    setRows((rows) =>
      rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              items: [...row.items, { id: row.items.length + 1, imageUrl }],
            }
          : row
      )
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedRowId) return;
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        createNewItem(selectedRowId, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getRowPos = (id: number | string): number => {
    return rows.findIndex((row) => row.id === id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Check if active is null/undefined
    if (!active) return;
    if (!over) return;

    // Convert active.id to a number
    const activeId = active.id;

    // Convert active.id to a number
    const overId = over.id;

    setRows((rows) => {
      // Find the original position of the active row
      const originalPos = getRowPos(activeId);
      const newPos = getRowPos(overId);

      return arrayMove(rows, originalPos, newPos);
    });
  };

  return (
    <div
      className="
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-auto
        px-[40px]
        "
    >
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <div className="flex flex-col items-center m-auto gap-4">
          <div className="flex flex-col gap-2 ">
            <SortableContext items={rows}>
              {rows.map((row) => (
                <Tier key={row.id} row={row}></Tier>
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewRow("#3498db");
            }}
            className="flex items-center bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-300  hover:ring-2 hover:ring-teal-300"
          >
            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
            Add Tier
          </button>
        </div>
      </DndContext>
    </div>
  );
}

export default Board;
