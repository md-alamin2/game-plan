import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt, FaPhone, FaClock, FaDirections } from "react-icons/fa";

const Location = () => {
  const clubLocation = [23.909155912872848, 90.262328282984];
  const zoomLevel = 15;

  return (
    <div className="mt-18 md:mt-40 py-30 bg-base-200">
      <div className="w-11/12 lg:container mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-2">
            Visit Our Club
          </h2>
          <p className="text-lg text-gray-600">
            Conveniently located in the heart of the city
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side */}
          <motion.div
            className="bg-base-100 shadow-lg rounded-lg p-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary" />
                Address & Contact
              </h3>
              <div>
                <h4 className="font-bold">Address</h4>
                <div className="space-y-1">
                  <p>123 Sports Avenue</p>
                  <p>Savar, Dhaka</p>
                  <p>Bangladesh</p>
                </div>
              </div>
              <div>
                <h4 className="font-bold">Phone</h4>
                <p className="mt-1 flex items-center gap-2">
                  <FaPhone className="text-primary" /> +1 (555) 123-4567
                </p>
              </div>
              <div>
                <h4 className="font-bold flex items-center gap-2">
                  <FaClock className="text-secondary" />
                  Operating Hours
                </h4>
                <p className="mt-1">Monday - Friday: 6:00 AM - 10:00 PM</p>
                <p>Saturday - Sunday: 7:00 AM - 9:00 PM</p>
              </div>
            </div>

            <div className="pt-4">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${clubLocation[0]},${clubLocation[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-white"
              >
                <FaDirections className="mr-2" />
                Get Directions
              </a>
            </div>
          </motion.div>

          {/* Right Side - Map */}
          <motion.div
            className="h-96 lg:h-full rounded-lg overflow-hidden shadow-lg z-0"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <MapContainer
              center={clubLocation}
              zoom={zoomLevel}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={clubLocation}>
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold">GamePlane Sports Club</h3>
                    <p>123 Sports Avenue</p>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${clubLocation[0]},${clubLocation[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Click to open in maps
                    </a>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Location;
