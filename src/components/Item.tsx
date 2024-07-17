import { useDraggable } from "@dnd-kit/core";
import { Item } from "../Type";

const DraggableItem = ({
  item,
  rowColor,
}: {
  item: Item;
  rowColor: string;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id.toString(),
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    backgroundImage: `url(${item.imageUrl})`,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="text-md rounded-md p-2 h-full w-[100px] flex items-center justify-center rounded-r-none border-r-2 cursor-grab"
      style={{
        ...style,
        backgroundColor: rowColor,
        backgroundSize: "cover",
        margin: "0 5px",
      }}
    />
  );
};
