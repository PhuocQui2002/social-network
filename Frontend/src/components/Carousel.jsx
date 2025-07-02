import React, { useState } from "react";
import Image1 from "../assets/Nam1.jpg";
import Image2 from "../assets/background.jpg";
import Image3 from "../assets/BG.jpg";
import Image4 from "../assets/backrout.jpg";
function Carousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    
    //setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full" id="custom-carousel">
      {/* Slides container */}
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {console.log(images.length)}
        {images.map((image, index) => (
            
          <div
            key={index}
            className={`absolute w-full h-full duration-700 ease-in-out transition-opacity ${
              index === currentIndex ? "opacity-100 z-20" : "opacity-0 z-10"
            }`}
          >
           <img src={image}/>
          </div>
        ))}
      </div>

     
    </div>
  );
}

export default Carousel;
