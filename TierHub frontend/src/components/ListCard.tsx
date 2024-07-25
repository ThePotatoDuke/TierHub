import { Link } from "react-router-dom";
import { TierListDTO } from "../Type";

const ListCard = ({ tierList }: { tierList: TierListDTO }) => {
  return (
    <Link
      to={`/tier-list/${tierList.id}`}
      className="bg-white rounded-lg overflow-hidden shadow-md"
    >
      <img
        src={`http://localhost:8090${tierList.imageUrl}`} // Ensure the base URL is correct
        alt={tierList.name || "Tier List Image"}
        className="w-full h-48 object-cover"
      />
      <div className="flex-shrink">
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-700">{tierList.name}</h3>
          <p className="text-gray-600">{tierList.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ListCard;
