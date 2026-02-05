import React from "react";

const CarouselSlide = ({
  title,
  description,
  slideNumber,
  totalSlideNumber,
  image,
}) => {
  return (
    <div
      id={`slide${slideNumber}`}
      className="carousel-item relative w-full flex flex-col items-center"
    >
      {/* IMAGE */}
      <div className="relative flex items-center justify-center">
        <a
          href={`#slide${
            slideNumber === 1 ? totalSlideNumber : slideNumber - 1
          }`}
          className="btn btn-circle absolute left-[-60px] top-1/2 -translate-y-1/2"
        >
          ❮
        </a>

        <img
          src={image}
          className="w-48 h-48 object-cover rounded-full border-4 border-gray-300 shadow-xl"
          alt={title}
        />

        <a
          href={`#slide${
            slideNumber === totalSlideNumber ? 1 : slideNumber + 1
          }`}
          className="btn btn-circle absolute right-[-60px] top-1/2 -translate-y-1/2"
        >
          ❯
        </a>
      </div>

      {/* DESCRIPTION */}
      <p className="text-lg text-gray-200 mt-6 text-center px-10">
        {description}
      </p>

      {/* TITLE */}
      <h1 className="text-2xl font-semibold mt-2 text-center">{title}</h1>
    </div>
  );
};

export default CarouselSlide;
