import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Item, Row } from "../Type";
import ItemContainer from "./ItemContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

interface Props {
  row: Row;
  items: Item[];
  onUpdate: (row: Row) => void; // Callback to update the tier
}

function Tier(props: Props) {
  const { row, items, onUpdate } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState(row.name);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: row.id,
      data: {
        type: "Tier",
        row,
      },
    });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdate({ ...row, name: newName });
    handleModalClose();
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
        className="text-md rounded-md p-2 min-h-full w-[100px] flex items-center justify-center rounded-r-none border-r-2 cursor-grab "
        style={{ backgroundColor: row.color }}
      >
        <h2 className="truncate">{row.name}</h2>
      </div>

      {/* Item container */}
      <ItemContainer items={items} />

      <button onClick={handleModalOpen} className="m-2 p-1 text-white">
        <FontAwesomeIcon icon={faCog} />
      </button>
      {/* Modal for editing tier name */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-xl text-gray-600 font-bold mb-4">
              Edit Tier Name
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="tierName"
                  className="block text-sm font-medium text-gray-600"
                >
                  Tier Name
                </label>
                <input
                  type="text"
                  id="tierName"
                  value={newName}
                  onChange={handleNameChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full text-gray-800"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tier;
