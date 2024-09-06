// bg-emerald-500 
import FeaturedItems from "./components/featuredItems";
import dynamic from "next/dynamic";
import Bio from "./components/bio";
import Info from "./components/dropshipingInfo";
const Carousel = dynamic(() => import("./components/testCarousel"), { ssr: false });
export default function Home() {
  return (
      <>
       <Carousel/>
       <Bio/>
       <Info/>
       <FeaturedItems/>
      </>
  );
}
