import type { NextPage } from "next";
import Navbar from 'src/components/navbar';
import Footer from 'src/components/footer';

const Layout: NextPage = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
}

export default Layout;