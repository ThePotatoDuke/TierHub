import { useSortable } from "@dnd-kit/sortable";
import { Row } from "../Type";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  row: Row;
}

function Tier(props: Props) {
  const { row } = props;

  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: row.id,
      data: {
        type: "Row",
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
      className="bg-teal-950 w-[1000px] h-[100px] max-w-[1000px] rounded-md flex"
    >
      {/* Tier Title */}
      <div
        {...attributes}
        {...listeners}
        className="text-md rounded-md p-2 h-full w-[100px] flex items-center justify-center rounded-r-none border-r-2 cursor-grab"
        style={{ backgroundColor: row.color }}
      >
        {row.title}
      </div>

      {/* Item container */}
      <div className="flex-1 flex items-center">
        {/* Your items will go here */}
        {/* Example item */}
        <div className="w-[50px] h-[50px] bg-gray-400 rounded-full mx-1"></div>
        {/* Add more items as needed */}
      </div>
    </div>
  );
}

export default Tier;
