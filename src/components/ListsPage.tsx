import React, { useEffect, useState } from "react";
import { TierListDTO } from "../Type";
import ListCard from "./ListCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import ListModal from "./ListModal";

const fetchTierListsByUserId = async (userId: number) => {
  const response = await fetch(
    `http://localhost:8090/api/tier_lists/user/${userId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch tier lists");
  }
  return response.json();
};

const ListsPage = () => {
  const [tierLists, setTierLists] = useState<TierListDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentList, setCurrentList] = useState<TierListDTO | null>(null);

  useEffect(() => {
    const userId = 1; // Replace with dynamic user ID if needed
    fetchTierListsByUserId(userId)
      .then((data) => {
        setTierLists(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load tier lists");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8090/api/tier_lists/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setTierLists(tierLists.filter((tierList) => tierList.id !== id));
    } catch (error) {
      console.error("Error deleting tier list:", error);
    }
  };

  const handleNewListClick = () => {
    setCurrentList(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditListClick = (list: TierListDTO) => {
    setCurrentList(list);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (
    title: string,
    description: string,
    image: File | null
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", image!);

      const uploadResponse = await fetch(
        "http://localhost:8090/api/tier_lists/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.imageUrl;

      const tierListDTO = {
        name: title,
        imageUrl: imageUrl,
        userId: 1,
        description: description,
        categoryId: null,
      };

      const response = await fetch("http://localhost:8090/api/tier_lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tierListDTO),
      });

      if (!response.ok) {
        throw new Error("Failed to create new tier list");
      }

      const createdTierList = await response.json();
      setTierLists((prevTierLists) => [...prevTierLists, createdTierList]);
      handleCloseModal();
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating new tier list");
    }
  };

  const handleFormUpdate = async (
    id: number,
    title: string,
    description: string,
    image: File | null
  ) => {
    try {
      let imageUrl = currentList!.imageUrl;

      if (image) {
        const formData = new FormData();
        formData.append("file", image);

        const uploadResponse = await fetch(
          "http://localhost:8090/api/tier_lists/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl;
      }

      const updatedTierListDTO = {
        name: title,
        imageUrl: imageUrl,
        userId: 1,
        description: description,
        categoryId: null,
      };

      const response = await fetch(
        `http://localhost:8090/api/tier_lists/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTierListDTO),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update tier list");
      }

      const updatedTierList = await response.json();
      setTierLists((prevTierLists) =>
        prevTierLists.map((list) => (list.id === id ? updatedTierList : list))
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating tier list");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="p-4 flex flex-wrap gap-3">
        {tierLists.map((tierList) => (
          <div className=" ">
            <ListCard
              key={tierList.id}
              tierList={tierList}
              onEdit={() => handleEditListClick(tierList)}
              onDelete={handleDelete}
            />
          </div>
        ))}
        <div
          className="bg-slate-900 border-slate-800 border-4 border-dashed rounded-lg items-center justify-center cursor-pointer flex flex-col h-56 w-64"
          onClick={handleNewListClick}
        >
          <h3 className="text-lg font-bold text-white mb-2">New List</h3>
          <FontAwesomeIcon
            icon={faCirclePlus}
            className="text-white text-3xl"
          />
        </div>
      </div>
      <button
        className="fixed bottom-4 right-4 p-4 bg-teal-500 text-white rounded-full shadow-md"
        onClick={handleNewListClick}
      >
        <FontAwesomeIcon icon={faCirclePlus} size="2x" />
      </button>
      <ListModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        onUpdate={handleFormUpdate}
        isEditing={isEditing}
        currentList={currentList}
      />
    </div>
  );
};

export default ListsPage;
