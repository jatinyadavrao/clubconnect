import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-20 bg-gray-900 md:mt-0 mt-16">
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl lg:text-6xl text-white font-extrabold">
            <span className="block text-4xl md:text-6xl lg:text-6xl font-roboto bg-gradient-to-r from-purple-500 to-indigo-600 text-transparent bg-clip-text py-2 rounded-lg">
              ClubConnect
            </span>
            <span className="block text-3xl md:text-4xl lg:text-6xl">
              An Event Management Website
            </span>
            <span className="block text-3xl md:text-4xl lg:text-6xl mt-3 ">
              for <span className=' text-3xl md:text-4xl lg:text-6xl font-roboto bg-gradient-to-r from-[#db8951] to-[#c36421] text-transparent bg-clip-text'>IIIT UNA</span>
            </span>
          </h1>
          <Link href="/events">
            <button className="mt-8 px-6 py-3 md:px-8 md:py-4 bg-white text-black text-lg font-extrabold rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300">
              Explore Events
            </button>
          </Link>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 md:pl-10">
          <Image
            src={'/logo.png'}
            alt="ClubConnect Image"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </main>
  );
}
