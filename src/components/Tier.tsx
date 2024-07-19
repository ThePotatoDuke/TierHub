import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Item, Row } from "../Type";
import DraggableItem from "./DraggableItem";
import ItemContainer from "./ItemContainer";

interface Props {
  row: Row;
  items: Item[];
  createItem: (columnId: number) => void;
}

function Tier(props: Props) {
  const { row, createItem, items } = props;

  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: row.id,
      data: {
        type: "Tier",
        row,
      },
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-teal-950 w-[1000px] min-h-[100px] max-w-[1000px] rounded-md flex"
    >
      {/* Tier Title */}
      <div
        {...attributes}
        {...listeners}
        className="text-md rounded-md p-2 min-h-full w-[100px] flex items-center justify-center rounded-r-none border-r-2 cursor-grab"
        style={{ backgroundColor: row.color }}
      >
        {row.title}
      </div>

      {/* Item container */}
      <ItemContainer items={items} />

      {/* <SortableContext items={items}>
        <div className="flex-1 flex items-center">
          {items.map((item) => (
            <DraggableItem key={row.id} item={item} />
          ))}
        </div>
      </SortableContext> */}

      <button onClick={() => createItem(row.id)}>add item</button>
    </div>
  );
}

export default Tier;
