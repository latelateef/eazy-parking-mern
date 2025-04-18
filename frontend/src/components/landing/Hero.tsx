import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { TextGenerateEffect, TextGenerateEffectFast } from "../ui/text-generate-effect";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight">
              <TextGenerateEffect words="Book Your Spot."></TextGenerateEffect>
              <TextGenerateEffect className="text-gray-500" words="Park with Ease."></TextGenerateEffect>
            </h1>
            <TextGenerateEffectFast className="text-xl text-gray-600 max-w-lg"
              words="The smart way to find and book parking spaces in your city. No more circling blocks or stressing over spots.">
            </TextGenerateEffectFast>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size={"lg"}>
                <Link to="/register"> Create Account</Link>
              </Button>
              <Button asChild size={"lg"}>
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-2xl">
              <img
                src="https://img.freepik.com/premium-photo/car-parked-designated-spot_1375194-69289.jpg?w=2000"
                alt="Parking Management System"
                className="object-cover fill"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-xl font-bold">Smart Parking Solutions</p>
                <p>For businesses and individuals</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
