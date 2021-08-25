// @ts-ignore
import { DriveType, SlotOrientation } from "./harddrive.ts";
// @ts-ignore
import { Server, BoxType } from "./server.ts";
// @ts-ignore
import { svgtojson } from "./svgtojson.ts";
import { SVG } from "@svgdotjs/svg.js";

declare global {
    interface Window {
        clear:any;
        draw:any;
        drawDriveLayout:any;
        downloadString:any;
        showjson:any;
    }
}

//let draw = SVG().addTo('#box').size(700,700);
let draw = SVG().addTo('#box')

window.clear = clear;
window.downloadString = downloadString;
window.drawDriveLayout = drawDriveLayout;
window.draw = draw;
window.showjson = showjson;

function clear(thedraw:any){
    thedraw.clear()
}

function downloadString(text:string, fileType:string, fileName:string) {
    var blob = new Blob([text], { type: fileType  });
    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href);  }, 1500);
}

let ssd_type = [
DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25,
DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25,
DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25,
DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25, DriveType.SSD25
];
/*
let hdd_type = [
DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35,
DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35,
DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35,
DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35, DriveType.HDD35
];
*/

let server = new Server( 'Example', BoxType.Rackmount, 2, 24, 1, 24, ssd_type, SlotOrientation.Vertical);
// let server = new Server( 'Node2', BoxType.Rackmount, 6, 24, 6, 4, hdd_type, SlotOrientation.Horizontal);
// let server = new Server( 'Node3', BoxType.Rackmount, 7, 16, 16, 1, ssd_type, SlotOrientation.Horizontal);
// let server = new Server( 'Node4', BoxType.Rackmount, 2, 24, 3, 4, hdd_type, SlotOrientation.Horizontal);
// let server = new Server( 'Node5', BoxType.Rackmount, 1, 16, 1, 4, hdd_type, SlotOrientation.Horizontal);
// let server = new Server( 'Node6', BoxType.Tower, 3, 16, 4, 4, hdd_type, SlotOrientation.Vertical);
draw.add( server.getSVG().move(5,5) );
draw.size(server.width+10, server.height+10);
// draw.size(700,700)


function drawDriveLayout( svg: any, server_name: string,
        server_type: BoxType, server_unit: number, drive_slot: number,
        drive_row: number, drive_col: number, drives_type: DriveType[],
        slot_type: SlotOrientation, pic_move_x?: number, pic_move_y?: number) {

    let server = new Server( server_name, server_type, server_unit, drive_slot,
    drive_row, drive_col, drives_type, slot_type);
    svg.add( server.getSVG().move(pic_move_x, pic_move_y) );
    svg.size( server.width+10, server.height+10);
}

function showjson( svgstring: string ){
    let json = svgtojson( svgstring );
    let jsonview = document.getElementById('jsonstring');

    if( json && jsonview )
        jsonview.innerHTML = json;
}

// sample server configuration

//Rackmount 2U, 1 Row, 24 Columns, 24 slots 2.5", Drive Vertical, NON-Hot-Swap
//drawDriveLayout(draw, BoxType.Rackmount, 2, 1, 24, 24, DriveType.HDD25, SlotOrientation.Vertical, 50, 50);

//Rackmount 6U, 6 Rows, 4 Columns, 24 slots 3.5", Drive Horizontal, Hot-Swap
//drawDriveLayout(draw, BoxType.Rackmount, 4, 6, 4, 24, DriveType.HDD35, SlotOrientation.Horizontal, 50, 150);

//Rackmount 7U, 16 Rows, 1 Column 16 slots 2.5", Drive Horizontal, Hot-Swap
//Rackmount 4U, 3 Row, 4 Columns, (front 12, back 12) 24 slots 3.5", Drive Horizontal, Hot-Swap
//drawDriveLayout(draw, BoxType.Rackmount, 2, 3, 4, 24, DriveType.HDD35, SlotOrientation.Horizontal, 650, 400);

//Rackmount 1U, 1 Row, 4 Columns, (z1 4, z2 4, z3 4, z4 4) 16 slots 3.5", Drive Horizontal, Hot-Swap
//drawDriveLayout(draw, BoxType.Rackmount, 1, 1, 4, 12, DriveType.HDD35, SlotOrientation.Horizontal, 50, 400);

//Rackmount 1U, 1 Row, 4 Columns, (z1 4, z2 4, z3 4, z4 4) 16 slots 3.5", Drive Horizontal, Hot-Swap
//drawDriveLayout(draw, BoxType.Tower, 4, 1, 5, 5, DriveType.HDD35, SlotOrientation.Vertical, 50, 650);



