import { SVG } from "@svgdotjs/svg.js";

export enum DriveType {
    HDD35 = "3.5' HDD",
    HDD25 = "2.5' HDD",
    SSD25 = "2.5' SSD",
    NVME = "NVMe"
}

// 1U = 45 * 550
// 3.5Drive = 105 * 25, 2.5Drive = 70 * 15
const HD35X = 105;
const HD35Y = 24;
const HD25X = 70;
const HD25Y = 15;
const NVMEX = 70;
const NVMEY = 15;

export enum SlotOrientation {
    Vertical = "Vertical",
    Horizontal = "Horizontal"
}

export interface HardDriveConfig {
    name: string;
    size: DriveType;
    class_tag?: string;
    orientation?: SlotOrientation;
    width?: number;
    height?: number;
    svg?: any;
}

export class HardDrive implements HardDriveConfig {
    name: string;
    readonly size: DriveType;
    readonly class_tag?: string;
    orientation?: SlotOrientation;
    readonly width?: number;
    readonly height?: number;
    svg?: any;

    constructor(name: string, size:DriveType, orientation?:SlotOrientation, theclass?:string ) {
        this.name = name;
        this.size = size;
        this.width = NVMEX;
        this.height= NVMEY;
        // console.log("HardDrive type creating " + size );
        if ( size == DriveType.HDD35 ) {
        // console.log("Find it HardDrive type creating " + size );
            this.width = HD35X;
            this.height= HD35Y;
        } else if ( size == DriveType.HDD25 || size == DriveType.SSD25 ) {
        //   console.log("Find it HardDrive type creating " + size );
            this.width =HD25X;
            this.height=HD25Y;
        } else {
        //   console.log("Find error " + size );
            this.width =HD25X;
            this.height=HD25Y;
        }
        if ( theclass !== undefined ) {
            this.class_tag = theclass;
        } else {
            this.class_tag = 'HardDrive';
        }
        if ( orientation !== undefined ) {
            this.orientation = orientation;
        } else {
            this.orientation = SlotOrientation.Horizontal;
        }
        this.svg = SVG().group();
        this.svg.add( SVG('<harddrive name="' + this.name + '" class="' + this.class_tag + '" type="' + this.size + '" orientation="' + this.orientation + '"\>'));
        this.svg.add( SVG().rect( this.width, this.height ).attr({ fill: 'none', stroke: '#000', 'stroke-width': 2}).radius(this.height/5) );
        this.svg.add( SVG().text( this.size + ' ' + this.name ).font({ family: 'Helvetica', size: 12}).build(true).move(2,0));
        if ( this.orientation == SlotOrientation.Vertical ) {
            this.svg.rotate(90);
        }
    }

    getSVG(): typeof SVG {
        return this.svg;
    }

};


export { HardDrive as default }
