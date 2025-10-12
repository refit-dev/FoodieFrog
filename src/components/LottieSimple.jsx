"use client";
import Lottie from "lottie-react";
import animationData from "../../public/Contact Us.json"; // public বা src পথ

export default function LottieSimple({ loop = true, autoplay = true, style }) {
  return (
    <div style={{  width: 400, height: 500, ...style }}>
      <Lottie animationData={animationData} loop={loop} autoplay={autoplay} />
    </div>
  );
}
