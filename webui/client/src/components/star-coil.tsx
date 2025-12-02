import { useEffect, useRef } from 'react';
import { StarPattern, calculateCoordinates } from '@/lib/star-logic';

interface StarCoilProps {
    pattern: StarPattern;
    size?: number;
    showPoints?: boolean;
    showLabels?: boolean;
    showLines?: boolean; // Lines from center
}

export function StarCoil({ pattern, size = 800, showPoints = true, showLabels = true, showLines = false }: StarCoilProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, size, size);

        // Setup styling
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '12px "JetBrains Mono"'; // Use our monospaced font
        
        const center = size / 2;
        const coords = calculateCoordinates(pattern.points, size);

        // Shift the star pattern down by 80 points to avoid text overlap
        ctx.save();
        ctx.translate(0, 80);

        // Draw lines from center if requested (Python: if includelines)
        if (showLines) {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            for (let i = 1; i <= pattern.points; i++) {
                const pt = coords[i];
                ctx.beginPath();
                ctx.moveTo(center, center);
                ctx.lineTo(pt.x, pt.y);
                ctx.stroke();
            }
        }

        // Draw points and numbers
        if (showPoints || showLabels) {
            ctx.fillStyle = 'black';
            for (let i = 1; i <= pattern.points; i++) {
                const pt = coords[i];
                
                if (showLabels) {
                    ctx.fillText(i.toString(), pt.x, pt.y);
                } else if (showPoints) {
                     ctx.beginPath();
                     ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
                     ctx.fill();
                }
            }
        }

        // Draw the Star Pattern
        // Python: draw.line([(x, y), (next_x, next_y)], fill='black', width=2)
        if (pattern.windingPattern.length > 0) {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            const startId = pattern.windingPattern[0];
            const startPt = coords[startId];
            ctx.moveTo(startPt.x, startPt.y);

            for (let i = 1; i < pattern.windingPattern.length; i++) {
                const nextId = pattern.windingPattern[i];
                const nextPt = coords[nextId];
                ctx.lineTo(nextPt.x, nextPt.y);
            }
            ctx.stroke();
        }
        
        ctx.restore();

        // Add Text Annotations (mimicking the Python script's text overlay)
        // Word wrap logic for the long winding pattern string
        const maxWidth = size - 40;
        const prefix = "Winding pattern: 1,";
        
        let currentLine = prefix;
        let yPos = 20;
        const lineHeight = 15;

        ctx.fillStyle = 'black';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        if (pattern.windingPattern.length === 0) {
             ctx.fillText(prefix.replace(',', ''), 20, yPos);
             yPos += lineHeight;
        } else {
            for (let i = 0; i < pattern.windingPattern.length; i++) {
                const isLast = i === pattern.windingPattern.length - 1;
                const numStr = pattern.windingPattern[i].toString() + (isLast ? '' : ',');
                const testLine = currentLine + numStr;
                const metrics = ctx.measureText(testLine);
                
                if (metrics.width > maxWidth) {
                    ctx.fillText(currentLine, 20, yPos);
                    currentLine = numStr;
                    yPos += lineHeight;
                } else {
                    currentLine = testLine;
                }
            }
            ctx.fillText(currentLine, 20, yPos);
            yPos += lineHeight;
        }

        ctx.fillText(`Points on circle: ${pattern.points}`, 20, yPos); yPos += lineHeight;
        ctx.fillText(`Angle between points: ${(360 / pattern.points).toFixed(1)}`, 20, yPos); yPos += lineHeight;
        ctx.fillText(`Step Size: ${pattern.stepSize}`, 20, yPos); yPos += lineHeight;
        ctx.fillText(`Tips: ${pattern.tips}`, 20, yPos); yPos += lineHeight;
        ctx.fillText(`Iteration: ${pattern.iteration}`, 20, yPos);

    }, [pattern, size, showPoints, showLabels, showLines]);

    return (
        <div className="border border-border shadow-sm bg-white inline-block">
            <canvas 
                ref={canvasRef} 
                width={size} 
                height={size} 
                className="max-w-full h-auto block"
            />
        </div>
    );
}
