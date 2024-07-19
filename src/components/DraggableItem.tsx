import { useSortable } from "@dnd-kit/sortable";
import { Item } from "../Type";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  item: Item;
}

const DraggableItem = (props: Props) => {
  const { item } = props;
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: item.id,
      data: {
        type: "Item",
        item,
      },
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    backgroundImage: `url(${item.imageUrl})`,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="w-[100px] h-[100px] bg-gray-400 rounded-md mx-0.5"
      style={style}
    >
      <h2>{item.id}</h2>
    </div>
  );
};
export default DraggableItem;
