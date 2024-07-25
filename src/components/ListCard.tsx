import { Link } from "react-router-dom";
import { TierListDTO } from "../Type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const ListCard = ({
  tierList,
  onDelete,
  onEdit,
}: {
  tierList: TierListDTO;
  onDelete: (id: number) => void;
  onEdit: () => void;
}) => {
  return (
    <div className="relative bg-white rounded-lg overflow-hidden shadow-md flex flex-col h-56 w-64">
      {" "}
      {/* Increased height */}
      <Link to={`/tier-list/${tierList.id}`} className="flex flex-col h-full">
        <div className="relative w-full h-36">
          <img
            src={`http://localhost:8090${tierList.imageUrl}`} // Ensure the base URL is correct
            alt={tierList.name || "Tier List Image"}
            className="w-full h-full object-cover" // Ensure image covers the container
          />
        </div>
        <div className="flex flex-col flex-grow px-3 py-1">
          {/* Adjust padding for better spacing */}
          <h3 className="text-lg text- font-bold text-gray-700 leading-tight truncate">
            {tierList.name}
          </h3>
          <p className="text-gray-600 text-sm leading-tight truncate ">
            {tierList.description}
          </p>
        </div>
      </Link>
      <button
        onClick={() => onEdit()}
        className="absolute bottom-2 right-9 bg-teal-500 text-white py-1 px-2 text-xs rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <FontAwesomeIcon icon={faEdit} className="text-xs" />
      </button>
      <button
        onClick={() => onDelete(tierList.id)}
        className="absolute bottom-2 right-2 bg-red-500 text-white py-1 px-2 text-xs rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <FontAwesomeIcon icon={faTrash} className="text-xs" />
      </button>
    </div>
  );
};

export default ListCard;
