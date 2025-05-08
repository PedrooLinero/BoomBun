import { Outlet } from "react-router";
import Menu from "../components/Menu";  
import Footer from "../components/Footer";

function Home(){
    return (
        <>
            <Menu/>
            <Outlet />
            <Footer />
        </>
    );
}

export default Home;