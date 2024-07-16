import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Row } from "../Type";
import Tier from "./Tier";
import { DndContext, DragStartEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
function Board() {
  const [rows, setRows] = useState<Row[]>([]);

  // Function to create a new row
  const createNewRow = (color: string) => {
    const newRow = {
      id: rows.length + 1,
      title: `Tier ${rows.length + 1}`,
      color: color,
    };
    setRows([...rows, newRow]);
  };
  const tiersId = useMemo(() => rows.map((row) => row.id), []);

  function onDragStart(event: DragStartEvent) {
    console.log("drag start", event);
    if (event.active.data.current?.type === "Row") {
      setActiveColumn(event.active.data.current.row);
    }
  }

  const [activeColumn, setActiveColumn] = useState<Row | null>(null);

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
      <DndContext onDragStart={onDragStart}>
        <div className="flex flex-col items-center m-auto gap-2">
          <div className="flex flex-col gap-2 " draggable="true">
            <SortableContext items={tiersId}>
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
