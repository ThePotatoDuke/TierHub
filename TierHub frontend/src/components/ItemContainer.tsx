import React from "react";
import { SortableContext } from "@dnd-kit/sortable"; // Adjust the import based on your setup
import DraggableItem from "./DraggableItem"; // Adjust the import based on your setup

interface ItemContainerProps {
  items: any[];
}

const ItemContainer: React.FC<ItemContainerProps> = ({ items }) => {
  return (
    <SortableContext items={items}>
      <div className="flex-1 flex flex-wrap items-center">
        {items.map((item) => (
          <DraggableItem key={item.id} item={item} />
        ))}
      </div>
    </SortableContext>
  );
};

export default ItemContainer;
