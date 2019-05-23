# starcoil
Given a number of points on a circle, locate and print the stars available - a perfect spirograph where you start and stop in the same place.

This is a Perl script which uses libgd, libpng and/or libjpg to create graphics of stars or perfect spriographs (start and end in the exact same spot.)

Imagine you have 10 pins equally spaced in a circle.  This script tests every permutation of "step sizes" (the distance from one pin to the next pin in the sequence).  Wherever a perfect spirograph can be created (starting on pin 1 and ending on pin 1), that starcoil is saved.  After all iterations, all perfect starcoils are generated into graphics.  For example, with 10 pins and a step size of 4, you start at pin 1, go 4 steps to pin 5, then pin 9, 3, 7, and back to 1.  This creates a pentagram star.

I do not use a step size of 1 as that is just wrapping a wire around the outside of the circle of pins and not of interest.

Very Interesting Findings So Far:
All factors of a number produce a star
  -The number of stars produced per factor appears to have a pattern, but I have not found it.
Prime numbers have an equvalent number of star points and generate ~1/2 the number of stars.
  -97 has 97 star points and there are 47 stars taking all step sizes from 1-47.

History
I began this project to help me wrap star coils with thin magnet wire (coated copper wire).  My theory being that A X B of currents in crossing wires can create a cascading expanding/colapsing magnetic field.  When pulsed with an A/C wave you would generate a resonating and ever expanding/collapsing magentic field with minimal heat and energy.  If this star coil was wrapped around a torus (3d) versus a god's eye with pins (2D) then the resonance could be obtained far quicker.

The theory being, take two wires that are crossed at 90 degrees (+) (AXB=0, Maxwell's equation leads to the least resistance from magnetic interference (regardless of current direction in each wire). FYI, Cat 6 & Cat 7 ethernet cables are wrapped very tight (twisted-pair) to get as close to 90 degrees as possible so that signals can travel as fast through the wires as possible without latency interference from magnetism.  At the other end of the spectrum is wires in parallel (=) with currents running in opposite directions where A X B=1 and magentic interference is at a maximum.

My ideas lead me to find such off-shoots on the web at Vortex Math and the Rodin Coil (https://rationalwiki.org/wiki/Vortex-based_math)

So, create a starcoil where the magnetism goes from a maximum (parallel) to a minimum (perpendicular), and pulse this with an A/C signal.  On a Rodin/Torus Coil each A/C peak would essentially create a wave that travelled all the way around the coil.  The idea is to get an A/C signal that would continuously push this electromagnetic wave around the coil with very little input once resonance is reached.


