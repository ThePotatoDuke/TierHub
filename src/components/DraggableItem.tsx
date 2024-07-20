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
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="w-[100px] h-[100px] rounded-md m-0.5 overflow-hidden"
      style={style}
    >
      <img
        src={item.imageUrl}
        alt={`Item ${item.id}`}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
export default DraggableItem;
