import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative blur circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl -z-10"></div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-16">
        {/* Heading */}
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          About{" "}
          <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
            VolunteerConnect
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="max-w-3xl text-lg md:text-xl text-gray-700 leading-relaxed mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          VolunteerConnect is a platform that bridges the gap between{" "}
          <strong>Volunteers, NGOs, and Corporates</strong>.  
          Our mission is to make social impact accessible, transparent, and collaborative — empowering
          people to contribute meaningfully to causes that matter.
        </motion.p>

        {/* Mission and Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          <motion.div
            className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-lg p-8 text-left hover:shadow-2xl transition-all"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <h2 className="text-2xl font-bold text-green-600 mb-4">🌍 Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To build a connected community where every individual and organization can
              contribute towards sustainable change — through volunteering, partnerships,
              and shared responsibility.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-lg p-8 text-left hover:shadow-2xl transition-all"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            <h2 className="text-2xl font-bold text-blue-600 mb-4">💡 Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To become the global platform that unites good causes and good people,
              driving measurable social impact with technology and compassion.
            </p>
          </motion.div>
        </div>

        {/* Impact Section */}
        <motion.div
          className="mt-16 max-w-4xl bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-10 shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">💪 Our Impact</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Thousands of volunteers and organizations have already connected through VolunteerConnect,
            creating positive change across education, healthcare, environment, and community development.
            Together, we’re making service more impactful and scalable.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <a
            href="/contact"
            className="px-10 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
          >
            Contact Us
          </a>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center">
        © {new Date().getFullYear()} VolunteerConnect — Empowering Change Together
      </footer>
    </div>
  );
}
