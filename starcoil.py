#!/usr/bin/env python3
import sys
import math
import argparse
import subprocess
import platform
from PIL import Image, ImageDraw, ImageFont

size = 800

# Parse command line arguments
parser = argparse.ArgumentParser(description='Generate star coil patterns')
parser.add_argument('-p', '--points', type=int, help='Number of star points (should be an odd number)')
parser.add_argument('-it', '--include-text', action='store_true', help='Include text annotations on images')
parser.add_argument('-il', '--include-lines', action='store_true', help='Include lines from center to points')
parser.add_argument('-d', '--display', action='store_true', help='Open generated images after creation')

args = parser.parse_args()

# Get points value
if args.points:
    points = args.points
else:
    points_input = input("How many star points (1/2 points should be an odd number: 90, 30, [10])? ")
    points = int(points_input) if points_input else 10

# Get includetext value
if args.include_text:
    includetext = 'y'
else:
    includetext = input("Include text ([y]/n)? ") if not args.points else 'y'
    includetext = includetext if includetext else 'y'

# Get includelines value
if args.include_lines:
    includelines = 'y'
else:
    includelines = input("Include lines (y/[n])? ") if not args.points else 'n'
    includelines = includelines if includelines else 'n'

# Get display value
if args.display:
    display = True
else:
    if args.points:
        # If command line args were used, default to yes
        display = True
    else:
        # If interactive mode, ask the user
        display_input = input("Display generated images? ([y]/n)? ")
        display = display_input.lower() != 'n'

stepsize = 360 / points

print("Finding star patterns: ", end='', flush=True)

dest = 1
entry = 2
stars = {}
destinations = [1]
generated_files = []

for i in range(2, int((points / 2) - 0.5) + 1):
    while True:
        dest += i
        if dest > points:
            dest -= points
        destinations.append(dest)
        if dest == 1:
            break

    destinations.insert(0, i)
    stars[entry] = destinations.copy()
    print(entry, end=' ', flush=True)
    entry += 1
    destinations = [1]

print()

# Process each star pattern
for star in sorted(stars.keys()):
    # Create new image
    img = Image.new('RGB', (size, size), color='white')
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 12)
    except:
        font = ImageFont.load_default()

    print("Generating graph of each star point: ", end='', flush=True)

    pointcoords = {}
    point = 1

    for i in range(points):
        angle = i * stepsize
        # Calculate position
        center_x = size / 2
        center_y = size / 2

        # Convert angle to radians (add 270 to match Perl's angle offset)
        radian = math.radians(angle + 270)

        # Calculate end point of line from center
        radius = (size / 2) - 40
        x = center_x + radius * math.cos(radian)
        y = center_y + radius * math.sin(radian)

        # Draw line from center to point if requested
        if includelines.lower() == 'y':
            draw.line([(center_x, center_y), (x, y)], fill='black', width=1)

        # Store point coordinates
        pointcoords[point] = (x, y)

        # Draw point number
        draw.text((x, y), str(point), fill='black', font=font)
        point += 1
        print(".", end='', flush=True)

    print()

    print(f"Generating star graphics {star}")

    starpoints = stars[star].copy()
    totalstarpoints = len(starpoints) - 2

    starsteps = starpoints.pop(0)
    firstpoint = starpoints.pop(0)

    # Draw star pattern
    x, y = pointcoords[firstpoint]
    start_pos = (x, y)

    for item in starpoints:
        next_x, next_y = pointcoords[item]
        draw.line([(x, y), (next_x, next_y)], fill='black', width=2)
        x, y = next_x, next_y

    # Add text annotations if requested
    if includetext.lower() == 'y':
        starpoints_str = ','.join(map(str, starpoints))
        draw.text((20, 20), f"Winding pattern: 1,{starpoints_str}", fill='black', font=font)
        draw.text((20, 30), f"Points on circle: {points}", fill='black', font=font)
        draw.text((20, 40), f"Angle between points: {stepsize}", fill='black', font=font)
        draw.text((20, 50), f"Step Size: {starsteps}", fill='black', font=font)
        draw.text((20, 60), f"Tips: {totalstarpoints}", fill='black', font=font)
        draw.text((20, 70), f"Iteration: {star}", fill='black', font=font)

    # Save image
    filename = f"P{points:03d}-S{starsteps:03d}-T{totalstarpoints:03d}-I{star:03d}.jpg"
    print(filename)
    img.save(filename, 'JPEG')
    generated_files.append(filename)

print("\nDone!")

# Open images if display is enabled
if display and generated_files:
    print(f"\nOpening {len(generated_files)} generated image(s)...")
    for filename in generated_files:
        if platform.system() == 'Darwin':  # macOS
            subprocess.run(['open', filename])
        elif platform.system() == 'Windows':
            subprocess.run(['start', filename], shell=True)
        else:  # Linux and others
            subprocess.run(['xdg-open', filename])
