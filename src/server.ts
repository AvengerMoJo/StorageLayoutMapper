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
    hd_slot: number;
    hd_row: number;
    hd_col: number,
    hd_z?:   number;
    class_tag?: string;
    server_unit?: number;
    width?: number;
    height?: number;
    readonly decoration_x?: number;
    readonly decoration_y?: number;
    svg?: any;
    shape?: string;
}

export class Server implements ServerConfig {
    name: string;
    readonly size: BoxType;
    readonly hd_slot: number;
    readonly hd_row:  number;
    readonly hd_col:  number;
    harddrive_list: HardDrive[];
    readonly hd_z?:   number;
    readonly class_tag?: string;
    readonly server_unit?: number;
    readonly width?: number;
    readonly height?: number;
    readonly decoration_x?: number;
    readonly decoration_y?: number;
    svg?: any;
    shape?: string;

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

        this.harddrive_list = new Array(this.hd_slot);
        for ( var i = 0; i < this.hd_slot; i++ ){
            this.harddrive_list[i] = new HardDrive( i, driveType[i], orientation );
        }
        this.width = this.height = this.decoration_x = this.decoration_y = 0;
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
            if ( width !== undefined && height !== undefined ) {
                this.width = width;
                this.height= height;
                this.decoration_x = 100;
                this.decoration_y = 100;
            } else {
                console.log( "Error: Custom BoxType require width and height");
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

        let decoration_shape = `
    <fillstroke />
    <path>
        <move x="10" y="10"/>
        <line x="50" y="10"/>
    </path>
    <fillstroke />
    <ellipse x="25" y="15" w="10" h="10" />
    <stroke />
    <fillstroke />
    <text str="${this.size}" x="10" y="30" align="left" valign="middle" vertical="0" align-shape="1" />
    <text str="${this.name}" x="10" y="40" align="left" valign="middle" vertical="0" align-shape="1" />
    <stroke />
        `

        /*
        if ( size == BoxType.Tower) {
            decoration.add( SVG().text( "192.168.2.158" ).font({ family: "Helvetica", size: 12}).build(true).move(45,18));
            decoration.add( SVG().text( "192.168.128.158" ).font({ family: "Helvetica", size: 12}).build(true).move(45,30));
        } else {
            decoration.add( SVG().text( "192.168.2.158" ).font({ family: "Helvetica", size: 12}).build(true).move(5,43));
            decoration.add( SVG().text( "192.168.128.158" ).font({ family: "Helvetica", size: 12}).build(true).move(5,55));
        }
        */

        //console.log( "Server Height = " + this.height + " Width =" + this.width);
        var row_gap = Math.floor( (this.height -this.decoration_y) / this.hd_row)-2;
        var col_gap = Math.floor( (this.width-this.decoration_x) / this.hd_col);

        var z_shape = '';
        var hd_shape = ''; 
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
                    var text_y = this.harddrive_list[pos+c].height/10;
                    var text_x = this.harddrive_list[pos+c].width /10;
                    var z_x = z *(this.height/8);
                    var z_y = z*this.height;
                    // console.log( "Hard-Drive Col = " + c + " width=" + shift_x + " height=" + shift_y );
                    // new_row_group.add( this.harddrive_list[pos+c].getSVG().move(0,-18*c) );
                    if ( orientation === SlotOrientation.Vertical ) {
                        new_row_group.add( this.harddrive_list[pos+c].getSVG().move(0, -col_gap*c) );
                    }
                    else {
                        new_row_group.add( this.harddrive_list[pos+c].getSVG().move(col_gap*c,0) );
                    }
                    hd_shape+=`
    <fillstroke />
        ${this.harddrive_list[pos+c].getShape(this.decoration_x + c*col_gap + z_x, this.decoration_y+r*row_gap + z_y,
        this.decoration_x + c*col_gap + text_x + z_x, this.decoration_y+r*row_gap + text_y + z_y)}
    <stroke />`
                }
                new_row_group.move(this.decoration_x, this.decoration_y + row_gap*r+2);
                //console.log( "Hard-Drive Row gap = " + row_gap + " Col gap = " + col_gap + " shift_x=" + shift_x + " shift_y="+shift_y );
                harddrive_group.add( new_row_group );
            }
            if( z > 0 ) {
                box.attr({stroke: "#555","stroke-dasharray":[5,5] })
                z_shape +=`
<save/>
<dashed dashed="1"/>
                `
            } else {
                z_group.add(decoration.move(10,10));
            }
            z_group.add( box );
            z_group.add( harddrive_group.dmove(5,5) );
            z_group.move( z * (this.height / 8), (this.hd_z - z) * this.height);
            z_shape +=`
    <fillstroke />
    <rect x="${z*(this.height/8)}" y="${z*this.height}" w="${this.width}" h="${this.height}" />
    <stroke />`
            if( z > 0 ) {
                z_shape +="<restore/>"
            }
            this.svg.add(z_group);
        }
        this.shape = `
<background>
    <save/>
    <strokewidth width="3"/>
    ${decoration_shape}
    ${z_shape}
    <restore/>
</background>
<foreground>
    ${hd_shape}
</foreground>`
        console.log( "finally shape ==" + this.shape )
    }

    getSVG(): typeof SVG {
        return this.svg;
    }

    getShape(): string {
        return this.shape!;
    }

};


export { Server as default }
