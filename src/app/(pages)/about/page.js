export default function AboutPage() {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-16 px-4 sm:px-8 mt-8">
        <div className="container mx-auto text-center">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 tracking-wide">
            About{' '}
            <span className="text-5xl sm:text-6xl md:text-6xl lg:text-6xl tracking-wide font-extrabold font-roboto bg-gradient-to-r from-purple-500 to-indigo-600 text-transparent bg-clip-text py-2 rounded-lg">
              ClubConnect
            </span>
          </h1>
  
          {/* Description */}
          <p className="text-xl sm:text-2xl md:text-3xl mb-16 font-semibold mx-auto max-w-2xl sm:max-w-3xl px-4">
            <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-transparent font-extrabold bg-clip-text">
              ClubConnect
            </span>{' '}
            is a platform designed to seamlessly connect students and clubs at{' '}
            <span className="font-extrabold font-roboto bg-gradient-to-r from-[#db8951] to-[#c36421] text-transparent bg-clip-text">
              IIIT UNA
            </span>
            , making event management easy and efficient.
          </p>
  
          {/* Grid for Mission, Vision, Developer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {/* Mission Section */}
            <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-4 ">
                Mission
              </h2>
              <p className="text-base sm:text-lg leading-relaxed">
                Our mission is to provide a seamless experience for managing clubs, events, and activities while fostering a sense of community.
              </p>
            </div>
  
            {/* Vision Section */}
            <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-4">Vision</h2>
              <p className="text-base sm:text-lg leading-relaxed">
                We aim to create a unified platform that enhances collaboration, growth, and participation within the IIIT Una community.
              </p>
            </div>
  
            {/* Developer Section */}
            <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-4">
                About The Developer
              </h2>
              <p className="text-base sm:text-lg font-semibold leading-relaxed">
                Developed by{' '}
                <a
                  className="font-extrabold underline text-blue-500 cursor-pointer"
                  href="https://linkedin.com/in/jatin-raosahab"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Jatin Yadav
                </a>
                , a student of{' '}
                <span className="font-bold bg-gradient-to-r from-[#db8951] to-[#c36421] text-transparent bg-clip-text">
                  Information Technology at IIIT Una
                </span>
                , passionate about building impactful technology.
              </p>
            </div>
          </div>
  
          {/* Contact Call to Action */}
          <div className="mt-12 sm:mt-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
            <p className="text-lg sm:text-xl mb-6">
              Have any questions or want to collaborate? We’d love to hear from you!
            </p>
            <a
              href="mailto:contact@iiituna.ac.in"
              className="text-lg sm:text-xl bg-white hover:bg-gray-300 font-bold text-gray-700 py-3 px-6 sm:px-8 rounded-lg transition duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    );
  }
  