import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Item, Row } from "../Type";
import ItemContainer from "./ItemContainer";

interface Props {
  row: Row;
  items: Item[];
}

function Tier(props: Props) {
  const { row, items } = props;

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
      className="bg-teal-950 w-[1000px] min-h-[105px] max-w-[1000px] rounded-md flex"
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
    </div>
  );
}

export default Tier;
