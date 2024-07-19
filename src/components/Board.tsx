import React, { act, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Item, Row } from "../Type";
import Tier from "./Tier";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import ItemPool from "./ItemPool";
function Board() {
  const [rows, setRows] = useState<Row[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  // Function to create a new row with 3 items
  const createNewRow = (color: string) => {
    const newRow: Row = {
      id: rows.length + 1,
      title: `Tier ${rows.length + 1}`,
      color: color,
      items: [],
    };
    setRows([...rows, newRow]);
  };

  const getRowPos = (id: number | string): number => {
    return rows.findIndex((row) => row.id === id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.data.current?.type === "Item") return;

    // Check if active is null/undefined
    if (!active) return;
    if (!over) return;

    const activeId = active.id;

    const overId = over.id;

    setRows((rows) => {
      // Find the original position of the active row
      const originalPos = getRowPos(activeId);
      const newPos = getRowPos(overId);

      return arrayMove(rows, originalPos, newPos);
    });
  };
  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeIsItem = active.data.current?.type === "Item";
    const overIsItem = over.data.current?.type === "Item";
    if (!activeIsItem) return;

    // hovering item over item
    if (overIsItem) {
      setItems((items) => {
        const activeIndex = items.findIndex((t) => t.id === activeId);
        const overIndex = items.findIndex((t) => t.id === overId);

        items[activeIndex].tierId = items[overIndex].tierId;
        return arrayMove(items, activeIndex, overIndex);
      });
    }
    const overIsTier = over.data.current?.type === "Tier";
    if (overIsTier) {
      setItems((items) => {
        const activeIndex = items.findIndex((t) => t.id === activeId);

        items[activeIndex].tierId = overId;
        return arrayMove(items, activeIndex, activeIndex);
      });
    }
  }

  const createItem = (tierId: number) => {
    const newItem: Item = {
      id: Math.floor(Math.random() * Date.now()), // Generate a random ID
      imageUrl: "path/to/your/image.jpg", // Replace with actual image URL
      tierId: tierId,
    };
    setItems([...items, newItem]);
  };

  return (
    <>
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
        <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
          <div className="flex flex-col items-center m-auto gap-4">
            <div className="flex flex-col gap-2 ">
              <SortableContext items={rows}>
                {rows.map((row) => (
                  <Tier
                    key={row.id}
                    row={row}
                    createItem={createItem}
                    items={items.filter((item) => item.tierId === row.id)}
                  ></Tier>
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
      <ItemPool />
    </>
  );
}

export default Board;
