class Gradient {
    gradients = [];

    addStop(color, percentage) {
        if (percentage < 0) {
            percentage = 0;
        }
        if (percentage > 100) {
            percentage = 100;
        }
        const existingIndex = this.gradients.findIndex( x => x.percentage === percentage);
        if (existingIndex < 0) {
            this.gradients.push({
                color: color,
                percentage: percentage
            })
        } else {
            this.gradients[existingIndex].color = color;
        }
        this.gradients.sort((a, b) => a.percentage - b.percentage);
    }

    getMinOrEqualIndex(per) {
        let index = -1;
        for (let i = 0 ; i < this.gradients.length ; i++) {
            if (per < this.gradients[i].percentage) {
                break;
            }
            index = i;
        }
        // console.log("Index of " + per + " is ", index, this.gradients[index]);
        return index;
    }

    getIndexRange(per) {
        // Check if Percentage is in range
        if (per >= 0 && per <= 100) {
            const minOrEqIndex = this.getMinOrEqualIndex(per);
            // Check if minOrEqIndex is in gradients array range
            if (minOrEqIndex >= 0 && minOrEqIndex < this.gradients.length) {
                // Check if minOrEqIndex is last item of gradient array
                if (minOrEqIndex === this.gradients.length - 1) {
                    return [minOrEqIndex, minOrEqIndex];
                }
                // Check if percentage is exact gradient stop
                if (per === this.gradients[minOrEqIndex].percentage) {
                    return [minOrEqIndex, minOrEqIndex];
                }

                // Else return lower and next Index
                return [minOrEqIndex, minOrEqIndex+1];
            }
        }
        
        return [-1,-1];
    }

    calculateColor(startColor, endColor, percent) {
        const res = new Color();
        const per = percent / 100;
        res.red = parseInt(startColor.red + per * (endColor.red - startColor.red), 10);
        res.green = parseInt(startColor.green + per * (endColor.green - startColor.green), 10);
        res.blue = parseInt(startColor.blue + per * (endColor.blue - startColor.blue), 10);
        return res;
    }

    calculateDivisionPercent(range, percent) {   
        const low = this.gradients[range[0]].percentage;
        const high = this.gradients[range[1]].percentage;
        const diff = high - low;
        const newPosition = percent - low;
        if (diff != 0) {
            return (newPosition * 100) / diff;
        } else {
            return 0;
        }
    }

    getColor(percentage) {
        const range = this.getIndexRange(percentage);
        // Return 0 if index not in gradient range
        if (range.includes(-1)) {
            return new Color();
        }
        const newPer = this.calculateDivisionPercent(range, percentage);
        return this.calculateColor(this.gradients[range[0]].color, this.gradients[range[1]].color, newPer);
    }

}

class Color {    
    red = 0;
    green = 0;
    blue = 0;

    constructor(red, green, blue) {      
        this.red = this.limit(red);
        this.green = this.limit(green);
        this.blue = this.limit(blue);
    }

    limit(color) {
        if (color < 0) {
            return 0;
        }
        if (color > 255) {
            return 255;
        }
        return color;
    }

    equals(color) {
        return this.red === color.red && this.green === color.green && this.blue === color.blue;
    }

    toRGB() {
        return 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
    }

}