import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Carousel from "./Carousel";

function ListImg({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const maxVisible = 3; // số ảnh hiển thị trực tiếp
  const extraCount = images.length - maxVisible; // số ảnh còn lại
 
  return (
    <div className="grid grid-cols-2 gap-1">
      {images.slice(0, maxVisible).map((img, index) => (
        <Dialog key={index}>
          <DialogTrigger asChild>
            <img
              src={img}
              alt={`img-${index}`}
              className="h-32 w-full object-cover rounded cursor-zoom-in"
              onClick={() => setSelectedImage(img)}
            />
          </DialogTrigger>
          <DialogContent className="bg-transparent border-none p-0 max-w-fit">
            <img
              src={selectedImage}
              className="max-h-[80vh] rounded shadow-xl"
              alt={`Zoomed ${index}`}
            />
          </DialogContent>
        </Dialog>
      ))}

      {/* Nếu có ảnh thừa thì hiển thị ô +x */}
      {extraCount > 0 && (
        <Dialog>
          <DialogTrigger asChild>
            <div
              className="relative h-32 w-full rounded bg-gray-300 flex items-center justify-center cursor-zoom-in"
              onClick={() => setSelectedImage(images[maxVisible])}
            >
              <img
                src={images[maxVisible]}
                alt={`img-${maxVisible}`}
                className="absolute inset-0 object-cover rounded opacity-50"
              />
              <span className="relative text-white text-2xl font-bold bg-black bg-opacity-50 rounded px-3 py-1">
                +{extraCount}
              </span>
            </div>
          </DialogTrigger>
          <DialogContent className="bg-transparent border-none p-0 max-w-fit">
            {/* <img
              src={selectedImage}
              className="max-h-[80vh] rounded shadow-xl"
              alt="Zoomed extra"
            /> */}
            <Carousel images={images}/>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default ListImg;
