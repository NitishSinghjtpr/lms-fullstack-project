import HomeLayout from "../layout/HomeLayout";
import aboutMainPage from "../assets/about1.png";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";
import CarouselSlide from "./../components/CarouselSlide";

function AboutUs() {
  const celebrities = [
    {
      title: "String",
      description: "pw is best tuter",
      image: img1,
      slideNumber: 1,
    },
    {
      title: "String",
      description: "pw is best tuter",
      image: img2,
      slideNumber: 2,
    },
    {
      title: "String",
      description: "pw is best tuter",
      image: img3,
      slideNumber: 3,
    },
    {
      title: "String",
      description: "pw is best tuter",
      image: img4,
      slideNumber: 4,
    },
  ];
  return (
    <HomeLayout>
      <div className="pl-20 pt-20 flex flex-col text-white">
        <div className="flex items-center gap-5 mx-10">
          <section className="w-1/2 space-y-10">
            <h1 className="text-5xl text-yellow-500 font-semibold">
              Affortable nad quality education
            </h1>
            <p className="text-xl text-gray-200">
              Our goal is to provide affortable and quality education to the
              world. we are providing the plateform for the aspiring teachers
              and student to share their Skills, creativity and each other!
            </p>
          </section>

          <div className="w-1/2">
            <img className="drop-shadow-2xl" src={aboutMainPage} alt="" />
          </div>
        </div>

        <div className="carousel w-full max-w-2xl mx-auto mt-20 mb-10">
          {celebrities.map((celebritie) => (
            <CarouselSlide
              key={celebritie.slideNumber}
              {...celebritie}
              totalSlideNumber={celebrities.length}

            />
          ))}
        </div>
      </div>
    </HomeLayout>
  );
}

export default AboutUs;
