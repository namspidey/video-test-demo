import { MdHome } from "react-icons/md";
import { MdExplore } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

export default function Navbar() {
    return (
        <>
            {/* Mobile */}
            <div className="
                fixed bottom-0 left-0
                w-full z-50
                bg-black/80 backdrop-blur-md
                text-white
                flex justify-around items-center
                py-4
                md:hidden
                ">

                <button className="cursor-pointer transition-transform hover:scale-105">
                    <MdHome className="text-3xl" />
                </button>

                <button className="cursor-pointer transition-transform hover:scale-105">
                    <MdExplore className="text-3xl" />
                </button>

                <button className="cursor-pointer transition-transform hover:scale-105">
                    <CgProfile className="text-3xl" />
                </button>
            </div>

            {/* Desktop */}
            <div className="
                hidden md:flex
                fixed left-0 top-0 z-50
                h-screen w-52
                bg-black
                text-white
                flex-col
                p-4 gap-2
                ">

                <button className="
                    flex items-center gap-3
                    
                    cursor-pointer

                    px-4 py-3
                    rounded-xl

                    transition-all duration-200

                    hover:bg-white/10
                    hover:text-white
                    ">
                    <MdHome className="text-3xl" />
                    <span>Home</span>
                </button>

                <button className="
                    flex items-center gap-3
                    
                    cursor-pointer

                    px-4 py-3
                    rounded-xl

                    transition-all duration-200

                    hover:bg-white/10
                    hover:text-white
                    ">
                    <MdExplore className="text-3xl" />
                    <span>Explore</span>
                </button>

                <button className="
                    flex items-center gap-3
                    
                    cursor-pointer

                    px-4 py-3
                    rounded-xl

                    transition-all duration-200

                    hover:bg-white/10
                    hover:text-white
                    ">
                    <CgProfile className="text-3xl" />
                    <span>Profile</span>
                </button>
            </div>
        </>
    );
}