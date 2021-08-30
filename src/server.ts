// @ts-ignore
import { HardDrive, DriveType, SlotOrientation } from "./harddrive.ts";
import { SVG } from "@svgdotjs/svg.js";

export enum BoxType {
    Rackmount = "Rackmount",
    Tower     = "Tower",
    Custom    = "Custom"
}

// 1U = 48 * 550
const U_HEIGHT= 48;
const U_WIDTH = 550;

export interface ServerConfig {
    name: string;
    size: BoxType;
    server_unit: number;
    hd_slot: number;
    hd_row: number;
    hd_col: number,
    hd_z?:   number;
    class_tag?: string;
    width?: number;
    height?: number;
    readonly decoration_x?: number;
    readonly decoration_y?: number;
    svg?: any;
}

export class Server implements ServerConfig {
    name: string;
    readonly size: BoxType;
    readonly server_unit: number;
    readonly hd_slot: number;
    readonly hd_row:  number;
    readonly hd_col:  number;
    harddrive_list: HardDrive[];
    readonly hd_z?:   number;
    readonly class_tag?: string;
    readonly width?: number;
    readonly height?: number;
    readonly decoration_x?: number;
    readonly decoration_y?: number;
    svg?: any;

    constructor(name: string, size:BoxType, hd_slot: number, hd_row: number,
        hd_col: number, driveType: DriveType[], orientation?: SlotOrientation,
    server_unit?: number, width?: number, height?: number, theclass?:string) {
        this.name = name;
        this.size = size;
        this.hd_slot = hd_slot;
        this.hd_row  = hd_row;
        this.hd_col  = hd_col;
        var z_hd_slot= hd_row * hd_col;
        this.hd_z    = Math.ceil(hd_slot / z_hd_slot)-1;

        console.log( "Server Name:" + this.name)
        console.log( "Server Size:" + this.size)
        console.log( "Server slot:" + this.hd_slot)
        console.log( "Server row:" + this.hd_row)
        console.log( "Server col:" + this.hd_col)

        this.harddrive_list = new Array(this.hd_slot);
        for ( var i = 0; i < this.hd_slot; i++ ){
            this.harddrive_list[i] = new HardDrive( i, driveType[i], orientation );
        }
        if ( size == BoxType.Rackmount ) {
            if ( server_unit !== undefined ) {
                this.server_unit = server_unit;
                this.width = U_WIDTH;
                this.height= U_HEIGHT * this.server_unit;
                this.decoration_x = 100;
                this.decoration_y = 5;
            } else {
                console.log( "Error: Rackmount BoxType require server_unit");
            }

        } else if ( size == BoxType.Tower) {
            if ( server_unit !== undefined ) {
                this.server_unit = server_unit;
                this.width = U_HEIGHT * this.server_unit;
                this.height= U_WIDTH;
                this.decoration_x = 5;
                this.decoration_y = 50;
            } else {
                console.log( "Error: Tower BoxType require server_unit");
            }
        } else {
            console.log("Custom width x =" + width + " box height = " + height);
            if ( width !== undefined && height !== undefined ) {
                console.log( "Custom BoxType width " + width + " height " + height);
                this.width = width;
                this.height= height;
                this.decoration_x = 100;
                this.decoration_y = 100;
            } else {
                console.log( "Error: Custom BoxType require width and height");
                return;
            }
        }

        if ( theclass !== undefined ) {
            this.class_tag = theclass;
        } else {
            this.class_tag = "Server";
        }

        this.svg = SVG().group();
        this.svg.add( SVG('<server name="' + this.name + '" class="' + this.class_tag +
            '" type="' + this.size + '" row="' + this.hd_row + '" col="' + this.hd_col +
            '" z_slot="' + this.hd_z + '"\>'));

        let decoration = SVG().group();
        decoration.add( SVG().line(0, 0, 40, 0).stroke({width:3,color:"#000"}).move(5,0) );
        decoration.add( SVG().circle().fill("none").stroke({width:3,color:"#000"}).radius(5).move(20,5) );
        decoration.add( SVG().text( this.size ).font({ family: "Helvetica", size: 12}).build(true).move(5,18));
        decoration.add( SVG().text( this.name ).font({ family: "Helvetica", size: 12}).build(true).move(5,30));
        if ( size == BoxType.Tower) {
            decoration.add( SVG().text( "192.168.2.158" ).font({ family: "Helvetica", size: 12}).build(true).move(45,18));
            decoration.add( SVG().text( "192.168.128.158" ).font({ family: "Helvetica", size: 12}).build(true).move(45,30));
        } else {
            decoration.add( SVG().text( "192.168.2.158" ).font({ family: "Helvetica", size: 12}).build(true).move(5,43));
            decoration.add( SVG().text( "192.168.128.158" ).font({ family: "Helvetica", size: 12}).build(true).move(5,55));
        }

        //console.log( "Server Height = " + this.height + " Width =" + this.width);
        var row_gap = Math.floor( (this.height -this.decoration_y) / this.hd_row)-2;
        var col_gap = Math.floor( (this.width-this.decoration_x) / this.hd_col);

        for (var z = 0; z < this.hd_z+1; z++) {
            // console.log( "Hard-Drive Z = " + z + " z_hd_slot=" + z_hd_slot );
            let z_group = SVG().group();

            let box = SVG().rect(this.width, this.height).fill("none").stroke({color:"#000", width:5}).radius(5);
            let harddrive_group = SVG().group();

            for (var r = 0; r < this.hd_row; r++) {
            // console.log( "Hard-Drive Row = " + r );
                let new_row_group = SVG().group();
                for (var c = 0; c < this.hd_col && (z_hd_slot*z)+(this.hd_col*r+c) < this.hd_slot; c++) {
                    var pos = r * this.hd_col + z * z_hd_slot;
                    // var shift_y = this.harddrive_list[pos+c].height + 3;
                    // var shift_x = this.harddrive_list[pos+c].width + 3;
                    // console.log( "Hard-Drive Col = " + c + " width=" + shift_x + " height=" + shift_y );
                    // new_row_group.add( this.harddrive_list[pos+c].getSVG().move(0,-18*c) );
                    if ( orientation === SlotOrientation.Vertical ) {
                        new_row_group.add( this.harddrive_list[pos+c].getSVG().move(0, -col_gap*c) );
                    }
                    else {
                        new_row_group.add( this.harddrive_list[pos+c].getSVG().move(col_gap*c,0) );
                    }
                }
                new_row_group.move(this.decoration_x, this.decoration_y + row_gap*r+2);
                //console.log( "Hard-Drive Row gap = " + row_gap + " Col gap = " + col_gap + " shift_x=" + shift_x + " shift_y="+shift_y );
                harddrive_group.add( new_row_group );
            }
            if( z > 0 ) {
                box.attr({stroke: "#555","stroke-dasharray":[5,5] })
            } else {
                z_group.add(decoration.move(10,10));
            }
            z_group.add( box );
            z_group.add( harddrive_group.dmove(5,5) );
            z_group.move( z * (6 * this.server_unit), (this.hd_z - z) * this.height);
            this.svg.add(z_group);
        }
    }

    getSVG(): typeof SVG {
        return this.svg;
    }

};


export { Server as default }
