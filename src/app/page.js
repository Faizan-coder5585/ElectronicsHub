import Banners from "../components/Banners.js";
import Brands from "../components/Brands.js";
import Category from "../components/Category.js";
import HelpCenter from "../components/HelpCenter.js";
import Hero from "../components/Hero.js";
import Newslater from "../components/Newslater.js";
import Sale from "../components/Sale.js";
import Sellers from "../components/Sellers.js";
import Services from "../components/Services.js";
import Special from "../components/Special.js";



const Home = () => {
  return (
   <>
   <Hero/>
   <Banners/>
   <Services/>
   <Sellers/>
   <Category/>
   <Sale/>
   <Special/>
   <Brands/>
   <Newslater/>
   <HelpCenter/>
   </>
  );
};

export default Home;
