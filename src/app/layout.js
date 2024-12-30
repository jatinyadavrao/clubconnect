import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({ weight: "700", subsets: ["latin"] });

export const metadata = {
  title: "ClubConnect",
  description: "An Event Management Website for Clubs of IIIT Una",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
        <NavBar />
        <Toaster/>
        {children}
        </UserProvider>
      </body>
    </html>
  );
}
