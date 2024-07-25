import { DndContext, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { act, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Item, Row } from "../Type";
import ItemPool from "./ItemPool";
import Tier from "./Tier";

function Board() {
  const { tierListId } = useParams();
  const [rows, setRows] = useState<Row[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [defaultTier, setDefaultTier] = useState<Row | null>(null);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const response = await fetch(
          `http://localhost:8090/api/tier_lists/${tierListId}/tiers`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data); // Log the data to inspect its structure

        // Assuming `data.defaultTier` is an object and you need its `id`
        if (data.defaultTier) {
          setDefaultTier(data.defaultTier);
        }

        setRows(data.tiers); // Adjust according to your data structure
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };

    fetchTiers();
  }, [tierListId]);

  const createNewRow = async (color: string) => {
    const newRow = {
      name: `Tier ${rows.length + 1}`,
      position: rows.length + 1,
      color,
      tierListID: tierListId,
      items: [],
    };

    try {
      const response = await fetch("http://localhost:8090/api/tiers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const savedRow = await response.json();
      setRows((prevRows) => [...prevRows, savedRow]);
    } catch (error) {
      console.error("Error saving the new row:", error);
    }
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

  const createItems = (imageUrls: string[]) => {
    if (!defaultTier) {
      console.error("Default tier is not set");
      return;
    }

    const newItems: Item[] = imageUrls.map((imageUrl) => ({
      id: Math.floor(Math.random() * 1000), // Generate a unique ID
      imageUrl,
      tierId: defaultTier.id, // Use defaultTier ID
    }));

    setItems((prevItems) => [...prevItems, ...newItems]);
  };

  const handleTierUpdate = async (updatedRow: Row) => {
    try {
      const response = await fetch(
        `http://localhost:8090/api/tiers/${updatedRow.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updatedRow.name,
            color: updatedRow.color,
            // Add other necessary fields
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update tier");
      }

      // Update the state or perform other necessary actions
      setRows((prev) =>
        prev.map((tier) => (tier.id === updatedRow.id ? updatedRow : tier))
      );
    } catch (error) {
      console.error("Error updating tier:", error);
      alert("Failed to update tier");
    }
  };

  return (
    <>
      <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
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
          <div className="flex flex-col items-center m-auto gap-4">
            <div className="flex flex-col gap-2 ">
              <SortableContext items={rows}>
                {rows.map((row) => (
                  <Tier
                    key={row.id}
                    row={row}
                    items={items.filter((item) => item.tierId === row.id)}
                    onUpdate={handleTierUpdate}
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
        </div>

        <ItemPool
          items={items.filter((item) => item.tierId === defaultTier?.id)}
          createItems={createItems}
        />
      </DndContext>
    </>
  );
}

export default Board;
