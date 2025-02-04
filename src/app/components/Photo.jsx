'use client'
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


const Photo = () => {

  gsap.registerPlugin(ScrollTrigger);
  const textRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  useEffect(() => {
    gsap.to(buttonRef.current, {
      y: 20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <section className="text-white body-font ubuntu-bold ">
      <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
        <img
          className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded"
          alt="hero"
          src="photo.png"
        />
        <div className="text-center lg:w-2/3 w-full">
          <h1
            ref={textRef}
            className="title-font font-extrabold text-5xl sm:text-4xl md:text-7xl mb-4 text-blue-500 text-center"
          >
            Say goodbye to crypto theft and weak security – Wall-ID ensures every transaction is verified.
          </h1>

          <div className="flex justify-center">
            <button
              ref={buttonRef}
              className="py-4 m-6 px-4 rounded-lg text-white bg-blue-500 transition-all hover:bg-blue-600 hover:scale-110 hover:shadow-lg hover:py-4 hover:px-6
                relative border-4 border-transparent bg-gradient-to-r from-blue-500 to-blue-700
                hover:bg-gradient-to-l hover:from-blue-700 hover:to-blue-500 
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500 before:to-blue-700 before:border-2 before:rounded-lg before:content-['']"
            >
              <span className="relative z-10 text-white hover:no-underline">
                  Get Started
              </span>


            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Photo;
