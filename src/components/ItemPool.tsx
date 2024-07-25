import { ChangeEvent, useRef, useState } from "react";
import { Item } from "../Type";
import ItemContainer from "./ItemContainer";
interface Props {
  items: Item[];
  createItems: (imageUrl: string[]) => void;
}
const ItemPool = (props: Props) => {
  const { createItems, items } = props;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);

      const imageUrls = newFiles.map((file) => URL.createObjectURL(file));
      createItems(imageUrls);
    }
  };
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <section className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 from-emerald-300 via-teal-400 to-teal-600 py-20 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center">
          {/* Item container */}
          <ItemContainer items={items} />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="hidden"
            multiple
          />

          <button
            className="bg-white text-teal-600 font-bold py-3 px-8 rounded-lg shadow-lg cursor-pointer transition-transform duration-300 hover:bg-orange-500 hover:text-white hover:scale-105"
            onClick={handleClick}
          >
            Add Item
          </button>
        </div>
      </div>
    </section>
  );
};

export default ItemPool;
