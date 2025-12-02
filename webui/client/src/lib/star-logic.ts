/**
 * Logic ported from starcoil.py
 */

export interface StarPattern {
    id: string;
    points: number;
    stepSize: number;
    tips: number;
    iteration: number;
    windingPattern: number[];
    filename: string;
}

export interface Point {
    x: number;
    y: number;
}

export function generateStarPatterns(points: number): StarPattern[] {
    if (points <= 0) return [];

    // stepsize = 360 / points (Used for drawing, not for finding patterns logic directly in the same way)

    const stars: { [key: number]: number[] } = {};
    let entry = 2; // Starting iteration index (from python: entry = 2)

    // Python: for i in range(2, int((points / 2) - 0.5) + 1):
    const limit = Math.floor((points / 2) - 0.5);

    for (let i = 2; i <= limit; i++) {
        let dest = 1;
        const destinations = [1]; // Start with 1

        while (true) {
            dest += i;
            if (dest > points) {
                dest -= points;
            }
            destinations.push(dest);
            
            if (dest === 1) {
                break;
            }
        }

        // In Python logic:
        // destinations.insert(0, i) -> This seems to store the 'step' as the first element
        // stars[entry] = destinations.copy()
        // entry += 1
        
        // Adapting for TS structure
        const starPoints = [...destinations];
        // The first element in Python's stars[entry] was 'i' (the step size for this pattern iteration)
        
        stars[entry] = [i, ...starPoints];
        entry++;
    }

    const results: StarPattern[] = [];

    // Process each star pattern to match the Python output format
    const sortedKeys = Object.keys(stars).map(Number).sort((a, b) => a - b);

    for (const key of sortedKeys) {
        const data = stars[key];
        const step = data[0]; // extracted 'i'
        // The rest are the points visited: 1, ...
        const starPoints = data.slice(1);
        
        // In Python: firstpoint = starpoints.pop(0) -> which is 1
        // But wait, in Python:
        // starsteps = starpoints.pop(0)  <-- This was 'i'
        // firstpoint = starpoints.pop(0) <-- This is '1'
        // Then it draws lines between remaining points
        
        const totalTips = starPoints.length - 1; // Python: len(starpoints) - 2 (because they popped 2 items)
        // Here starPoints includes the '1' at start.
        
        // Filename format: P090-S004-T045-I004.jpg
        // P{points}-S{step}-T{tips}-I{iteration}
        const filename = `P${points.toString().padStart(3, '0')}-S${step.toString().padStart(3, '0')}-T${totalTips.toString().padStart(3, '0')}-I${key.toString().padStart(3, '0')}.jpg`;

        results.push({
            id: filename,
            points,
            stepSize: step,
            tips: totalTips,
            iteration: key,
            windingPattern: starPoints, // The sequence of points connected
            filename
        });
    }

    return results;
}

export function calculateCoordinates(points: number, size: number): { [key: number]: Point } {
    const coords: { [key: number]: Point } = {};
    const stepAngle = 360 / points;
    const radius = (size / 2) - 40;
    const centerX = size / 2;
    const centerY = size / 2;

    for (let i = 0; i < points; i++) {
        // angle = i * stepsize
        const angle = i * stepAngle;
        // radian = math.radians(angle + 270)
        const radian = (angle + 270) * (Math.PI / 180);

        const x = centerX + radius * Math.cos(radian);
        const y = centerY + radius * Math.sin(radian);

        // Store point coordinates (1-based index to match Python)
        coords[i + 1] = { x, y };
    }
    return coords;
}
